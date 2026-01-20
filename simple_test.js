const http = require('http');

const postData = JSON.stringify({
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

const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/api/auth/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  console.log(`Headers:`, res.headers);

  res.setEncoding('utf8');
  let body = '';
  res.on('data', (chunk) => {
    body += chunk;
  });
  res.on('end', () => {
    console.log('Response:', body);
  });
});

req.on('error', (e) => {
  console.error(`Problem with request: ${e.message}`);
});

req.write(postData);
req.end();