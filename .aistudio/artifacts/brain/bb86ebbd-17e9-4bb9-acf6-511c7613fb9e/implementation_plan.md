# Shadow UI Palette Harmonization & Multi-Phone Experience

Chromatic recalibration across the Shadow mobile application ecosystem to faithfully mirror the authentic reference color scheme—featuring the signature warm purple canvas, crisp high-contrast controls, cursive Shadow wordmark, and the 3-device side-by-side showcase as the primary default view.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The following user preferences were confirmed during the interactive interview:

- **Confirmed Decision 1 (Brand Wordmark)**: Display the handwritten italic cursive **"Shadow"** script wordmark in the application header and auth screens, preserving the authentic font pairing (`'Satisfy'`, `'Dancing Script'`) with reference glow and styling.
- **Confirmed Decision 2 (Default Landing View)**: Set the **Multi-Phone Showcase** (side-by-side 3-device layout) as the default entry point when loading the application, presenting the three core screens simultaneously for instant visual comparison.
- **Confirmed Decision 3 (Color Palette Recalibration)**: Eliminate conflicting legacy pink/rose tints across all component layers (`#E1306C`, `#FF0A78`, `#EC4899`, `from-pink-*`) in favor of the authentic reference purple system:
  - **Primary Brand Purple**: `#7B52B9` (vibrant royal purple accent & auth background)
  - **Secondary Orchid Gradient**: `#8456C5` to `#5E3A89` (depth gradient for buttons & active badges)
  - **Atmospheric Mist Accent**: `#D4C4EB` (soft lilac for organic cloud contours and subtle borders)
  - **Deep Ink Text**: `#1F1F2E` (subtitles, field prompts, and high-contrast captions)
  - **Deep Obsidian Navy**: `#0E091C` / `#120C29` (app framing and presentation backdrop)

---

## 1. Overview & Core Concept

- **What It Does**: Presents a unified, pixel-perfect mobile social experience and design system named **Shadow**, faithfully realizing the three reference screens (Welcome with reader illustration, Sign-up with pointing manga character, and Log-in with glasses/bun illustration) alongside an interactive multi-tab mobile simulator with Feed, Explore, Reels, and Profile.
- **Target Audience / Persona**: Mobile product designers, frontend developers, and digital creators seeking an atmospheric, anime/manga-inspired social application with tactile touch targets, seamless light/dark responsiveness, and authentic visual hierarchy.
- **Key Value**: Delivers 100% color fidelity to the reference artwork, harmonizes design tokens across all views, and provides an immediate 3-device showcase on launch without requiring manual tab switches.

---

## 2. User Experience & Visual Design

### Key User Flows

1. **Launch & Multi-Phone Inspection**:
   - The user opens the application and immediately lands on the **Multi-Phone Showcase** displaying three physical devices side-by-side on an atmospheric stardust canvas.
   - Screen 1 showcases *Welcome To Shadow* with organic lilac cloud shapes and the reading armchair illustration.
   - Screen 2 showcases *Sign up to Shadow!* with the Google OAuth button, 4 rounded input pills, terms agreement, and the pointing jacket character.
   - Screen 3 showcases *Log in to Shadow!* with credential fields, forgot password trigger, and the round-glasses manga character.
2. **Interactive Phone Switching**:
   - Using the top segmented navigation, users can switch to the *Interactive Single Phone* mode to test touch flows, live like bursts, comments, camera story simulator, and tab switching.
   - A single-click toggle allows switching between the 3-Screen Auth showcase and the 3-Mockup Feed/Profile comparison.
3. **Tactile Feedback**:
   - Primary action buttons feature smooth `active:scale-95` tactile depression, subtle glow on hover, and custom floating toast feedback.

### Visual Identity & Theme Tokens

