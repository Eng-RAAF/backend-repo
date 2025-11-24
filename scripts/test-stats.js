import prisma from '../lib/prisma.js';

async function testStats() {
  try {
    console.log('Testing Prisma connection...');
    
    const [studentsCount, classesCount, teachersCount, enrollmentsCount, usersCount] = await Promise.all([
      prisma.student.count(),
      prisma.class.count(),
      prisma.teacher.count(),
      prisma.enrollment.count(),
      prisma.user.count()
    ]);

    console.log('Stats fetched successfully:');
    console.log({
      students: studentsCount,
      classes: classesCount,
      teachers: teachersCount,
      enrollments: enrollmentsCount,
      users: usersCount
    });
    
    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      name: error.name
    });
    await prisma.$disconnect();
    process.exit(1);
  }
}

testStats();

