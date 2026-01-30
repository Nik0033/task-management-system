const http = require('http');

const makeRequest = (path, method, data, label) => {
    console.log(`\n--- Testing ${label} ---`);
    console.log(`Request: ${method} ${path}`);

    const options = {
        hostname: 'localhost',
        port: 3000,
        path: path,
        method: method,
        headers: {
            'Content-Type': 'application/json'
        }
    };

    if (data) {
        options.headers['Content-Length'] = Buffer.byteLength(data);
    }

    const req = http.request(options, (res) => {
        let body = '';
        res.on('data', (chunk) => body += chunk);
        res.on('end', () => {
            console.log(`Response Status: ${res.statusCode}`);
            try {
                const parsed = JSON.parse(body);
                console.log('Response Body:', JSON.stringify(parsed, null, 2));
            } catch (e) {
                console.log('Response Body:', body);
            }
        });
    });

    req.on('error', (error) => {
        console.error(`Error: ${error.message}`);
    });

    if (data) {
        req.write(data);
    }
    req.end();
};

// 1. Test 404 Route
makeRequest('/api/phantom-route', 'GET', null, '404 Not Found');

// 2. Test 400 Bad Request (Register with missing fields)
const badRegisterData = JSON.stringify({
    name: " Test User "
    // Missing email and password
});

// Stagger requests to keep logs readable
setTimeout(() => {
    makeRequest('/register', 'POST', badRegisterData, '400 Bad Request');
}, 500);

// 3. Test 401 Unauthorized (Access protected route without token)
setTimeout(() => {
    makeRequest('/tasks', 'GET', null, '401 Unauthorized');
}, 1000);
