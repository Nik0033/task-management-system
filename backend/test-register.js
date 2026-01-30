const http = require('http');

function makeRequest(method, path, body) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                resolve({ status: res.statusCode, body: JSON.parse(data || '{}') });
            });
        });

        req.on('error', (e) => reject(e));
        if (body) req.write(JSON.stringify(body));
        req.end();
    });
}

async function test() {
    try {
        const randomId = Math.floor(Math.random() * 10000);
        const newUser = {
            name: `Test User ${randomId}`,
            email: `newuser${randomId}@example.com`,
            password: 'password123'
        };

        console.log(`1. Registering new user: ${newUser.email}...`);
        const regRes = await makeRequest('POST', '/register', newUser);

        if (regRes.status !== 201) {
            console.error('❌ Registration failed:', regRes.body);
            return;
        }

        const token = regRes.body.token;
        console.log('✅ Registration successful. Token received.');
        console.log(`   User ID: ${regRes.body.user.id}`);

        console.log('\n2. Verifying login with new credentials...');
        const loginRes = await makeRequest('POST', '/login', {
            email: newUser.email,
            password: newUser.password
        });

        if (loginRes.status === 200) {
            console.log('✅ Login successful with new user.');
        } else {
            console.error('❌ Login failed:', loginRes.body);
        }

        console.log('\n3. Testing Duplicate Email...');
        const dupRes = await makeRequest('POST', '/register', newUser);

        if (dupRes.status === 409) {
            console.log('✅ Duplicate email correctly rejected (409).');
        } else {
            console.error('❌ Expected 409 for duplicate, got:', dupRes.status);
        }

    } catch (err) {
        console.error('❌ Error:', err.message);
    }
}

test();
