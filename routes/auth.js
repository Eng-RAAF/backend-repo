import express from 'express';
import prisma from '../lib/prisma.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { generateOTP, sendOTP, verifyOTP, formatPhoneNumber, validatePhoneNumber } from '../lib/phoneVerification.js';

const router = express.Router();

// Send OTP endpoint
router.post('/send-otp', async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({ error: 'Phone number is required' });
    }

    // Format and validate phone number
    const formattedPhone = formatPhoneNumber(phoneNumber);
    if (!validatePhoneNumber(formattedPhone)) {
      return res.status(400).json({ error: 'Invalid phone number format' });
    }

    // Check if phone number is already registered
    const existingUser = await prisma.user.findUnique({
      where: { phoneNumber: formattedPhone }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Phone number is already registered' });
    }

    // Generate and send OTP
    const otp = generateOTP();
    await sendOTP(formattedPhone, otp);

    // Always include OTP in development mode for testing
    // In production, remove this and only send via SMS
    const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
    
    console.log(`\n📱 ===== OTP GENERATED =====`);
    console.log(`Phone: ${formattedPhone}`);
    console.log(`OTP: ${otp}`);
    console.log(`Valid for: 5 minutes`);
    console.log(`=============================\n`);
    
    res.json({
      message: isDevelopment 
        ? 'OTP generated successfully (development mode)' 
        : 'OTP sent successfully to your phone',
      // Always include OTP in development for testing
      ...(isDevelopment && { otp, developmentMode: true })
    });
  } catch (error) {
    console.error('Error sending OTP:', error);
    console.error('Error stack:', error.stack);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    res.status(500).json({ 
      error: 'Failed to send OTP',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Verify OTP endpoint
router.post('/verify-otp', async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;

    if (!phoneNumber || !otp) {
      return res.status(400).json({ error: 'Phone number and OTP are required' });
    }

    const formattedPhone = formatPhoneNumber(phoneNumber);
    const verification = verifyOTP(formattedPhone, otp);

    if (!verification.valid) {
      return res.status(400).json({ error: verification.error });
    }

    res.json({
      message: 'OTP verified successfully',
      verified: true
    });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ error: 'Failed to verify OTP' });
  }
});

// Register endpoint
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, role, phoneNumber, otp } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }

    // Phone number is required for registration
    if (!phoneNumber) {
      return res.status(400).json({ error: 'Phone number is required' });
    }

    // Format and validate phone number
    const formattedPhone = formatPhoneNumber(phoneNumber);
    if (!validatePhoneNumber(formattedPhone)) {
      return res.status(400).json({ error: 'Invalid phone number format' });
    }

    // Verify OTP if provided (for registration)
    if (otp) {
      const verification = verifyOTP(formattedPhone, otp);
      if (!verification.valid) {
        return res.status(400).json({ error: `Phone verification failed: ${verification.error}` });
      }
    } else {
      // In development, allow registration without OTP (for testing)
      // In production, require OTP verification
      if (process.env.NODE_ENV === 'production') {
        return res.status(400).json({ error: 'OTP verification is required' });
      }
    }

    // Check if user already exists (email)
    const normalizedEmail = email.toLowerCase().trim();
    const existingUserByEmail = await prisma.user.findUnique({
      where: { email: normalizedEmail }
    });

    if (existingUserByEmail) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Check if phone number is already registered
    const existingUserByPhone = await prisma.user.findUnique({
      where: { phoneNumber: formattedPhone }
    });

    if (existingUserByPhone) {
      return res.status(400).json({ error: 'Phone number is already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user (store email in lowercase)
    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        password: hashedPassword,
        name,
        phoneNumber: formattedPhone,
        phoneVerified: otp ? true : false, // Verified if OTP was provided
        role: role || 'user'
      },
      select: {
        id: true,
        email: true,
        name: true,
        phoneNumber: true,
        phoneVerified: true,
        role: true,
        createdAt: true
      }
    });

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key-change-in-production',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      user,
      token
    });
  } catch (error) {
    console.error('Error registering user:', error);
    
    // Handle Prisma unique constraint errors
    if (error.code === 'P2002') {
      const field = error.meta?.target?.[0];
      if (field === 'email') {
        return res.status(400).json({ error: 'Email already exists' });
      }
      if (field === 'phoneNumber') {
        return res.status(400).json({ error: 'Phone number already exists' });
      }
    }
    
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('=== LOGIN ATTEMPT ===');
    console.log('Email:', email);
    console.log('Password provided:', !!password);
    console.log('Request body:', JSON.stringify({ email, passwordProvided: !!password }));

    if (!email || !password) {
      console.log('Missing email or password');
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user (normalize email for lookup)
    const normalizedEmail = email.toLowerCase().trim();
    console.log('Normalized email:', normalizedEmail);
    
    let user;
    try {
      user = await prisma.user.findUnique({
        where: { email: normalizedEmail }
      });
      console.log('Database query successful');
    } catch (dbError) {
      console.error('Database error during user lookup:', dbError);
      console.error('Error code:', dbError.code);
      console.error('Error message:', dbError.message);
      return res.status(500).json({ 
        error: 'Database error occurred',
        details: process.env.NODE_ENV === 'development' ? dbError.message : undefined
      });
    }

    console.log('User found:', user ? 'Yes' : 'No');
    if (user) {
      console.log('User ID:', user.id);
      console.log('User email:', user.email);
      console.log('User name:', user.name);
    }

    if (!user) {
      console.log('User not found for email:', normalizedEmail);
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Verify password
    let isValidPassword;
    try {
      isValidPassword = await bcrypt.compare(password, user.password);
      console.log('Password comparison result:', isValidPassword);
    } catch (bcryptError) {
      console.error('Bcrypt error:', bcryptError);
      return res.status(500).json({ error: 'Error verifying password' });
    }

    if (!isValidPassword) {
      console.log('Invalid password for user:', normalizedEmail);
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    console.log('✅ Login successful for:', normalizedEmail);

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key-change-in-production',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      token
    });
  } catch (error) {
    console.error('=== LOGIN ERROR ===');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    console.error('Error stack:', error.stack);
    
    // Check for database connection errors
    if (error.code === 'P1001' || error.message?.includes("Can't reach database server")) {
      return res.status(500).json({ 
        error: 'Database connection failed. Please try again.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
    
    // Check for prepared statement errors
    if (error.message?.includes('prepared statement') || error.code === '42P05') {
      console.error('Prepared statement error detected - this should be handled by Prisma wrapper');
      return res.status(500).json({ 
        error: 'Database error occurred. Please try again.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
    
    res.status(500).json({ 
      error: 'Failed to login',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Verify token endpoint
router.get('/verify', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'your-secret-key-change-in-production'
    );

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true
      }
    });

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

export default router;