```
┌────────────────────────────────────────────────────────┐
│               SHADOW THEME TOKEN MATRIX                │
├───────────────────────┬────────────────────────────────┤
│ Canvas / Presentation │ #090616 ➔ #120C29 (Radial Navy)│
│ Screen Background     │ #7B52B9 (Signature Rich Purple)│
│ Atmospheric Clouds    │ #D4C4EB at 35-40% opacity      │
│ Primary Action Button │ #000000 (Black pill) / Purple  │
│ Headline Typography   │ #FFFFFF (Heavy bold, -0.02em)  │
│ Sub-heading / Labels  │ #1F1F2E (Deep slate-violet ink)│
│ Input Surface         │ #FFFFFF with soft drop shadow  │
│ Brand Script Font     │ Satisfy / Dancing Script       │
│ Body Font             │ Plus Jakarta Sans (400-800)    │
└───────────────────────┴────────────────────────────────┘
```

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Default to the 3-Screen Auth Showcase**
  - *Chosen Approach*: Configure `viewMode` default to `'shadow-auth'`, matching the user's explicit selection for the multi-phone reference layout.
  - *Why*: It presents the exact 3 screens from the user's reference image side-by-side upon first load.
  - *Alternatives Considered*: The 5-screen feed gallery (too crowded for initial viewport) or single phone (lacks the multi-screen layout requested).

- **Decision 2: Comprehensive Token Unification**
  - *Chosen Approach*: Ensure all auxiliary screens, badges, interactive indicators, and phone simulator states reference the `#7B52B9` and `#D4C4EB` color tokens rather than obsolete pink or rose accents.
  - *Why*: Guarantees holistic visual consistency so that navigating from auth to feed, reels, or profile feels like a cohesive brand experience.

- **Decision 3: Non-Destructive High-Contrast Input Controls**
  - *Chosen Approach*: Maintain crisp white input pills (`bg-white text-neutral-900`) with subtle elevation shadows (`shadow-[0_3px_10px_rgba(0,0,0,0.12)]`) on top of the purple screen canvas.
  - *Why*: Satisfies WCAG AAA contrast standards for text input readability while honoring the exact styling of the reference design.

---

## 4. Technical Architecture & Data Strategy

```
┌─────────────────────────────────────────────────────────────────┐
│                           App.tsx                               │
│  • Default viewMode: 'shadow-auth' (Multi-Phone Showcase)       │
│  • Header: Shadow script wordmark + View switcher               │
└───────────────────────────────┬─────────────────────────────────┘
                                │
        ┌───────────────────────┴───────────────────────┐
        ▼                                               ▼
┌────────────────────────────────┐            ┌───────────────────┐
│ ShadowBackgroundDesign.tsx     │            │ semUiPalette.ts   │
│ • Atmospheric celestial glow   │            │ • #7B52B9 Brand   │
│ • Stardust & concentric rings  │            │ • #D4C4EB Cloud   │
└────────────────────────────────┘            └─────────┬─────────┘
                                                        │
        ┌───────────────────────────────────────────────┼───────────────────────────────────────────────┐
        ▼                                               ▼                                               ▼
┌───────────────────────────────┐       ┌───────────────────────────────┐       ┌───────────────────────────────┐
│ Phone 1: Welcome Screen       │       │ Phone 2: Sign-up Screen       │       │ Phone 3: Log-in Screen        │
│ • "Welcome To Shadow"         │       │ • "Sign up to Shadow!"        │       │ • "Log in to Shadow!"         │
│ • "another you" subtext       │       │ • Google Auth + Email Inputs  │       │ • Username & Password inputs  │
│ • Black Sign-up CTA           │       │ • Terms checkbox + Create CTA │       │ • Forgot? trigger + Login CTA │
│ • Armchair reading manga art  │       │ • Pointing jacket manga art   │       │ • Glasses & bun manga art     │
└───────────────────────────────┘       └───────────────────────────────┘       └───────────────────────────────┘
```

### Component & State Mapping

1. **`App.tsx`**:
   - Initial state: `viewMode = 'shadow-auth'`
   - Header lockup: Uses `<span className="font-shadow-script text-2xl text-white tracking-wide">Shadow</span>` with refined lavender badge.
2. **`ShhAuthScreen.tsx` / `ShadowAuthScreen.tsx`**:
   - Unified background: `#7B52B9` calibrated purple.
   - Organic background mist shapes: `#D4C4EB`.
   - Manga artwork integration: Clean transparent perimeter extraction via `MangaArtwork.tsx`.
3. **`PhoneSimulator.tsx` & Feed Components**:
   - Retain complete interactive state (likes, bookmarks, comments drawer, camera simulator) while using the purple token system for all accents.
