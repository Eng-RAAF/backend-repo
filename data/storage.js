import prisma from '../lib/prisma.js';

// Students
export const getStudents = async () => {
  return await prisma.student.findMany({
    orderBy: { createdAt: 'desc' }
  });
};

export const getStudentById = async (id) => {
  return await prisma.student.findUnique({
    where: { id: parseInt(id) }
  });
};

export const addStudent = async (studentData) => {
  try {
    // Verify Prisma client and student model
    if (!prisma) {
      throw new Error('Prisma client is not initialized');
    }
    
    if (!prisma.student) {
      throw new Error('Prisma Student model not found. Please run: npm run prisma:generate');
    }
    
    if (typeof prisma.student.create !== 'function') {
      throw new Error('prisma.student.create is not a function. Prisma Client may need to be regenerated.');
    }
    
    // Ensure only valid fields are passed to Prisma
    const data = {
      name: String(studentData.name || '').trim(),
      email: String(studentData.email || '').trim(),
    };
    
    // Validate required fields
    if (!data.name || !data.email) {
      throw new Error('Name and email are required');
    }
    
    // Only add optional fields if they exist and are valid
    if (studentData.age !== undefined && studentData.age !== null && studentData.age !== '') {
      const ageNum = parseInt(studentData.age);
      if (!isNaN(ageNum) && ageNum > 0) {
        data.age = ageNum;
      }
    }
    
    if (studentData.grade !== undefined && studentData.grade !== null && String(studentData.grade).trim() !== '') {
      data.grade = String(studentData.grade).trim();
    }
    
    console.log('Creating student with data:', JSON.stringify(data, null, 2));
    
    // Create the student
    const result = await prisma.student.create({
      data: data
    });
    
    console.log('Student created successfully:', result.id);
    return result;
  } catch (error) {
    console.error('Error in addStudent:');
    console.error('  Error name:', error.name);
    console.error('  Error message:', error.message);
    console.error('  Error code:', error.code);
    console.error('  Error meta:', error.meta);
    console.error('  Stack:', error.stack);
    
    // Re-throw with more context
    if (error.code) {
      // Prisma error
      throw error;
    } else {
      // Custom error
      throw new Error(`Failed to create student: ${error.message}`);
    }
  }
};

export const updateStudent = async (id, studentData) => {
  return await prisma.student.update({
    where: { id: parseInt(id) },
    data: studentData
  });
};

export const deleteStudent = async (id) => {
  // Prisma will automatically delete related enrollments due to onDelete: Cascade
  return await prisma.student.delete({
    where: { id: parseInt(id) }
  });
};

// Classes
export const getClasses = async () => {
  return await prisma.class.findMany({
    include: {
      teacher: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
};

export const getClassById = async (id) => {
  return await prisma.class.findUnique({
    where: { id: parseInt(id) },
    include: {
      teacher: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    }
  });
};

export const addClass = async (classData) => {
  return await prisma.class.create({
    data: classData,
    include: {
      teacher: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    }
  });
};

export const updateClass = async (id, classData) => {
  return await prisma.class.update({
    where: { id: parseInt(id) },
    data: classData,
    include: {
      teacher: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    }
  });
};

export const deleteClass = async (id) => {
  // Prisma will automatically delete related enrollments due to onDelete: Cascade
  return await prisma.class.delete({
    where: { id: parseInt(id) }
  });
};

// Teachers
export const getTeachers = async () => {
  return await prisma.teacher.findMany({
    orderBy: { createdAt: 'desc' }
  });
};

export const getTeacherById = async (id) => {
  return await prisma.teacher.findUnique({
    where: { id: parseInt(id) }
  });
};

export const addTeacher = async (teacherData) => {
  return await prisma.teacher.create({
    data: teacherData
  });
};

export const updateTeacher = async (id, teacherData) => {
  return await prisma.teacher.update({
    where: { id: parseInt(id) },
    data: teacherData
  });
};

export const deleteTeacher = async (id) => {
  return await prisma.teacher.delete({
    where: { id: parseInt(id) }
  });
};

// Enrollments
export const getEnrollments = async () => {
  return await prisma.enrollment.findMany({
    include: {
      student: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      class: {
        select: {
          id: true,
          name: true,
          code: true
        }
      }
    },
    orderBy: { enrolledAt: 'desc' }
  });
};

export const getEnrollmentById = async (id) => {
  return await prisma.enrollment.findUnique({
    where: { id: parseInt(id) },
    include: {
      student: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      class: {
        select: {
          id: true,
          name: true,
          code: true
        }
      }
    }
  });
};

export const getEnrollmentsByStudent = async (studentId) => {
  return await prisma.enrollment.findMany({
    where: { studentId: parseInt(studentId) },
    include: {
      class: {
        select: {
          id: true,
          name: true,
          code: true
        }
      }
    },
    orderBy: { enrolledAt: 'desc' }
  });
};

export const getEnrollmentsByClass = async (classId) => {
  return await prisma.enrollment.findMany({
    where: { classId: parseInt(classId) },
    include: {
      student: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    },
    orderBy: { enrolledAt: 'desc' }
  });
};

export const addEnrollment = async (enrollmentData) => {
  // Check if student exists
  const student = await getStudentById(enrollmentData.studentId);
  if (!student) {
    throw new Error('Student not found');
  }
  
  // Check if class exists
  const classItem = await getClassById(enrollmentData.classId);
  if (!classItem) {
    throw new Error('Class not found');
  }
  
  // Prisma unique constraint will handle duplicate enrollments
  try {
    return await prisma.enrollment.create({
      data: {
        studentId: parseInt(enrollmentData.studentId),
        classId: parseInt(enrollmentData.classId)
      },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        class: {
          select: {
            id: true,
            name: true,
            code: true
          }
        }
      }
    });
  } catch (error) {
    if (error.code === 'P2002') {
      throw new Error('Student is already enrolled in this class');
    }
    throw error;
  }
};

export const deleteEnrollment = async (id) => {
  return await prisma.enrollment.delete({
    where: { id: parseInt(id) }
  });
};

export const deleteEnrollmentByStudentAndClass = async (studentId, classId) => {
  const enrollment = await prisma.enrollment.findFirst({
    where: {
      studentId: parseInt(studentId),
      classId: parseInt(classId)
    }
  });
  
  if (!enrollment) {
    return null;
  }
  
  return await prisma.enrollment.delete({
    where: { id: enrollment.id }
  });
};
