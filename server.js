import express from 'express';
import cors from 'cors';
import studentsRoutes from './routes/students.js';
import classesRoutes from './routes/classes.js';
import teachersRoutes from './routes/teachers.js';
import enrollmentsRoutes from './routes/enrollments.js';
import authRoutes from './routes/auth.js';
import usersRoutes from './routes/users.js';
import messagesRoutes from './routes/messages.js';
import analyticsRoutes from './routes/analytics.js';

const app = express();
const PORT = process.env.PORT || 3000;



// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/students', studentsRoutes);
app.use('/api/classes', classesRoutes);
app.use('/api/teachers', teachersRoutes);
app.use('/api/enrollments', enrollmentsRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Class Management System API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      messages: '/api/messages',
      analytics: '/api/analytics',
      students: '/api/students',
      classes: '/api/classes',
      teachers: '/api/teachers',
      enrollments: '/api/enrollments'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler - must be after all routes
app.use((err, req, res, next) => {
  console.error('Error stack:', err.stack);
  console.error('Error message:', err.message);
  console.error('Error code:', err.code);
  
  // Ensure we always send JSON
  if (!res.headersSent) {
    res.status(err.status || 500).json({ 
      error: err.message || 'Something went wrong!',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
  }
});

// Export app for Vercel serverless functions
export default app;

// Start server only if not in Vercel environment
if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}
