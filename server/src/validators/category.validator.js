export function validateCategoryInput(body, { isUpdate = false } = {}) {
  const errors = [];
  if (!isUpdate || body.name !== undefined) {
    if (!body.name || body.name.trim().length < 2) {
      errors.push('Name must be at least 2 characters.');
    }
  }
  return errors;
}

export function slugify(text) {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}