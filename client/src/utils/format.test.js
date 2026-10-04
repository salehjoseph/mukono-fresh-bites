import { describe, it, expect } from 'vitest';
import { formatUGX } from './format';

describe('formatUGX', () => {
  it('formats whole numbers as UGX currency', () => {
    expect(formatUGX(15000)).toContain('15,000');
  });
});