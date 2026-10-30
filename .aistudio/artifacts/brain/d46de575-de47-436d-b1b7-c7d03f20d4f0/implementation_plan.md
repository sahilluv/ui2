# Shadow V10 — Final Invariant Closure & Migration Safety Implementation Plan

Comprehensive architectural specification and phase-by-phase implementation plan for **Verified Real-World Shadow Sightings and the Immutable Ranking Engine**.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> **Confirmed User Directives (Incorporated into V10):**
> 1. **Hardware Ownership Timeline:** Explicitly supports unowned periods/gaps (Pre-activation, Owned, Unowned). Gaps are natural intervals with no active owner; sightings occurring during gaps are rejected. Enforced via PostgreSQL Range Exclusion Constraints (`btree_gist`).
> 2. **Trusted Capture Verification:** Never trust client timestamps. Utilizes server-issued cryptographic challenges (`challengeId`, `issuedAt`, `expiresAt`, nonce), server receipt timestamp (`serverReceivedAt`), and real-time online verification.
> 3. **Account Erasure & Detachment:** Hybrid model: `CASCADE` delete direct PII (`Profile`, `Session`, `Follow`); `SET NULL` / detach long-lived hardware, ownership, and financial records (`PhysicalShadowItem`, `HardwareOwnershipHistory`, `SightingJournalEntry`, `SightingDispute`). Preserves audit and financial integrity without orphan constraint failures.
>
> **Frozen Product Policies (Undecided — Maintained as Dynamic Configuration):**
> - Discovery-to-Exposure Credit Ratio (Undecided).
> - Pairwise Encounter Cooldown Window (Undecided).
> - Daily Observer Sighting Cap (Undecided).
> - Raw Media Retention Period (Undecided).
> - Promotion Integration Policy (Undecided — sightings do not alter rank tiers automatically).

---

## 1. Overview & Core Concept

Shadow users discover physical, branded representations of other users' Shadows in the physical world. Using the application's camera and NFC sensor, an observer captures an encounter and submits it for multi-signal verification. Upon verification and policy evaluation:
- The **Observer** receives **Discovery Credit** in an immutable append-only journal.
- The **Physical Shadow Owner** receives **Exposure Credit** in the same journal.
- Both credits are committed atomically, never updated in place, and reversed exclusively via explicit compensating entries.

```
                     CORE ENCOUNTER & VERIFICATION FLOW
                     
  [Observer Client]                          [Physical Shadow Hardware]
         │                                               │
         │ 1. Request Capture Challenge                  │
         │ ──────────────────────────────► [Backend]     │
         │ ◄────────────────────────────── (Challenge)   │
         │                                               │
         │ 2. Scan QR & Tap NFC (ISO/IEC 7816-4)         │
         │ ─────────────────────────────────────────────►│
         │ ◄─────────────────────────────────────────────│
         │   (Encrypted PICC Data + SDM Dynamic CMAC)    │
         │                                               │
         │ 3. Submit Sighting (Challenge ID + Payload)   │
         │ ──────────────────────────────► [Backend]     │
                                                │
                                                ▼
                                    ┌───────────────────────┐
                                    │ Multi-Signal Engine   │
                                    │ • Decrypt PICC Data   │
                                    │ • Validate CMAC       │
                                    │ • Check Counter Range │
                                    │ • Verify Active Owner │
                                    └───────────┬───────────┘
                                                │
                                    ┌───────────┴───────────┐
                                    │ PENDING_EVALUATION    │
                                    │ • Cooldown Check      │
                                    │ • Daily Cap Check     │
                                    │ • Privacy Prefs Check │
                                    └───────────┬───────────┘
                                                │
                                                ▼
                                    ┌───────────────────────┐
                                    │ ATOMIC COMMIT:        │
                                    │ + Discovery Award     │
                                    │ + Exposure Award      │
                                    │ + Outbox Event        │
                                    └───────────────────────┘
```

---

## 2. Technical Architecture & Invariant Closure

### 2.1 Complete 9-Level Deadlock-Free Lock Hierarchy

To guarantee zero circular wait conditions across awards, reversals, disputes, hardware transfers, outbox leases, and reconciliations, every transaction acquires locks in strictly ascending order:

