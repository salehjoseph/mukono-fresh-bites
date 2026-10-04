import { useState } from 'react';
import Button from '../../components/Button';
import Seo from '../../components/Seo';
import { useFetch } from '../../hooks/useFetch';
import { apiGet, apiPost, apiPatch } from '../../services/api';

export default function AdminCategories() {
  const { data: categories, loading, error, refetch } = useFetch(() => apiGet('/admin/categories'), []);
  const [newName, setNewName] = useState('');
  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleCreate(e) {
    e.preventDefault();
    if (!newName.trim()) return;
    setFormError(null);
    setSubmitting(true);
    try {
      await apiPost('/admin/categories', { name: newName.trim() });
      setNewName('');
      await refetch();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function toggleActive(category) {
    try {
      await apiPatch(`/admin/categories/${category.id}`, { isActive: !category.is_active });
      await refetch();
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <>
      <Seo title="Categories" />
      <h1 className="text-2xl font-bold text-brand-800">Categories</h1>

      <form onSubmit={handleCreate} className="mt-6 flex flex-wrap items-end gap-3">
        <div>
          <label htmlFor="newCategoryName" className="block text-sm font-medium">
            New category name
          </label>
          <input
            id="newCategoryName"
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="mt-1 rounded-lg border border-stone-300 px-3 py-2"
          />
        </div>
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Adding...' : 'Add category'}
        </Button>
      </form>
      {formError && <p className="mt-2 text-sm text-accent-700">{formError}</p>}

      <div className="mt-6" aria-live="polite">
        {loading && <p className="text-muted">Loading categories...</p>}
        {error && <p className="rounded border border-red-300 bg-red-50 p-3 text-red-800">{error}</p>}

        {!loading && !error && categories?.length > 0 && (
          <ul className="space-y-2">
            {categories.map((cat) => (
              <li
                key={cat.id}
                className="flex items-center justify-between rounded-lg border border-stone-200 bg-white p-4"
              >
                <div>
                  <p className="font-medium">{cat.name}</p>
                  <p className="text-xs text-muted">{cat.slug}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-semibold ${
                      cat.is_active ? 'bg-brand-100 text-brand-800' : 'bg-stone-100 text-stone-500'
                    }`}
                  >
                    {cat.is_active ? 'Active' : 'Inactive'}
                  </span>
                  <Button variant="outline" onClick={() => toggleActive(cat)}>
                    {cat.is_active ? 'Deactivate' : 'Activate'}
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}