import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Seo from '../components/Seo';
import { useCart } from '../store/cartContext';
import { useFetch } from '../hooks/useFetch';
import { apiGet, apiPost } from '../services/api';
import { formatUGX } from '../utils/format';
import { generateIdempotencyKey } from '../utils/idempotency';

const idempotencyKey = generateIdempotencyKey();

export default function Checkout() {
  const navigate = useNavigate();
  const { items, subtotal, clearCart } = useCart();
  const { data: zones } = useFetch(() => apiGet('/delivery-zones'), []);

  const [form, setForm] = useState({
    customerName: '',
    customerPhone: '',
    orderType: 'PICKUP',
    deliveryZoneId: '',
    deliveryAddress: '',
    customerNotes: '',
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const selectedZone = zones?.find((z) => String(z.id) === form.deliveryZoneId);
  const deliveryFee = form.orderType === 'DELIVERY' ? selectedZone?.fee_ugx || 0 : 0;

  function updateField(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function validate() {
    const errors = {};
    if (form.customerName.trim().length < 2) {
      errors.customerName = 'Please enter your name.';
    }
    if (!/^0\d{9}$/.test(form.customerPhone.trim()) && !/^\+?256\d{9}$/.test(form.customerPhone.trim())) {
      errors.customerPhone = 'Enter a valid Ugandan number, e.g. 0765746535.';
    }
    if (form.orderType === 'DELIVERY' && !form.deliveryZoneId) {
      errors.deliveryZoneId = 'Please choose a delivery area.';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitError(null);

    if (items.length === 0) {
      setSubmitError('Your cart is empty.');
      return;
    }
    if (!validate()) return;

    setSubmitting(true);
    try {
      const result = await apiPost(
        '/orders',
        {
          customerName: form.customerName.trim(),
          customerPhone: form.customerPhone.trim(),
          orderType: form.orderType,
          deliveryZoneId: form.orderType === 'DELIVERY' ? Number(form.deliveryZoneId) : undefined,
          deliveryAddress: form.deliveryAddress.trim() || undefined,
          customerNotes: form.customerNotes.trim() || undefined,
          items: items.map((line) => ({ menuItemId: line.id, quantity: line.quantity })),
        },
        idempotencyKey,
      );

      clearCart();
      navigate('/order-confirmation', { state: { order: result } });
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <>
        <Seo title="Checkout" />
        <h1 className="text-3xl font-bold text-brand-800">Checkout</h1>
        <p className="mt-4 text-muted">Your cart is empty.</p>
        <Button to="/menu" className="mt-4">
          Browse the menu
        </Button>
      </>
    );
  }

  return (
    <>
      <Seo title="Checkout" description="Complete your order from Mukono Fresh Bites." />
      <h1 className="text-3xl font-bold text-brand-800">Checkout</h1>

      <form onSubmit={handleSubmit} noValidate className="mt-6 grid gap-8 lg:grid-cols-2">
        <div className="space-y-5">
          <div>
            <label htmlFor="customerName" className="block font-medium">
              Full name
            </label>
            <input
              id="customerName"
              type="text"
              value={form.customerName}
              onChange={(e) => updateField('customerName', e.target.value)}
              aria-invalid={Boolean(fieldErrors.customerName)}
              aria-describedby={fieldErrors.customerName ? 'customerName-error' : undefined}
              className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2"
            />
            {fieldErrors.customerName && (
              <p id="customerName-error" className="mt-1 text-sm text-accent-700">
                {fieldErrors.customerName}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="customerPhone" className="block font-medium">
              Phone number
            </label>
            <input
              id="customerPhone"
              type="tel"
              value={form.customerPhone}
              onChange={(e) => updateField('customerPhone', e.target.value)}
              placeholder="0765746535"
              aria-invalid={Boolean(fieldErrors.customerPhone)}
              aria-describedby={fieldErrors.customerPhone ? 'customerPhone-error' : undefined}
              className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2"
            />
            {fieldErrors.customerPhone && (
              <p id="customerPhone-error" className="mt-1 text-sm text-accent-700">
                {fieldErrors.customerPhone}
              </p>
            )}
          </div>

          <fieldset>
            <legend className="font-medium">Order type</legend>
            <div className="mt-2 flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="orderType"
                  value="PICKUP"
                  checked={form.orderType === 'PICKUP'}
                  onChange={(e) => updateField('orderType', e.target.value)}
                />
                Pickup
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="orderType"
                  value="DELIVERY"
                  checked={form.orderType === 'DELIVERY'}
                  onChange={(e) => updateField('orderType', e.target.value)}
                />
                Delivery
              </label>
            </div>
          </fieldset>

          {form.orderType === 'DELIVERY' && (
            <>
              <div>
                <label htmlFor="deliveryZoneId" className="block font-medium">
                  Delivery area
                </label>
                <select
                  id="deliveryZoneId"
                  value={form.deliveryZoneId}
                  onChange={(e) => updateField('deliveryZoneId', e.target.value)}
                  aria-invalid={Boolean(fieldErrors.deliveryZoneId)}
                  aria-describedby={fieldErrors.deliveryZoneId ? 'zone-error' : undefined}
                  className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2"
                >
                  <option value="">Select an area</option>
                  {zones?.map((z) => (
                    <option key={z.id} value={z.id}>
                      {z.name} ({formatUGX(z.fee_ugx)})
                    </option>
                  ))}
                </select>
                {fieldErrors.deliveryZoneId && (
                  <p id="zone-error" className="mt-1 text-sm text-accent-700">
                    {fieldErrors.deliveryZoneId}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="deliveryAddress" className="block font-medium">
                  Delivery address details
                </label>
                <textarea
                  id="deliveryAddress"
                  value={form.deliveryAddress}
                  onChange={(e) => updateField('deliveryAddress', e.target.value)}
                  rows={2}
                  className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2"
                />
              </div>
            </>
          )}

          <div>
            <label htmlFor="customerNotes" className="block font-medium">
              Notes (optional)
            </label>
            <textarea
              id="customerNotes"
              value={form.customerNotes}
              onChange={(e) => updateField('customerNotes', e.target.value)}
              rows={2}
              className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2"
            />
          </div>
        </div>

        <div className="h-fit rounded-lg border border-stone-200 bg-white p-5">
          <h2 className="font-semibold text-ink">Order summary</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {items.map((line) => (
              <li key={line.id} className="flex justify-between">
                <span>
                  {line.quantity}x {line.name}
                </span>
                <span>{formatUGX(line.price_ugx * line.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 space-y-1 border-t border-stone-200 pt-3 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatUGX(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery fee</span>
              <span>{formatUGX(deliveryFee)}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-brand-800">
              <span>Total</span>
              <span>{formatUGX(subtotal + deliveryFee)}</span>
            </div>
          </div>

          {submitError && (
            <p role="alert" className="mt-4 rounded border border-red-300 bg-red-50 p-3 text-sm text-red-800">
              {submitError}
            </p>
          )}

          <Button type="submit" disabled={submitting} className="mt-4 w-full">
            {submitting ? 'Placing order...' : 'Place order'}
          </Button>
          <p className="mt-2 text-xs text-muted">
            Payment: cash on {form.orderType === 'PICKUP' ? 'pickup' : 'delivery'}.
          </p>
        </div>
      </form>
    </>
  );
}