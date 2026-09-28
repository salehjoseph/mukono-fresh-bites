import { BUSINESS } from '../constants/business';

export function whatsappLink(message = 'Hello, I would like to order.') {
  if (!BUSINESS.whatsapp) return null; // degrade gracefully when not configured
  return `https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(message)}`;
}