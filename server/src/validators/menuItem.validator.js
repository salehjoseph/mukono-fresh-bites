export function validateMenuItemInput(body, { isUpdate = false } = {}) {
  const errors = [];

  if (!isUpdate || body.name !== undefined) {
    if (!body.name || body.name.trim().length < 2) {
      errors.push('Name must be at least 2 characters.');
    }
  }

  if (!isUpdate || body.categoryId !== undefined) {
    if (!Number.isInteger(body.categoryId)) {
      errors.push('A valid categoryId is required.');
    }
  }

  if (!isUpdate || body.priceUgx !== undefined) {
    if (!Number.isInteger(body.priceUgx) || body.priceUgx <= 0 || body.priceUgx > 10000000) {
      errors.push('Price must be a positive whole number of UGX.');
    }
  }

  if (body.description !== undefined && body.description.length > 1000) {
    errors.push('Description must be under 1000 characters.');
  }

  return errors;
}