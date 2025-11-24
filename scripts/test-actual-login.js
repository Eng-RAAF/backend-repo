import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function testLogin() {
  try {
    const email = 'kalagade@gmail.com';
    const password = 'admin123';

    console.log('Testing login for:', email);
    console.log('Password:', password);
    console.log('');

    // Normalize email (same as auth route does)
    const normalizedEmail = email.toLowerCase().trim();
    
    // Find user
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail }
    });

    if (!user) {
      console.log('❌ User not found');
      return;
    }

    console.log('✅ User found:');
    console.log('  Email:', user.email);
    console.log('  Name:', user.name);
    console.log('  Role:', user.role);
    console.log('  Password hash:', user.password.substring(0, 30) + '...');
    console.log('');

    // Test password (same as auth route does)
    const isValid = await bcrypt.compare(password, user.password);
    console.log('Password validation:', isValid ? '✅ VALID' : '❌ INVALID');

    if (isValid) {
      console.log('');
      console.log('✅ Login should work!');
      console.log('You can login with:');
      console.log('  Email:', email);
      console.log('  Password:', password);
    } else {
      console.log('');
      console.log('❌ Password does not match');
      console.log('Run: node scripts/reset-user-password.js kalagade@gmail.com <new-password>');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testLogin();

