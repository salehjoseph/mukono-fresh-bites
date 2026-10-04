import { Link } from 'react-router-dom';
import Seo from '../../components/Seo';
import { useFetch } from '../../hooks/useFetch';
import { apiGet } from '../../services/api';
import { formatUGX } from '../../utils/format';

const STATUS_STYLES = {
  PENDING: 'bg-amber-100 text-amber-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  PREPARING: 'bg-blue-100 text-blue-800',
  READY_FOR_PICKUP: 'bg-brand-100 text-brand-800',
  OUT_FOR_DELIVERY: 'bg-brand-100 text-brand-800',
  COMPLETED: 'bg-stone-100 text-stone-700',
  CANCELLED: 'bg-red-100 text-red-800',
  FAILED: 'bg-red-100 text-red-800',
};

function StatusBadge({ status }) {
  return (
    <span className={`rounded-full px-2 py-1 text-xs font-semibold ${STATUS_STYLES[status] || ''}`}>
      {status.replace(/_/g, ' ')}
    </span>
  );
}

export default function AdminOrders() {
  const { data: orders, loading, error } = useFetch(() => apiGet('/admin/orders'), []);

  return (
    <>
      <Seo title="Orders" />
      <h1 className="text-2xl font-bold text-brand-800">Orders</h1>

      <div className="mt-6" aria-live="polite">
        {loading && <p className="text-muted">Loading orders...</p>}
        {error && (
          <p className="rounded border border-red-300 bg-red-50 p-3 text-red-800">{error}</p>
        )}
        {!loading && !error && orders?.length === 0 && (
          <p className="text-muted">No orders yet.</p>
        )}

        {!loading && !error && orders?.length > 0 && (
          <div className="overflow-x-auto rounded-lg border border-stone-200 bg-white">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-stone-200 bg-stone-50 text-xs uppercase text-muted">
                <tr>
                  <th scope="col" className="px-4 py-3">Order</th>
                  <th scope="col" className="px-4 py-3">Customer</th>
                  <th scope="col" className="px-4 py-3">Type</th>
                  <th scope="col" className="px-4 py-3">Total</th>
                  <th scope="col" className="px-4 py-3">Status</th>
                  <th scope="col" className="px-4 py-3">Placed</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-stone-100 last:border-0">
                    <td className="px-4 py-3">
                      <Link
                        to={`/admin/orders/${order.id}`}
                        className="font-medium text-brand-800 underline-offset-2 hover:underline"
                      >
                        {order.order_number}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <div>{order.customer_name}</div>
                      <div className="text-xs text-muted">{order.customer_phone}</div>
                    </td>
                    <td className="px-4 py-3">{order.order_type}</td>
                    <td className="px-4 py-3">{formatUGX(order.total_ugx)}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-4 py-3 text-muted">
                      {new Date(order.created_at).toLocaleString('en-UG', {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}