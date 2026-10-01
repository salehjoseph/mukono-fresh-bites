import 'dotenv/config';
import prompts from 'prompts';
import { pool } from '../src/config/db.js';
import { hashPassword } from '../src/utils/password.js';
import { validatePasswordStrength } from '../src/validators/password.js';

async function main() {
  const answers = await prompts([
    { type: 'text', name: 'name', message: 'Full name' },
    { type: 'text', name: 'email', message: 'Email address' },
    {
      type: 'password',
      name: 'password',
      message: 'Password (min 12 chars, upper+lower+number)',
    },
    { type: 'select', name: 'role', message: 'Role', choices: [
      { title: 'ADMIN', value: 'ADMIN' },
      { title: 'STAFF', value: 'STAFF' },
    ]},
  ]);

  if (!answers.email || !answers.password) {
    console.log('Cancelled.');
    process.exit(1);
  }

  const strengthError = validatePasswordStrength(answers.password);
  if (strengthError) {
    console.error('✖ ' + strengthError);
    process.exit(1);
  }

  const passwordHash = await hashPassword(answers.password);

  try {
    await pool.query(
      `INSERT INTO users (name, email, password_hash, role) VALUES (:name, :email, :passwordHash, :role)`,
      { name: answers.name, email: answers.email, passwordHash, role: answers.role },
    );
    console.log(`✔ Created ${answers.role} account for ${answers.email}`);
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      console.error('✖ That email is already registered.');
    } else {
      console.error('✖ Failed to create account:', err.message);
    }
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();