```
  LEVEL 1: SightingDispute             (PK: disputeId)
     │
     ▼
  LEVEL 2: SightingAdjustmentCommand   (PK: commandId)
     │
     ▼
  LEVEL 3: ShadowSighting              (PK: sightingId)
     │
     ▼
  LEVEL 4: PhysicalShadowItem          (PK: physicalShadowId)
     │
     ▼
  LEVEL 5: HardwareOwnershipHistory    (Range Lock via EXCLUDE constraint)
     │
     ▼
  LEVEL 6: SightingJournalEntry        (PK: originalEntryId - Reversals Only)
     │
     ▼
  LEVEL 7: ShadowRank Lower User ID    (Lexicographical compare: MIN(observerId, ownerId))
     │
     ▼
  LEVEL 8: ShadowRank Higher User ID   (Lexicographical compare: MAX(observerId, ownerId))
     │
     ▼
  LEVEL 9: OutboxEvent                 (PK: eventId / Lease Claim)
```

#### Transaction Lock Acquisition Paths:
1. **Sighting Verification & Claim:** Level 4 (`PhysicalShadowItem`) $\rightarrow$ Level 5 (`HardwareOwnershipHistory` check) $\rightarrow$ Insert `NfcCounterClaim` $\rightarrow$ Insert `ShadowSighting` (Level 3).
2. **Award Sighting Credits:** Level 3 (`ShadowSighting`) $\rightarrow$ Level 4 (`PhysicalShadowItem`) $\rightarrow$ Level 7 (`ShadowRank` Min) $\rightarrow$ Level 8 (`ShadowRank` Max) $\rightarrow$ Insert Journal $\rightarrow$ Insert Outbox (Level 9).
3. **Reversal Command Execution:** Level 1 (`SightingDispute`) $\rightarrow$ Level 2 (`SightingAdjustmentCommand`) $\rightarrow$ Level 3 (`ShadowSighting`) $\rightarrow$ Level 6 (`SightingJournalEntry` Original) $\rightarrow$ Level 7 (`ShadowRank` Target) $\rightarrow$ Insert Compensating Entry.
4. **Hardware Transfer:** Level 4 (`PhysicalShadowItem`) $\rightarrow$ Level 5 (`HardwareOwnershipHistory` close current + open new in single transaction).
5. **Periodic Reconciliation Worker:** Level 7 (`ShadowRank` Target User) $\rightarrow$ Read Journal $\rightarrow$ Update Projection & Watermark.
6. **Outbox Lease Worker:** Level 9 (`OutboxEvent` SKIP LOCKED).

---

### 2.2 Concurrency-Safe Reversal Engine & Trigger Invariants

