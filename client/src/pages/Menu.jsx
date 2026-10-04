import { useState } from 'react';
import { Search } from 'lucide-react';
import Seo from '../components/Seo';
import { useFetch } from '../hooks/useFetch';
import { apiGet } from '../services/api';
import { formatUGX } from '../utils/format';
import { useCart } from '../store/cartContext';
import Button from '../components/Button';

export default function Menu() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('');
  const { items: cartItems, addItem } = useCart();

  const { data: categories } = useFetch(() => apiGet('/categories'), []);

  const {
    data: items,
    loading,
    error,
  } = useFetch(() => {
    const params = new URLSearchParams();
    if (activeCategory) params.set('category', activeCategory);
    if (search) params.set('search', search);
    const qs = params.toString();
    return apiGet(`/menu${qs ? `?${qs}` : ''}`);
  }, [activeCategory, search]);

  return (
    <>
      <Seo title="Menu" description="Browse our full menu of fresh meals and drinks." />
      <h1 className="text-3xl font-bold text-brand-800">Our menu</h1>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <label className="relative flex-1 min-w-[200px]">
          <span className="sr-only">Search the menu</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" aria-hidden="true" size={18} />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search dishes..."
            className="w-full rounded-lg border border-stone-300 py-2 pl-10 pr-3 focus:border-brand-700"
          />
        </label>
      </div>

      <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Filter by category">
        <button type="button" onClick={() => setActiveCategory('')} aria-pressed={activeCategory === ''} className={`min-h-11 rounded-full border px-4 text-sm font-medium ${activeCategory === '' ? 'border-brand-800 bg-brand-800 text-white' : 'border-stone-300 text-ink hover:bg-brand-50'}`}>
          All
        </button>
        {categories?.map((c) => (
          <button key={c.slug} type="button" onClick={() => setActiveCategory(c.slug)} aria-pressed={activeCategory === c.slug} className={`min-h-11 rounded-full border px-4 text-sm font-medium ${activeCategory === c.slug ? 'border-brand-800 bg-brand-800 text-white' : 'border-stone-300 text-ink hover:bg-brand-50'}`}>
            {c.name}
          </button>
        ))}
      </div>

      <div className="mt-6" aria-live="polite">
        {loading && <p className="text-muted">Loading menu...</p>}

        {error && (
          <p className="rounded border border-red-300 bg-red-50 p-3 text-red-800">
            We could not load the menu. {error}
          </p>
        )}

        {!loading && !error && items?.length === 0 && (
          <p className="text-muted">No dishes match your search.</p>
        )}

        {!loading && !error && items?.length > 0 && (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => {
              const inCart = cartItems.find((line) => line.id === item.id);
              return (
                <li key={item.id} className="overflow-hidden rounded-lg border border-stone-200 bg-white">
                  {item.image_url ? (
                    <img src={`http://localhost:4000${item.image_url}`} alt={item.image_alt || item.name} className="h-40 w-full object-cover" />
                  ) : (
                    <div className="flex h-40 w-full items-center justify-center bg-stone-100 text-sm text-muted">
                      No image yet
                    </div>
                  )}
                  <div className="p-4">
                    <h2 className="font-semibold text-ink">{item.name}</h2>
                    <p className="mt-1 text-sm text-muted">{item.description}</p>
                    <p className="mt-2 font-bold text-brand-800">{formatUGX(item.price_ugx)}</p>
                    {!item.is_available ? (
                      <p className="mt-1 text-sm font-medium text-accent-700">Currently unavailable</p>
                    ) : (
                      <Button variant={inCart ? 'secondary' : 'outline'} className="mt-3 w-full" onClick={() => addItem(item)}>
                        {inCart ? `✓ In cart (${inCart.quantity})` : 'Add to cart'}
                      </Button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </>
  );
}