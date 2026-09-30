import * as orderService from '../services/order.service.js';
import { validateOrderInput } from '../validators/order.validator.js';

export async function createOrder(req, res, next) {
  try {
    const idempotencyKey = req.get('Idempotency-Key');
    if (!idempotencyKey) {
      return res.status(400).json({
        success: false,
        error: { code: 'MISSING_IDEMPOTENCY_KEY', message: 'Idempotency-Key header is required.' },
      });
    }

    const { errors, normalizedPhone } = validateOrderInput(req.body);
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: errors.join(' ') },
      });
    }

    const result = await orderService.createOrder({
      ...req.body,
      customerPhone: normalizedPhone,
      idempotencyKey,
    });

    res.status(201).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}