import { Link, useLocation, Navigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import Button from '../components/Button';
import Seo from '../components/Seo';
import { formatUGX } from '../utils/format';
import { whatsappLink } from '../utils/whatsapp';

export default function OrderConfirmation() {
  const location = useLocation();
  const order = location.state?.order;

  // If someone lands here directly (refresh, bookmark) with no order in memory, send them to the menu
  // instead of showing a broken page.
  if (!order) {
    return <Navigate to="/menu" replace />;
  }

  const wa = whatsappLink(`Hi, I just placed order ${order.orderNumber}.`);

  return (
    <>
      <Seo title="Order confirmed" />
      <div className="mx-auto max-w-md text-center">
        <CheckCircle className="mx-auto text-brand-700" size={48} aria-hidden="true" />
        <h1 className="mt-4 text-2xl font-bold text-brand-800">Order placed</h1>
        <p className="mt-2 text-muted">
          Thank you. We've received your order and will confirm it shortly.
        </p>

        <div className="mt-6 rounded-lg border border-stone-200 bg-white p-5 text-left">
          <p className="text-sm text-muted">Order number</p>
          <p className="text-lg font-bold text-brand-800">{order.orderNumber}</p>
          {!order.alreadyExisted && (
            <>
              <div className="mt-3 border-t border-stone-200 pt-3 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatUGX(order.subtotalUgx)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery fee</span>
                  <span>{formatUGX(order.deliveryFeeUgx)}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>{formatUGX(order.totalUgx)}</span>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="mt-6 flex flex-col gap-3">
          {wa && (
            <Button href={wa} variant="secondary">
              Confirm on WhatsApp
            </Button>
          )}
          <Link to="/menu" className="text-sm underline">
            Back to menu
          </Link>
        </div>
      </div>
    </>
  );
}