const http = require('http');

const options = (path) => ({
    hostname: 'localhost',
    port: 5000,
    path: `/api/university${path}`,
    method: 'GET',
});

function checkRoute(name, path) {
    const req = http.request(options(path), (res) => {
        console.log(`[${name}] ${path} -> Status: ${res.statusCode}`);
        if (res.statusCode !== 404) {
            console.log(`✅ ${name} route exists (Status: ${res.statusCode})`);
        } else {
            console.log(`❌ ${name} route NOT found (Status: 404)`);
        }
    });

    req.on('error', (e) => {
        console.error(`[${name}] Error: ${e.message}`);
    });

    req.end();
}

console.log('Verifying University Routes...');
checkRoute('Products', '/products');
checkRoute('OpenHouse', '/openhouse');
