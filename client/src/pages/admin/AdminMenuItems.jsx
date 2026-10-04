import { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/Button';
import Seo from '../../components/Seo';
import { useFetch } from '../../hooks/useFetch';
import { apiGet, apiPatch, apiDelete } from '../../services/api';
import { formatUGX } from '../../utils/format';

export default function AdminMenuItems() {
  const { data: items, loading, error, refetch } = useFetch(() => apiGet('/admin/menu-items'), []);
  const [actionError, setActionError] = useState(null);

  async function toggleAvailable(item) {
    setActionError(null);
    try {
      await apiPatch(`/admin/menu-items/${item.id}`, { isAvailable: !item.is_available });
      await refetch();
    } catch (err) {
      setActionError(err.message);
    }
  }

  async function toggleActive(item) {
    setActionError(null);
    try {
      await apiPatch(`/admin/menu-items/${item.id}`, { isActive: !item.is_active });
      await refetch();
    } catch (err) {
      setActionError(err.message);
    }
  }

  async function handleDelete(item) {
    if (!window.confirm(`Remove "${item.name}"? Items with past orders will be deactivated instead of deleted.`)) {
      return;
    }
    setActionError(null);
    try {
      const result = await apiDelete(`/admin/menu-items/${item.id}`);
      if (result.deactivated) {
        alert(`"${item.name}" has order history, so it was deactivated instead of deleted.`);
      }
      await refetch();
    } catch (err) {
      setActionError(err.message);
    }
  }

  return (
    <>
      <Seo title="Menu items" />
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-brand-800">Menu items</h1>
        <Button to="/admin/menu-items/new">Add item</Button>
      </div>

      {actionError && (
        <p className="mt-4 rounded border border-red-300 bg-red-50 p-3 text-sm text-red-800">{actionError}</p>
      )}

      <div className="mt-6" aria-live="polite">
        {loading && <p className="text-muted">Loading menu items...</p>}
        {error && <p className="rounded border border-red-300 bg-red-50 p-3 text-red-800">{error}</p>}

        {!loading && !error && items?.length > 0 && (
          <div className="overflow-x-auto rounded-lg border border-stone-200 bg-white">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-stone-200 bg-stone-50 text-xs uppercase text-muted">
                <tr>
                  <th scope="col" className="px-4 py-3">Item</th>
                  <th scope="col" className="px-4 py-3">Category</th>
                  <th scope="col" className="px-4 py-3">Price</th>
                  <th scope="col" className="px-4 py-3">Available</th>
                  <th scope="col" className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-b border-stone-100 last:border-0">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {item.image_url && (
                          <img
                            src={`http://localhost:4000${item.image_url}`}
                            alt={item.name}
                            className="h-10 w-10 rounded object-cover"
                          />
                        )}
                        <span className={!item.is_active ? 'text-muted line-through' : ''}>{item.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">{item.category_name}</td>
                    <td className="px-4 py-3">{formatUGX(item.price_ugx)}</td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => toggleAvailable(item)}
                        aria-pressed={Boolean(item.is_available)}
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          item.is_available ? 'bg-brand-100 text-brand-800' : 'bg-stone-100 text-stone-500'
                        }`}
                      >
                        {item.is_available ? 'Available' : 'Unavailable'}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-3">
                        <Link to={`/admin/menu-items/${item.id}`} className="text-brand-700 underline">
                          Edit
                        </Link>
                        {item.is_active ? (
                          <button
                            type="button"
                            onClick={() => handleDelete(item)}
                            className="text-accent-700 underline"
                          >
                            Delete
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => toggleActive(item)}
                            className="text-brand-700 underline"
                          >
                            Reactivate
                          </button>
                        )}
                      </div>
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