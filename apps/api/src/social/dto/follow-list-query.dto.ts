import { Transform } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class FollowListQueryDto {
  @Transform(({ value }) => {
    // 1. Genuinely omitted query parameter -> default 20
    if (value === undefined) {
      return 20;
    }

    // 2. Explicit empty string ("" from ?limit= or ?limit), explicit null, or repeated query parameter (array)
    if (value === '' || value === null || Array.isArray(value)) {
      return NaN;
    }

    // 3. String representations (from query parser)
    if (typeof value === 'string') {
      const trimmed = value.trim();
      // Strict regex: integer format only; rejects floats ("10.5"), string "null", alphabetic strings
      if (!/^-?\d+$/.test(trimmed)) {
        return NaN;
      }
      return Number(trimmed);
    }

    // 4. Number representations (direct in-memory injection)
    if (typeof value === 'number') {
      return Number.isInteger(value) ? value : NaN;
    }

    return NaN;
  })
  @IsInt({ message: 'limit must be an integer number' })
  @Min(1, { message: 'limit must not be less than 1' })
  @Max(50, { message: 'limit must not be greater than 50' })
  limit: number = 20;

  @IsOptional()
  @IsString({ message: 'cursor must be a string' })
  cursor?: string;

  @IsOptional()
  @IsString({ message: 'search must be a string' })
  @Transform(({ value }) => {
    if (typeof value !== 'string') return value;
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
  })
  @MaxLength(50, { message: 'search cannot exceed 50 characters' })
  search?: string;
}