```sql
-- PostgreSQL Concurrency-Safe Reversal Trigger
CREATE OR REPLACE FUNCTION enforce_reversal_invariants()
RETURNS TRIGGER AS $$
DECLARE
  orig RECORD;
  prior_reversals_sum INT;
BEGIN
  -- Original Awards: must have positive units and no reversesEntryId
  IF NEW."reversesEntryId" IS NULL THEN
    IF NEW."entryType" NOT IN ('DISCOVERY_AWARD', 'EXPOSURE_AWARD') THEN
      RAISE EXCEPTION 'Entries without reversesEntryId must be original awards';
    END IF;
    IF NEW."units" <= 0 THEN
      RAISE EXCEPTION 'Original awards must have positive units';
    END IF;
    RETURN NEW;
  END IF;

  -- Compensating Reversals: must have negative units and valid reverse reference
  IF NEW."entryType" NOT IN ('DISCOVERY_REVERSAL', 'EXPOSURE_REVERSAL') THEN
    RAISE EXCEPTION 'Entries with reversesEntryId must be compensating reversals';
  END IF;
  IF NEW."units" >= 0 THEN
    RAISE EXCEPTION 'Compensating reversals must have negative units';
  END IF;

  -- Lock original award row exclusively. Serializes concurrent reversals for this award.
  SELECT "id", "userId", "sightingId", "entryType", "units", "reversesEntryId"
  INTO orig
  FROM "SightingJournalEntry"
  WHERE "id" = NEW."reversesEntryId"
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Referenced original entry % does not exist', NEW."reversesEntryId";
  END IF;

  -- Block Reversal-of-a-Reversal
  IF orig."reversesEntryId" IS NOT NULL THEN
    RAISE EXCEPTION 'Cannot reverse an entry that is already a reversal';
  END IF;

  -- Enforce Recipient and Sighting Invariants
  IF NEW."userId" != orig."userId" THEN
    RAISE EXCEPTION 'Reversal userId does not match original award recipient';
  END IF;
  IF NEW."sightingId" != orig."sightingId" THEN
    RAISE EXCEPTION 'Reversal sightingId does not match original sighting';
  END IF;

  -- Enforce Symmetric Types
  IF orig."entryType" = 'DISCOVERY_AWARD' AND NEW."entryType" != 'DISCOVERY_REVERSAL' THEN
    RAISE EXCEPTION 'Type mismatch: DISCOVERY_AWARD requires DISCOVERY_REVERSAL';
  END IF;
  IF orig."entryType" = 'EXPOSURE_AWARD' AND NEW."entryType" != 'EXPOSURE_REVERSAL' THEN
    RAISE EXCEPTION 'Type mismatch: EXPOSURE_AWARD requires EXPOSURE_REVERSAL';
  END IF;

  -- Enforce Bounded Capacity: |prior + new| <= original
  SELECT COALESCE(SUM("units"), 0) INTO prior_reversals_sum
  FROM "SightingJournalEntry"
  WHERE "reversesEntryId" = orig."id";

  IF ABS(prior_reversals_sum + NEW."units") > orig."units" THEN
    RAISE EXCEPTION 'Cumulative over-reversal: available %, attempted %',
      orig."units" - ABS(prior_reversals_sum), ABS(NEW."units");
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

---

### 2.3 NTAG424 DNA Secure Dynamic Messaging (SDM) Byte-Level Specification

Grounded in NXP NTAG424 DNA Technical Specification (NT4H2421Gx):

1. **Tag Diversification Key ($K_{\text{div}}$):**
   - Diversification input $M = \text{0x01} \parallel \text{UID} (7\text{ bytes}) \parallel \text{0x00...00}$ (padded to 16 bytes).
   - $K_{\text{div}} = \text{AES-128-CMAC}(K_{\text{master}}, M)$.
2. **PICC Data Decryption:**
   - Session Decryption Key: $K_{\text{SES\_PICC}} = \text{AES-128-CMAC}(K_{\text{div}}, \text{0x5A} \parallel \text{0x00} \parallel \text{0x01} \parallel \text{0x00...00})$.
   - `picc_data` (16 bytes) decrypted via AES-128-CBC ($\text{IV} = \mathbf{0}_{16}$).
   - Decrypted layout:
     - `Byte 0`: Header (`0xC7` for mirrored UID & Counter).
     - `Bytes 1..7`: Chip UID (7 bytes).
     - `Bytes 8..10`: 3-byte Counter $C_{\text{hardware}}$ (Little-Endian: $C = B_8 + 256 B_9 + 65536 B_{10}$).
     - `Bytes 11..15`: Padding (`0x80` followed by `0x00`).
3. **Session MAC Key ($K_{\text{SES\_MAC}}$) & CMAC Verification:**
   - Derivation: $K_{\text{SES\_MAC}} = \text{AES-128-CMAC}(K_{\text{div}}, \text{0x5A} \parallel \text{0x00} \parallel \text{0x02} \parallel C_{\text{hardware}} [3\text{ bytes LSB}] \parallel \text{0x00...00})$.
   - Input: ASCII bytes of URL parameters prior to `&cmac=`.
   - Truncation: 8 bytes extracted using odd-indexed bytes ($[T_1, T_3, T_5, T_7, T_9, T_{11}, T_{13}, T_{15}]$).
   - Validation: Constant-time comparison against received `cmac` parameter.

---

### 2.4 Hardware Ownership Intervals with Legitimate Gaps

PostgreSQL Range Exclusion Constraint prevents overlapping ownership while permitting natural unowned gaps:

```sql
-- Enable btree_gist extension
CREATE EXTENSION IF NOT EXISTS btree_gist;

