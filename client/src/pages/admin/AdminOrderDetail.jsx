import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Button from '../../components/Button';
import Seo from '../../components/Seo';
import { useFetch } from '../../hooks/useFetch';
import { apiGet, apiPatch } from '../../services/api';
import { formatUGX } from '../../utils/format';

const STATUS_LABELS = {
  CONFIRMED: 'Confirm order',
  PREPARING: 'Start preparing',
  READY_FOR_PICKUP: 'Mark ready for pickup',
  OUT_FOR_DELIVERY: 'Send out for delivery',
  COMPLETED: 'Mark completed',
  CANCELLED: 'Cancel order',
};

export default function AdminOrderDetail() {
  const { id } = useParams();
  const { data: order, loading, error, refetch } = useFetch(() => apiGet(`/admin/orders/${id}`), [id]);
  const [updating, setUpdating] = useState(false);
  const [actionError, setActionError] = useState(null);

  async function handleStatusChange(newStatus) {
    if (newStatus === 'CANCELLED' && !window.confirm('Cancel this order? This cannot be undone.')) {
      return;
    }
    setActionError(null);
    setUpdating(true);
    try {
      await apiPatch(`/admin/orders/${id}/status`, { status: newStatus });
      await refetch();
    } catch (err) {
      setActionError(err.message);
    } finally {
      setUpdating(false);
    }
  }

  if (loading) return <p className="text-muted">Loading order...</p>;
  if (error) return <p className="rounded border border-red-300 bg-red-50 p-3 text-red-800">{error}</p>;
  if (!order) return null;

  return (
    <>
      <Seo title={`Order ${order.order_number}`} />
      <Link to="/admin/orders" className="text-sm text-brand-800 underline">
        ← Back to orders
      </Link>

      <h1 className="mt-2 text-2xl font-bold text-brand-800">{order.order_number}</h1>
      <p className="text-muted">Status: {order.status.replace(/_/g, ' ')}</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-stone-200 bg-white p-5">
          <h2 className="font-semibold text-ink">Customer</h2>
          <p className="mt-2 text-sm">{order.customer_name}</p>
          <p className="text-sm text-muted">{order.customer_phone}</p>
          <p className="mt-3 text-sm">
            <strong>{order.order_type}</strong>
            {order.order_type === 'DELIVERY' && order.delivery_address && (
              <span className="text-muted"> — {order.delivery_address}</span>
            )}
          </p>
          {order.customer_notes && (
            <p className="mt-3 text-sm italic text-muted">"{order.customer_notes}"</p>
          )}
        </div>

        <div className="rounded-lg border border-stone-200 bg-white p-5">
          <h2 className="font-semibold text-ink">Items</h2>
          <ul className="mt-2 space-y-1 text-sm">
            {order.items.map((item, i) => (
              <li key={i} className="flex justify-between">
                <span>
                  {item.quantity}x {item.item_name}
                </span>
                <span>{formatUGX(item.line_total_ugx)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 space-y-1 border-t border-stone-200 pt-3 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatUGX(order.subtotal_ugx)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery fee</span>
              <span>{formatUGX(order.delivery_fee_ugx)}</span>
            </div>
            <div className="flex justify-between font-bold text-brand-800">
              <span>Total</span>
              <span>{formatUGX(order.total_ugx)}</span>
            </div>
          </div>
        </div>
      </div>

      {actionError && (
        <p role="alert" className="mt-4 rounded border border-red-300 bg-red-50 p-3 text-sm text-red-800">
          {actionError}
        </p>
      )}

      {order.allowedNextStatuses.length > 0 ? (
        <div className="mt-6 flex flex-wrap gap-3">
          {order.allowedNextStatuses.map((status) => (
            <Button
              key={status}
              variant={status === 'CANCELLED' ? 'outline' : 'primary'}
              disabled={updating}
              onClick={() => handleStatusChange(status)}
            >
              {STATUS_LABELS[status] || status}
            </Button>
          ))}
        </div>
      ) : (
        <p className="mt-6 text-muted">This order is in a final state.</p>
      )}
    </>
  );
}