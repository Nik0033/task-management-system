const http = require('http');

function makeRequest(method, path, body, headers = {}) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json',
                ...headers
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
        console.log('1. Login...');
        const loginRes = await makeRequest('POST', '/login', {
            email: 'test@example.com',
            password: 'password123'
        });

        if (loginRes.status !== 200) {
            console.error('❌ Login failed:', loginRes.body);
            return;
        }

        const token = loginRes.body.token;
        console.log('✅ Login successful. Token received.');

        console.log('\n2. Get Tasks (With Token)...');
        const tasksRes = await makeRequest('GET', '/tasks', null, {
            'Authorization': `Bearer ${token}`
        });

        if (tasksRes.status === 200) {
            console.log(`✅ Access granted. Tasks found: ${tasksRes.body.tasks ? tasksRes.body.tasks.length : 0}`);
        } else {
            console.error('❌ Access denied or error:', tasksRes.status, tasksRes.body);
        }

        console.log('\n3. Get Tasks (Without Token)...');
        const denialRes = await makeRequest('GET', '/tasks', null);

        if (denialRes.status === 401) {
            console.log('✅ Access denied correctly (401).');
        } else {
            console.error('❌ Expected 401, got:', denialRes.status);
        }

    } catch (err) {
        console.error('❌ Error:', err.message);
        console.log('Make sure the server is running on port 3000!');
    }
}

test();
