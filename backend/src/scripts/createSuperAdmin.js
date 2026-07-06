// src/scripts/createSuperAdmin.js
// Run once when you first set up the system:  npm run seed:superadmin
//
// This is the ONLY way a super_admin account can be created — there is no
// API route for it, and regular admins can never promote anyone to
// super_admin (see userController.js). That is intentional: your position
// as the system owner is enforced at the code level, not just by a role
// flag that another admin could flip.
//
// It reads SUPERADMIN_NAME / SUPERADMIN_EMAIL / SUPERADMIN_PASSWORD from
// .env. If a super_admin already exists it will refuse to create a second
// one unless you pass --force (use with care).

require('dotenv').config();
const readline = require('readline');
const db = require('../config/db');
const userModel = require('../models/userModel');
const env = require('../config/env');

function ask(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => rl.question(question, (ans) => { rl.close(); resolve(ans); }));
}

async function main() {
  const force = process.argv.includes('--force');
  const existing = db.prepare("SELECT * FROM users WHERE role = 'super_admin'").all();

  if (existing.length && !force) {
    console.log('A Super Admin already exists:');
    existing.forEach((u) => console.log(`  - ${u.full_name} <${u.email}>`));
    console.log('\nRun with --force to add another super admin anyway (not usually recommended).');
    process.exit(0);
  }

  const name = env.SUPERADMIN_NAME || (await ask('Full name: '));
  const email = env.SUPERADMIN_EMAIL || (await ask('Email: '));
  const password = env.SUPERADMIN_PASSWORD || (await ask('Password (min 12 chars): '));

  if (!name || !email || !password || password.length < 12) {
    console.error('Name, email, and a password of at least 12 characters are required.');
    process.exit(1);
  }

  if (userModel.findByEmail(email)) {
    console.error(`A user with email ${email} already exists.`);
    process.exit(1);
  }

  const user = userModel.createUser({
    fullName: name,
    email,
    password,
    role: 'super_admin',
    title: 'Msimamizi Mkuu',
    parishId: null,
    mustChangePassword: 1,
  });

  console.log('\n✔ Super Admin account created:');
  console.log(`  Name : ${user.full_name}`);
  console.log(`  Email: ${user.email}`);
  console.log('  You will be asked to set a new password on first login.\n');
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
