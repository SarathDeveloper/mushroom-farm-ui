import { prisma } from './lib/prisma';
import bcrypt from 'bcryptjs';

async function main() {
  const email = 'admin@vellimalaifarms.in';
  const password = 'admin';
  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await prisma.user.upsert({
    where: { email },
    update: {
      password: hashedPassword,
      role: 'ADMIN',
    },
    create: {
      email,
      name: 'Admin User',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log('Admin user created/updated successfully!');
  console.log('Email:', email);
  console.log('Password:', password);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
