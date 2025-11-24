// Test the send-otp endpoint
const testSendOTP = async () => {
  try {
    const phoneNumber = '+1234567890';
    
    console.log('Testing /api/auth/send-otp endpoint...');
    console.log('Phone number:', phoneNumber);
    console.log('');
    
    const response = await fetch('http://localhost:3000/api/auth/send-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phoneNumber })
    });
    
    const text = await response.text();
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    console.log('Response body:', text);
    console.log('');
    
    if (response.ok) {
      const data = JSON.parse(text);
      console.log('✅ Success!');
      console.log('Message:', data.message);
      if (data.otp) {
        console.log('📱 OTP:', data.otp);
        console.log('Development mode:', data.developmentMode);
      } else {
        console.log('⚠️  No OTP in response (production mode?)');
      }
    } else {
      console.log('❌ Error response');
      try {
        const error = JSON.parse(text);
        console.log('Error:', error);
      } catch (e) {
        console.log('Error text:', text);
      }
    }
  } catch (error) {
    console.error('Request failed:', error.message);
    console.error('Make sure the server is running on http://localhost:3000');
  }
};

// Wait a bit for server to start
setTimeout(() => {
  testSendOTP();
}, 2000);

