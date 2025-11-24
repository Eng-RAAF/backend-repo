import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import readline from 'readline';

const prisma = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function resetPassword() {
  try {
    // Get email from command line or prompt
    let email = process.argv[2];
    
    if (!email) {
      email = await question('Enter email address: ');
    }
    
    // Get new password
    let newPassword = process.argv[3];
    
    if (!newPassword) {
      newPassword = await question('Enter new password: ');
    }

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail }
    });

    if (!user) {
      console.log('❌ User not found with email:', email);
      console.log('\nAvailable users:');
      const allUsers = await prisma.user.findMany({
        select: { id: true, email: true, name: true, role: true }
      });
      allUsers.forEach(u => console.log(`  - ${u.email} (${u.name}, ${u.role})`));
      return;
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user password
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword }
    });

    console.log('\n✅ Password reset successfully!');
    console.log('Email:', user.email);
    console.log('Name:', user.name);
    console.log('Role:', user.role);
    console.log('New Password:', newPassword);
    console.log('\nYou can now login with these credentials.');

    // Verify it works
    const updatedUser = await prisma.user.findUnique({
      where: { id: user.id }
    });
    const isValid = await bcrypt.compare(newPassword, updatedUser.password);
    console.log('\nPassword verification test:', isValid ? '✅ PASS' : '❌ FAIL');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
    rl.close();
  }
}

resetPassword();

