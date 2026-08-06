// src/scripts/seedDemoData.js
// Optional — creates one sample parish plus a Katibu (secretary-admin) account
// for testing. Safe to skip in a real production rollout; run manually with:
//   npm run seed:demo

require('dotenv').config();
const crypto = require('crypto');
const db = require('../config/db');
const userModel = require('../models/userModel');

function main() {
  const parishId = crypto.randomUUID();
  db.prepare(`INSERT INTO parishes (id, name, diocese, email) VALUES (?, ?, ?, ?)`).run(
    parishId,
    'Parokia ya Mfano',
    'Jimbo Kuu la Mfano',
    'parokia@example.com'
  );

  if (!userModel.findByEmail('katibu@parokia.example.com')) {
    userModel.createUser({
      fullName: 'Maria Katibu',
      email: 'katibu@parokia.example.com',
      password: 'ChangeMe123!',
      role: 'admin',
      title: 'Katibu',
      parishId,
      mustChangePassword: 1,
    });
  }

  console.log('✔ Demo parish + Katibu admin created.');
  console.log('  Login: katibu@parokia.example.com / ChangeMe123!  (must change on first login)');
}

main();
