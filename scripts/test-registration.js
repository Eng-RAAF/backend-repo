// Test registration endpoint with detailed logging
const testRegistration = async () => {
  try {
    const testData = {
      name: 'Test User',
      email: `test${Date.now()}@example.com`, // Unique email
      password: 'test123'
    };
    
    console.log('Testing registration endpoint...');
    console.log('Data:', testData);
    console.log('');
    
    const response = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });
    
    const text = await response.text();
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    console.log('Response body:', text);
    console.log('');
    
    if (response.ok) {
      const data = JSON.parse(text);
      console.log('✅ Registration successful!');
      console.log('User ID:', data.user.id);
      console.log('Email:', data.user.email);
      console.log('Token received:', data.token ? 'Yes' : 'No');
    } else {
      console.log('❌ Registration failed');
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
  testRegistration();
}, 2000);

