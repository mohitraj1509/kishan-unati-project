const http = require('http');

const adminData = JSON.stringify({
  name: 'Admin User',
  email: 'admin@kisanunnati.com',
  password: 'admin123',
  phone: '9999999999',
  role: 'admin',
  location: {
    address: 'Admin Office',
    district: 'Admin District',
    state: 'Admin State',
    pincode: '000000'
  }
});

const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/api/auth/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(adminData)
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
    if (res.statusCode === 201) {
      console.log('\n✅ Admin user created successfully!');
      console.log('Email: admin@kisanunnati.com');
      console.log('Password: admin123');
      console.log('\nYou can now login to the admin panel at: http://localhost:3002/admin');
    }
  });
});

req.on('error', (e) => {
  console.error(`Problem with request: ${e.message}`);
});

req.write(adminData);
req.end();