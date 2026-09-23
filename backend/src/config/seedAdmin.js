const User = require('../models/User');

// Ensures exactly one admin account exists, sourced from .env. This is the
// only way an admin gets created — there is no public "become admin" route.
// Never overwrites an existing password.
async function seedAdmin() {
  const { ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME } = process.env;

  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.warn('ADMIN_EMAIL/ADMIN_PASSWORD not set - skipping admin bootstrap');
    return;
  }

  const email = ADMIN_EMAIL.toLowerCase().trim();
  const existing = await User.findOne({ email });

  if (existing) {
    if (existing.role !== 'admin') {
      existing.role = 'admin';
      await existing.save();
      console.log(`Promoted existing user ${email} to admin`);
    }
    return;
  }

  await User.create({
    name: ADMIN_NAME || 'Admin',
    email,
    password: ADMIN_PASSWORD,
    role: 'admin'
  });

  console.log(`Created admin user ${email}`);
}

module.exports = seedAdmin;
