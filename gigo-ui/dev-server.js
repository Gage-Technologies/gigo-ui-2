const fs = require('fs');
const https = require('https');
const express = require('express');
const next = require('next');

const port = parseInt(process.env.PORT, 10) || 34000;
const host = process.env.HOST || 'localhost';
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

// Reading SSL files
const options = {};
if (process.env.HTTPS === "true") {
    options["key"] = fs.readFileSync(process.env.SSL_KEY_FILE);
    options["cert"] = fs.readFileSync(process.env.SSL_CRT_FILE);
}

app.prepare().then(() => {
    const server = express();
    server.all('*', (req, res) => {
        return handle(req, res);
    });

    // Create HTTPS server.
    https.createServer(options, server).listen(port, host, err => {
        if (err) throw err;
        console.log(`> Ready on https://${host}:${port}`);
    });
});
