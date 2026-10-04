import { describe, it, expect } from 'vitest';
import { normalizeUgandaPhone } from '../src/validators/phone.js';

describe('normalizeUgandaPhone', () => {
  it('normalizes 07XXXXXXXX format', () => {
    expect(normalizeUgandaPhone('0765746535')).toBe('+256765746535');
  });
  it('normalizes 256XXXXXXXXX format', () => {
    expect(normalizeUgandaPhone('256765746535')).toBe('+256765746535');
  });
  it('rejects invalid input', () => {
    expect(normalizeUgandaPhone('12345')).toBeNull();
    expect(normalizeUgandaPhone('')).toBeNull();
  });
});