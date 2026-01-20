const axios = require('axios');

async function testRegistration() {
  try {
    const response = await axios.post('http://localhost:3001/api/auth/register', {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      phone: '1234567890',
      role: 'farmer',
      location: {
        address: 'Test Address',
        district: 'Test District',
        state: 'Test State',
        pincode: '123456'
      }
    });

    console.log('Registration successful:', response.data);
  } catch (error) {
    console.error('Registration failed:', error.response?.data || error.message);
  }
}

testRegistration();