import { Trash2, Minus, Plus } from 'lucide-react';
import Button from '../components/Button';
import Seo from '../components/Seo';
import { useCart } from '../store/cartContext';
import { formatUGX } from '../utils/format';

export default function Cart() {
  const { items, subtotal, increaseQty, decreaseQty, removeItem, clearCart } = useCart();

  return (
    <>
      <Seo title="Your cart" description="Review the items in your cart before checkout." />
      <h1 className="text-3xl font-bold text-brand-800">Your cart</h1>

      {items.length === 0 ? (
        <div className="mt-6">
          <p className="text-muted">Your cart is empty.</p>
          <Button to="/menu" className="mt-4">
            Browse the menu
          </Button>
        </div>
      ) : (
        <div className="mt-6">
          <ul className="space-y-4">
            {items.map((line) => (
              <li
                key={line.id}
                className="flex items-center justify-between gap-4 rounded-lg border border-stone-200 bg-white p-4"
              >
                <div className="flex-1">
                  <p className="font-semibold text-ink">{line.name}</p>
                  <p className="text-sm text-muted">{formatUGX(line.price_ugx)} each</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => decreaseQty(line.id)}
                    aria-label={`Decrease quantity of ${line.name}`}
                    className="inline-flex min-h-11 min-w-11 items-center justify-center rounded border border-stone-300 hover:bg-brand-50"
                  >
                    <Minus size={16} aria-hidden="true" />
                  </button>
                  <span className="w-6 text-center font-medium" aria-live="polite">
                    {line.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => increaseQty(line.id)}
                    aria-label={`Increase quantity of ${line.name}`}
                    className="inline-flex min-h-11 min-w-11 items-center justify-center rounded border border-stone-300 hover:bg-brand-50"
                  >
                    <Plus size={16} aria-hidden="true" />
                  </button>
                </div>

                <p className="w-24 text-right font-semibold text-brand-800">
                  {formatUGX(line.price_ugx * line.quantity)}
                </p>

                <button
                  type="button"
                  onClick={() => removeItem(line.id)}
                  aria-label={`Remove ${line.name} from cart`}
                  className="inline-flex min-h-11 min-w-11 items-center justify-center text-muted hover:text-accent-700"
                >
                  <Trash2 size={18} aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex items-center justify-between border-t border-stone-200 pt-4">
            <button type="button" onClick={clearCart} className="text-sm text-muted underline">
              Clear cart
            </button>
            <p className="text-xl font-bold text-brand-800">Subtotal: {formatUGX(subtotal)}</p>
          </div>

          <div className="mt-6">
            <Button to="/checkout" className="w-full sm:w-auto">
              Proceed to checkout
            </Button>
            <p className="mt-2 text-sm text-muted">
              Delivery fee, if applicable, is calculated at checkout.
            </p>
          </div>
        </div>
      )}
    </>
  );
}