// Example: Students route using Convex
// This is an example showing how to use Convex instead of Prisma
// To use this, rename it to students.js or update your routes

import express from 'express';
import convex from '../lib/convex.js';

const router = express.Router();

// Get all students
router.get('/', async (req, res) => {
  try {
    const students = await convex.students.getAll();
    res.json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get student by ID
router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const student = await convex.students.getById(id);
    
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    
    res.json(student);
  } catch (error) {
    console.error('Error fetching student:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create new student
router.post('/', async (req, res) => {
  try {
    const { name, email, age, grade } = req.body;
    
    // Validation
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }
    
    const student = await convex.students.create({
      name: name.trim(),
      email: email.trim(),
      age: age ? parseInt(age) : undefined,
      grade: grade ? grade.trim() : undefined,
    });
    
    res.status(201).json(student);
  } catch (error) {
    console.error('Error creating student:', error);
    
    // Handle Convex errors
    if (error.message.includes('already exists')) {
      return res.status(400).json({ error: error.message });
    }
    
    res.status(500).json({ error: error.message });
  }
});

// Update student
router.put('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { name, email, age, grade } = req.body;
    
    const updateData = {};
    if (name !== undefined) updateData.name = name.trim();
    if (email !== undefined) updateData.email = email.trim();
    if (age !== undefined) updateData.age = parseInt(age);
    if (grade !== undefined) updateData.grade = grade ? grade.trim() : null;
    
    const updatedStudent = await convex.students.update(id, updateData);
    res.json(updatedStudent);
  } catch (error) {
    console.error('Error updating student:', error);
    
    if (error.message.includes('not found')) {
      return res.status(404).json({ error: error.message });
    }
    
    if (error.message.includes('already exists')) {
      return res.status(400).json({ error: error.message });
    }
    
    res.status(500).json({ error: error.message });
  }
});

// Delete student
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    await convex.students.delete(id);
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;

