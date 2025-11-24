import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function testLogin() {
  try {
    const email = 'admin@example.com';
    const password = 'admin123';

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      console.log('❌ User not found');
      return;
    }

    console.log('User found:', user.email);
    console.log('Stored password hash:', user.password.substring(0, 20) + '...');

    // Test password
    const isValid = await bcrypt.compare(password, user.password);
    console.log('Password "admin123" is valid:', isValid);

    // Test with new hash
    const newHash = await bcrypt.hash(password, 10);
    console.log('New hash for "admin123":', newHash.substring(0, 20) + '...');
    const isValidNew = await bcrypt.compare(password, newHash);
    console.log('New hash validation:', isValidNew);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testLogin();

