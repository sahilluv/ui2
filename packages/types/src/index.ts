export type ShadowRankType =
  | 'PAWN'
  | 'KNIGHT'
  | 'BISHOP'
  | 'ROOK'
  | 'QUEEN'
  | 'KING';

export type VerificationStatus = 'UNVERIFIED' | 'VERIFIED';

export type AppEnvironment = 'development' | 'test' | 'production';

export type HealthStatus = {
  status: 'ok';
  service: string;
  timestamp: string;
};
