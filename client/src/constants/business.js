// DEVELOPMENT / TEST VALUES. Replace with real details from the owner.
// Later these move to the database (business_settings) so the owner can edit them.
export const BUSINESS = {
  name: 'Mukono Fresh Bites',
  tagline: 'Fresh, affordable meals in Mukono',
  location: 'Ntawo, Mukono, Uganda', // TODO: owner to confirm exact address
  currency: 'UGX',
  phone: import.meta.env.VITE_PHONE_NUMBER || '',
  whatsapp: import.meta.env.VITE_WHATSAPP_NUMBER || '',
  // TODO: placeholder hours, owner to confirm
  hours: 'Daily, 8:00 AM to 10:00 PM',
};