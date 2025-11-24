// Test the login endpoint directly
const testLogin = async () => {
  try {
    const email = 'kalagade@gmail.com';
    const password = 'admin123';
    
    console.log('Testing login endpoint...');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('');
    
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password })
    });
    
    const text = await response.text();
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    console.log('Response body:', text);
    console.log('');
    
    if (response.ok) {
      const data = JSON.parse(text);
      console.log('✅ Login successful!');
      console.log('User:', data.user);
      console.log('Token received:', data.token ? 'Yes' : 'No');
    } else {
      console.log('❌ Login failed');
      try {
        const error = JSON.parse(text);
        console.log('Error:', error);
      } catch (e) {
        console.log('Error text:', text);
      }
    }
  } catch (error) {
    console.error('Request error:', error);
  }
};

// Wait for server to start
setTimeout(() => {
  testLogin();
}, 2000);

