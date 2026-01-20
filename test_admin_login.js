const http = require('http');

const loginData = JSON.stringify({
  email: 'admin@kisanunnati.com',
  password: 'admin123'
});

const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(loginData)
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
    if (res.statusCode === 200) {
      console.log('\n✅ Admin login successful!');
    }
  });
});

req.on('error', (e) => {
  console.error(`Problem with request: ${e.message}`);
});

req.write(loginData);
req.end();