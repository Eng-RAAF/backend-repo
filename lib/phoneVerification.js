// Phone verification service using OTP (One-Time Password)
// In production, integrate with SMS service like Twilio, AWS SNS, etc.

// In-memory store for OTPs (in production, use Redis or database)
const otpStore = new Map();

// OTP expiration time (5 minutes)
const OTP_EXPIRY = 5 * 60 * 1000;

/**
 * Generate a 6-digit OTP
 */
export function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Send OTP to phone number
 * In production, integrate with SMS service
 */
export async function sendOTP(phoneNumber, otp) {
  // For development: log the OTP to console
  // In production, send via SMS service
  console.log(`📱 OTP for ${phoneNumber}: ${otp}`);
  console.log('⚠️  In production, this should be sent via SMS service');
  
  // Store OTP with expiration
  otpStore.set(phoneNumber, {
    otp,
    expiresAt: Date.now() + OTP_EXPIRY,
    attempts: 0
  });

  // In production, uncomment and configure SMS service:
  /*
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const client = require('twilio')(accountSid, authToken);

  await client.messages.create({
    body: `Your verification code is: ${otp}. Valid for 5 minutes.`,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: phoneNumber
  });
  */

  return true;
}

/**
 * Verify OTP for phone number
 */
export function verifyOTP(phoneNumber, providedOTP) {
  const stored = otpStore.get(phoneNumber);

  if (!stored) {
    return { valid: false, error: 'OTP not found or expired' };
  }

  // Check expiration
  if (Date.now() > stored.expiresAt) {
    otpStore.delete(phoneNumber);
    return { valid: false, error: 'OTP has expired' };
  }

  // Check attempts (max 5 attempts)
  if (stored.attempts >= 5) {
    otpStore.delete(phoneNumber);
    return { valid: false, error: 'Too many failed attempts. Please request a new OTP.' };
  }

  // Verify OTP
  if (stored.otp !== providedOTP) {
    stored.attempts++;
    return { valid: false, error: 'Invalid OTP' };
  }

  // OTP is valid, remove it
  otpStore.delete(phoneNumber);
  return { valid: true };
}

/**
 * Clean up expired OTPs (run periodically)
 */
export function cleanupExpiredOTPs() {
  const now = Date.now();
  for (const [phoneNumber, data] of otpStore.entries()) {
    if (now > data.expiresAt) {
      otpStore.delete(phoneNumber);
    }
  }
}

// Clean up expired OTPs every minute
setInterval(cleanupExpiredOTPs, 60 * 1000);

/**
 * Format phone number (remove spaces, dashes, etc.)
 */
export function formatPhoneNumber(phoneNumber) {
  // Remove all non-digit characters except +
  return phoneNumber.replace(/[^\d+]/g, '');
}

/**
 * Validate phone number format
 */
export function validatePhoneNumber(phoneNumber) {
  const formatted = formatPhoneNumber(phoneNumber);
  // Basic validation: should be 10-15 digits (with or without country code)
  return /^\+?\d{10,15}$/.test(formatted);
}