-- Range Exclusion Constraint
ALTER TABLE "HardwareOwnershipHistory"
ADD CONSTRAINT "no_overlapping_hardware_ownership"
EXCLUDE USING gist (
  "physicalShadowId" WITH =,
  tstzrange("effectiveFrom", COALESCE("effectiveTo", 'infinity'::timestamptz), '[)') WITH &&
);
```

#### Ownership Attribution at Sighting Capture:
```sql
SELECT "ownerId"
FROM "HardwareOwnershipHistory"
WHERE "physicalShadowId" = :hardwareId
  AND tstzrange("effectiveFrom", COALESCE("effectiveTo", 'infinity'::timestamptz), '[)') @> :serverReceivedAt;
-- If no row found: Sighting occurred during an unowned gap. Verification status set to REJECTED.
```

---

### 2.5 Complete Foreign-Key Inventory & Account Erasure Detachment

```
┌────┬──────────────────────────────────────┬──────────────────┬──────────────┬──────────────────────────────────────────┐
│ #  │ Model & Field                        │ Target Model     │ Action       │ Deletion & Detachment Behavior           │
├────┼──────────────────────────────────────┼──────────────────┼──────────────┼──────────────────────────────────────────┤
│ 1  │ `Profile.userId`                     │ `User.id`        │ CASCADE      │ Hard Deleted upon erasure request.       │
│ 2  │ `Session.userId`                     │ `User.id`        │ CASCADE      │ Hard Deleted upon erasure request.       │
│ 3  │ `Follow.followerId`                  │ `User.id`        │ CASCADE      │ Hard Deleted upon erasure request.       │
│ 4  │ `Follow.followingId`                 │ `User.id`        │ CASCADE      │ Hard Deleted upon erasure request.       │
│ 5  │ `Post.authorId`                      │ `User.id`        │ CASCADE      │ Content scrubbed or deleted.             │
│ 6  │ `Shadow.userId`                      │ `User.id`        │ CASCADE      │ Deactivated; shell preserved.            │
│ 7  │ `ShadowRank.userId`                  │ `User.id`        │ CASCADE      │ Retained for tournament audit defense.   │
│ 8  │ `ShadowVerification.userId`          │ `User.id`        │ CASCADE      │ Marked REVOKED; shell preserved.         │
│ 9  │ `EncounterPreference.userId`         │ `User.id`        │ CASCADE      │ Hard Deleted upon erasure request.       │
│ 10 │ `PhysicalShadowItem.ownerId`         │ `User.id`        │ SET NULL     │ Hardware detached; marked DECOMMISSIONED.│
│ 11 │ `HardwareOwnershipHistory.ownerId`   │ `User.id`        │ SET NULL     │ Historical owner detached; interval kept.│
│ 12 │ `HardwareOwnershipHistory.hwId`      │ `PhysicalShadow` │ RESTRICT     │ Immutable hardware record.               │
│ 13 │ `ShadowSighting.observerId`          │ `User.id`        │ SET NULL     │ Historical encounter preserved.          │
│ 14 │ `ShadowSighting.ownerId`             │ `User.id`        │ SET NULL     │ Historical encounter preserved.          │
│ 15 │ `ShadowSighting.physicalShadowId`    │ `PhysicalShadow` │ RESTRICT     │ Hardware link preserved.                 │
│ 16 │ `ShadowSighting.storyPostId`         │ `Post.id`        │ SET NULL     │ Story expiry nulls link; sighting stays. │
│ 17 │ `SightingVerificationEvent.sightId`  │ `ShadowSighting` │ RESTRICT     │ Multi-signal telemetry preserved.        │
│ 18 │ `SightingJournalEntry.userId`        │ `User.id`        │ SET NULL     │ Balance preserved; actor detached.       │
│ 19 │ `SightingJournalEntry.sightingId`    │ `ShadowSighting` │ RESTRICT     │ Immutable ledger link.                   │
│ 20 │ `SightingJournalEntry.reversesId`    │ `JournalEntry.id`│ RESTRICT     │ Reversal link preserved.                 │
│ 21 │ `SightingAdjustmentCommand.userId`   │ `User.id`        │ SET NULL     │ Command target detached; audit kept.     │
│ 22 │ `SightingDispute.claimantId`         │ `User.id`        │ SET NULL     │ Claimant detached; dispute kept.         │
└────┴──────────────────────────────────────┴──────────────────┴──────────────┴──────────────────────────────────────────┘
```

---

### 2.6 Outbox Lease, Consumer Inbox & Idempotency Engine

```
  PRODUCER: Outbox Two-Phase Lease Claim
  ┌────────────────────────────────────────────────────────────────────────┐
  │ 1. Claim Batch:                                                        │
  │    UPDATE "OutboxEvent"                                                │
  │    SET status = 'IN_FLIGHT', leaseToken = gen_random_uuid(),            │
  │        leaseExpiresAt = NOW() + INTERVAL '30 seconds',                 │
  │        retryCount = retryCount + 1                                     │
  │    WHERE id IN (SELECT id FROM "OutboxEvent" ... FOR UPDATE SKIP LOCKED)│
  │ 2. Publish outside DB transaction.                                     │
  │ 3. Acknowledge:                                                        │
  │    UPDATE "OutboxEvent" SET status = 'PUBLISHED', publishedAt = NOW()   │
  │    WHERE id = :id AND leaseToken = :token AND leaseExpiresAt >= NOW(); │
  └────────────────────────────────────────────────────────────────────────┘
                                     │
                                     ▼
  CONSUMER: Atomic Consumer Inbox Deduplication
  ┌────────────────────────────────────────────────────────────────────────┐
  │ Consumer Transaction (Prisma $transaction):                            │
  │ 1. INSERT INTO "ConsumerInbox" ("consumerGroup", "eventKey", "at")     │
  │    VALUES (:group, :key, NOW());                                       │
  │    • UNIQUE("consumerGroup", "eventKey") throws 23505 on replay.       │
  │ 2. Execute local domain side-effect.                                   │
  │ 3. Commit both atomically.                                             │
  └────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Phased Implementation Plan

