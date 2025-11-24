// Test OTP generation and sending
import { generateOTP, sendOTP, verifyOTP, formatPhoneNumber, validatePhoneNumber } from '../lib/phoneVerification.js';

async function testOTP() {
  const testPhone = '+1234567890';
  
  console.log('Testing OTP system...\n');
  console.log('Phone number:', testPhone);
  
  // Format phone
  const formatted = formatPhoneNumber(testPhone);
  console.log('Formatted:', formatted);
  
  // Validate
  const isValid = validatePhoneNumber(formatted);
  console.log('Valid:', isValid);
  
  if (!isValid) {
    console.log('Invalid phone number format');
    return;
  }
  
  // Generate and send OTP
  console.log('\nGenerating OTP...');
  const otp = generateOTP();
  console.log('Generated OTP:', otp);
  
  await sendOTP(formatted, otp);
  console.log('OTP sent (check console above for OTP)');
  
  // Test verification
  console.log('\nTesting verification...');
  const result1 = verifyOTP(formatted, otp);
  console.log('Correct OTP:', result1.valid ? '✅' : '❌', result1);
  
  const result2 = verifyOTP(formatted, '000000');
  console.log('Wrong OTP:', result2.valid ? '✅' : '❌', result2);
  
  console.log('\n✅ OTP system test complete!');
}

testOTP();

