import 'dotenv/config';
import { pool } from '../src/config/db.js';

async function seed() {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // Clear existing data first, in an order that respects foreign keys
    // (children before parents). Safe to re-run this script repeatedly in development.
    await connection.query('SET FOREIGN_KEY_CHECKS = 0');
    await connection.query('TRUNCATE TABLE order_status_history');
    await connection.query('TRUNCATE TABLE order_items');
    await connection.query('TRUNCATE TABLE orders');
    await connection.query('TRUNCATE TABLE menu_items');
    await connection.query('TRUNCATE TABLE categories');
    await connection.query('TRUNCATE TABLE delivery_zones');
    await connection.query('TRUNCATE TABLE business_settings');
    await connection.query('SET FOREIGN_KEY_CHECKS = 1');

    // Categories
    const [catResult] = await connection.query(
      `INSERT INTO categories (name, slug, sort_order) VALUES
        ('Rice dishes', 'rice-dishes', 1),
        ('Street food', 'street-food', 2),
        ('Drinks', 'drinks', 3)`,
    );
    const riceId = catResult.insertId;
    const streetId = riceId + 1;
    const drinksId = riceId + 2;

    // Menu items
    await connection.query(
      `INSERT INTO menu_items
        (category_id, name, slug, description, price_ugx, is_available, is_featured, sort_order)
       VALUES
        (?, 'Chicken Pilau', 'chicken-pilau', 'Spiced rice cooked with tender chicken pieces.', 15000, true, true, 1),
        (?, 'Beef Pilau', 'beef-pilau', 'Spiced rice cooked with beef.', 15000, true, false, 2),
        (?, 'Rolex', 'rolex', 'Fried eggs and vegetables rolled in a fresh chapati.', 5000, true, true, 1),
        (?, 'Chapati Wrap', 'chapati-wrap', 'Chapati wrapped around your choice of filling.', 6000, true, false, 2),
        (?, 'Beef Burger', 'beef-burger', 'Grilled beef patty with fresh vegetables in a soft bun.', 12000, true, false, 3),
        (?, 'Fresh Juice', 'fresh-juice', 'Freshly made fruit juice, ask for today''s flavour.', 4000, true, false, 1),
        (?, 'African Tea', 'african-tea', 'Traditional spiced milk tea.', 2000, true, false, 2)`,
      [riceId, riceId, streetId, streetId, streetId, drinksId, drinksId],
    );

    // Delivery zones
    await connection.query(
      `INSERT INTO delivery_zones (name, description, fee_ugx, estimated_minutes) VALUES
        ('Ntawo', 'Ntawo and surrounding area', 3000, 30),
        ('Mukono Town', 'Mukono town centre', 5000, 45)`,
    );

    // Business settings (one row)
    await connection.query(
      `INSERT INTO business_settings
        (business_name, phone, whatsapp, address, opening_hours, min_order_ugx)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        'Mukono Fresh Bites',
        '+256765746535', // TODO: replace with the real business number before launch
        '256765746535',
        'Ntawo, Mukono, Uganda',
        'Daily, 8:00 AM to 10:00 PM',
        5000,
      ],
    );

    await connection.commit();
    console.log('Seed data inserted successfully.');
  } catch (err) {
    await connection.rollback();
    console.error('Seed failed, rolled back:', err.message);
    process.exitCode = 1;
  } finally {
    connection.release();
    await pool.end();
  }
}

seed();