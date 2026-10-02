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

export async function listOrdersAdmin(req, res, next) {
  try {
    const { status } = req.query;
    const orders = await orderService.listOrders({ status });
    res.json({ success: true, data: orders });
  } catch (err) {
    next(err);
  }
}

export async function getOrderAdmin(req, res, next) {
  try {
    const order = await orderService.getOrderById(req.params.id);
    res.json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
}

export async function updateOrderStatusAdmin(req, res, next) {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'status is required.' },
      });
    }
    const result = await orderService.changeOrderStatus(req.params.id, status);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}