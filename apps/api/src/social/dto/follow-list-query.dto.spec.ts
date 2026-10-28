import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { FollowListQueryDto } from './follow-list-query.dto';

describe('FollowListQueryDto - ValidationPipe Tests', () => {
  let pipe: ValidationPipe;

  beforeEach(() => {
    pipe = new ValidationPipe({ whitelist: true, transform: true });
  });

  const transformQuery = (query: Record<string, any>) =>
    pipe.transform(query, { type: 'query', metatype: FollowListQueryDto });

  it('DTO-1: defaults to limit === 20 when limit is omitted', async () => {
    const result = (await transformQuery({})) as FollowListQueryDto;

    expect(result).toBeInstanceOf(FollowListQueryDto);
    expect(result.limit).toBe(20);
    expect(typeof result.limit).toBe('number');
  });

  it('DTO-2: rejects explicit empty string (?limit=)', async () => {
    await expect(transformQuery({ limit: '' })).rejects.toThrow(
      BadRequestException,
    );
  });

  it('DTO-3: rejects string "null" (?limit=null)', async () => {
    await expect(transformQuery({ limit: 'null' })).rejects.toThrow(
      BadRequestException,
    );
  });

  it('DTO-4: rejects explicit null reaching DTO (in-memory injection)', async () => {
    await expect(transformQuery({ limit: null })).rejects.toThrow(
      BadRequestException,
    );
  });

  it('DTO-5: rejects repeated query parameters (array)', async () => {
    await expect(transformQuery({ limit: ['10', '20'] })).rejects.toThrow(
      BadRequestException,
    );
  });

  it('DTO-6: rejects non-numeric string (?limit=abc)', async () => {
    await expect(transformQuery({ limit: 'abc' })).rejects.toThrow(
      BadRequestException,
    );
  });

  it('DTO-7: rejects fractional float (?limit=10.5)', async () => {
    await expect(transformQuery({ limit: '10.5' })).rejects.toThrow(
      BadRequestException,
    );
  });

  it('DTO-8: rejects zero (?limit=0)', async () => {
    await expect(transformQuery({ limit: '0' })).rejects.toThrow(
      BadRequestException,
    );
  });

  it('DTO-9: rejects negative numbers (?limit=-5)', async () => {
    await expect(transformQuery({ limit: '-5' })).rejects.toThrow(
      BadRequestException,
    );
  });

  it('DTO-10: rejects values greater than 50 (?limit=51)', async () => {
    await expect(transformQuery({ limit: '51' })).rejects.toThrow(
      BadRequestException,
    );
  });

  it('DTO-11: accepts boundary value 1', async () => {
    const result = (await transformQuery({ limit: '1' })) as FollowListQueryDto;
    expect(result.limit).toBe(1);
  });

  it('DTO-12: accepts boundary value 50', async () => {
    const result = (await transformQuery({ limit: '50' })) as FollowListQueryDto;
    expect(result.limit).toBe(50);
  });

  it('DTO-13: accepts intermediate integer value 25', async () => {
    const result = (await transformQuery({ limit: '25' })) as FollowListQueryDto;
    expect(result.limit).toBe(25);
  });

  it('DTO-14: trims search string and removes whitespace-only search', async () => {
    const resWithSearch = (await transformQuery({
      search: '  alice  ',
    })) as FollowListQueryDto;
    expect(resWithSearch.search).toBe('alice');

    const resWhitespace = (await transformQuery({
      search: '    ',
    })) as FollowListQueryDto;
    expect(resWhitespace.search).toBeUndefined();
  });

  it('DTO-15: rejects search strings longer than 50 characters', async () => {
    await expect(
      transformQuery({ search: 'a'.repeat(51) }),
    ).rejects.toThrow(BadRequestException);
  });
});
