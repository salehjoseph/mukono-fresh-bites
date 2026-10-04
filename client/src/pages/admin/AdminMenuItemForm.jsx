import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../../components/Button';
import Seo from '../../components/Seo';
import { useFetch } from '../../hooks/useFetch';
import { apiGet, apiPost, apiPatch, apiUpload } from '../../services/api';

export default function AdminMenuItemForm() {
  const { id } = useParams();
  const isEdit = Boolean(id) && id !== 'new';
  const navigate = useNavigate();

  const { data: categories } = useFetch(() => apiGet('/admin/categories'), []);
  const { data: existingItems } = useFetch(() => apiGet('/admin/menu-items'), []);
  const existingItem = isEdit ? existingItems?.find((i) => String(i.id) === id) : null;

  const [form, setForm] = useState({
    name: '',
    categoryId: '',
    priceUgx: '',
    description: '',
    isFeatured: false,
  });
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (existingItem) {
      setForm({
        name: existingItem.name,
        categoryId: String(existingItem.category_id),
        priceUgx: String(existingItem.price_ugx),
        description: existingItem.description || '',
        isFeatured: Boolean(existingItem.is_featured),
      });
    }
  }, [existingItem]);

  function updateField(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const payload = {
        name: form.name.trim(),
        categoryId: Number(form.categoryId),
        priceUgx: Number(form.priceUgx),
        description: form.description.trim() || undefined,
        isFeatured: form.isFeatured,
      };

      let itemId = id;
      if (isEdit) {
        await apiPatch(`/admin/menu-items/${id}`, payload);
      } else {
        const created = await apiPost('/admin/menu-items', payload);
        itemId = created.id;
      }

      if (imageFile) {
        await apiUpload(`/admin/menu-items/${itemId}/image`, imageFile);
      }

      navigate('/admin/menu-items');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Seo title={isEdit ? 'Edit menu item' : 'Add menu item'} />
      <h1 className="text-2xl font-bold text-brand-800">{isEdit ? 'Edit item' : 'Add item'}</h1>

      <form onSubmit={handleSubmit} noValidate className="mt-6 max-w-lg space-y-4">
        <div>
          <label htmlFor="name" className="block font-medium">
            Name
          </label>
          <input
            id="name"
            type="text"
            value={form.name}
            onChange={(e) => updateField('name', e.target.value)}
            required
            className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2"
          />
        </div>

        <div>
          <label htmlFor="categoryId" className="block font-medium">
            Category
          </label>
          <select
            id="categoryId"
            value={form.categoryId}
            onChange={(e) => updateField('categoryId', e.target.value)}
            required
            className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2"
          >
            <option value="">Select a category</option>
            {categories?.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="priceUgx" className="block font-medium">
            Price (UGX)
          </label>
          <input
            id="priceUgx"
            type="number"
            min="1"
            value={form.priceUgx}
            onChange={(e) => updateField('priceUgx', e.target.value)}
            required
            className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2"
          />
        </div>

        <div>
          <label htmlFor="description" className="block font-medium">
            Description
          </label>
          <textarea
            id="description"
            value={form.description}
            onChange={(e) => updateField('description', e.target.value)}
            rows={3}
            className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2"
          />
        </div>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.isFeatured}
            onChange={(e) => updateField('isFeatured', e.target.checked)}
          />
          Featured on homepage
        </label>

        <div>
          <label htmlFor="image" className="block font-medium">
            Image {isEdit && existingItem?.image_url && '(replace)'}
          </label>
          <input
            id="image"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => setImageFile(e.target.files[0] || null)}
            className="mt-1 w-full text-sm"
          />
        </div>

        {error && (
          <p role="alert" className="rounded border border-red-300 bg-red-50 p-3 text-sm text-red-800">
            {error}
          </p>
        )}

        <div className="flex gap-3">
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Saving...' : 'Save'}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate('/admin/menu-items')}>
            Cancel
          </Button>
        </div>
      </form>
    </>
  );
}