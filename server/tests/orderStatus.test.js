import { describe, it, expect } from 'vitest';
import { canTransition, getAllowedNextStatuses } from '../src/services/orderStatus.service.js';

describe('order status transitions', () => {
  it('allows PENDING to CONFIRMED', () => {
    expect(canTransition('PENDING', 'CONFIRMED')).toBe(true);
  });
  it('rejects PENDING to COMPLETED', () => {
    expect(canTransition('PENDING', 'COMPLETED')).toBe(false);
  });
  it('rejects transitions from terminal states', () => {
    expect(canTransition('COMPLETED', 'PENDING')).toBe(false);
    expect(canTransition('CANCELLED', 'CONFIRMED')).toBe(false);
  });
  it('only offers the matching delivery path', () => {
    expect(getAllowedNextStatuses('PREPARING', 'PICKUP')).toEqual(['READY_FOR_PICKUP', 'CANCELLED']);
    expect(getAllowedNextStatuses('PREPARING', 'DELIVERY')).toEqual(['OUT_FOR_DELIVERY', 'CANCELLED']);
  });
});