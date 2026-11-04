import { prisma } from './lib/prisma';
import bcrypt from 'bcryptjs';

async function main() {
  const email = 'admin@vellimalaifarms.in';
  // Stored as the bare 10 digits, the same form /api/register and login use.
  const phone = '9385526105';
  const password = process.env.ADMIN_PASSWORD;
  if (!password || password.length < 10) {
    throw new Error('Set ADMIN_PASSWORD (at least 10 characters) before running this script.');
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await prisma.user.upsert({
    where: { email },
    update: {
      password: hashedPassword,
      role: 'ADMIN',
      phone,
    },
    create: {
      email,
      phone,
      name: 'Admin User',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log('Admin user created/updated successfully!');
  console.log('Phone:', phone);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
