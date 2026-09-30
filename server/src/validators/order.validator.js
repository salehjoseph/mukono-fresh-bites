import { normalizeUgandaPhone } from './phone.js';

export function validateOrderInput(body) {
  const errors = [];

  if (!body.customerName || body.customerName.trim().length < 2) {
    errors.push('Customer name is required.');
  }

  const phone = normalizeUgandaPhone(body.customerPhone);
  if (!phone) {
    errors.push('A valid Ugandan phone number is required (e.g. 07XXXXXXXX).');
  }

  if (!['PICKUP', 'DELIVERY'].includes(body.orderType)) {
    errors.push('Order type must be PICKUP or DELIVERY.');
  }

  if (body.orderType === 'DELIVERY' && !body.deliveryZoneId) {
    errors.push('A delivery zone is required for delivery orders.');
  }

  if (!Array.isArray(body.items) || body.items.length === 0) {
    errors.push('At least one item is required.');
  } else {
    for (const line of body.items) {
      if (!line.menuItemId || !Number.isInteger(line.quantity) || line.quantity < 1 || line.quantity > 20) {
        errors.push('Each item needs a valid menuItemId and a quantity between 1 and 20.');
        break;
      }
    }
  }

  return { errors, normalizedPhone: phone };
}