```
  Phase 1: Database Migration & Schema Foundations
  • Add btree_gist extension and Range Exclusion Constraints.
  • Create PhysicalShadowItem, HardwareOwnershipHistory, SightingChallenge.
  • Create ShadowSighting, SightingVerificationEvent, SightingJournalEntry.
  • Create SightingAdjustmentCommand, OutboxEvent, ConsumerInbox.
  • Deploy PostgreSQL trigger enforce_reversal_invariants().
        │
        ▼
  Phase 2: Core Cryptographic & Hardware Verification Services
  • Implement NTAG424 DNA SDM verification service (KMS key diversification).
  • Implement server-issued challenge-response session service.
  • Test AN12196 test vectors and invalid CMAC / replayed counter rejections.
        │
        ▼
  Phase 3: Append-Only Credit Journal & Concurrency Engine
  • Implement atomic award transaction (Paired Discovery + Exposure).
  • Implement SightingAdjustmentCommand execution with original row locking.
  • Implement periodic reconciliation worker with exclusive ShadowRank lock.
  • Run parallel concurrency test suites (deadlock and capacity checks).
        │
        ▼
  Phase 4: Mobile Camera & Real-Time Ingest Pipeline
  • Implement camera viewfinder QR scanning mode in StoryCameraOverlay.tsx.
  • Implement real-time challenge-bound sighting submission endpoint.
  • Verify Story publishing remains decoupled from sighting verification.
        │
        ▼
  Phase 5: Account Erasure & Decommissioning Workflows
  • Implement 6-stage Account Erasure Workflow with foreign key SET NULL.
  • Implement Hardware Decommissioning and Ownership Transfer service.
  • Verify complete deletion test suite covering all 22 relationships.
```

---

## 4. Verification & Testing Strategy

- **Reversal Capacity Test:** 20 parallel workers attempt $-7$ reversals on a $+10$ award; exactly one succeeds, 19 fail with capacity errors.
- **Deadlock Stress Test:** 50 concurrent bidirectional sightings between alternating pairs; zero deadlocks observed.
- **Reconciliation Snapshot Test:** Concurrent write-through awards during reconciliation; zero credit balance drift.
- **Ownership Gap Test:** Hardware manufactured 1 Jan, owned 10 Jan; sighting submitted for 5 Jan is rejected with `HARDWARE_UNOWNED`.
- **NFC Counter Replay Test:** Submitting counter $C$ twice within backward window $W$; first commits, second throws duplicate claim exception.
- **Outbox Recovery Test:** Worker killed during publish phase; lease expires after 30s and event is reclaimed by secondary worker.
- **Account Erasure Test:** User with historical sightings and journal entries requests erasure; PII purged, foreign keys set to NULL, historical balances remain intact.
