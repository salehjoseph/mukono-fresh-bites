const TRANSITIONS = {
  PENDING: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['PREPARING', 'CANCELLED'],
  PREPARING: ['READY_FOR_PICKUP', 'OUT_FOR_DELIVERY', 'CANCELLED'],
  READY_FOR_PICKUP: ['COMPLETED'],
  OUT_FOR_DELIVERY: ['COMPLETED'],
  COMPLETED: [],
  CANCELLED: [],
  FAILED: [],
};

export function canTransition(fromStatus, toStatus) {
  return (TRANSITIONS[fromStatus] || []).includes(toStatus);
}

export function getAllowedNextStatuses(currentStatus, orderType) {
  const allowed = TRANSITIONS[currentStatus] || [];
  // Only offer the one delivery-path status that actually matches this order's type.
  if (currentStatus === 'PREPARING') {
    return allowed.filter((s) => {
      if (s === 'READY_FOR_PICKUP') return orderType === 'PICKUP';
      if (s === 'OUT_FOR_DELIVERY') return orderType === 'DELIVERY';
      return true; // CANCELLED stays available either way
    });
  }
  return allowed;
}