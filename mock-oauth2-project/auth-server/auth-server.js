const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');  // To serve static files
const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files (e.g., login.css) from a public folder
app.use(express.static(path.join(__dirname, 'public')));

// In-memory stores
let tempAuthCodes = {};   // auth_code => username
let accessTokens = {};    // access_token => username

// ✅ Allowed users (username => password)
const validUsers = {
    student: 'password123',
    admin: 'admin123'
};

// Route: /authorize (Login UI)
app.get('/authorize', (req, res) => {
    const { client_id, redirect_uri } = req.query;
    res.send(`
        <html>
        <head><title>Login</title><link rel="stylesheet" href="/login.css"></head>
        <body>
            <div class="login-container">
                <h2>Mock OAuth Login</h2>
                <form method="POST" action="/approve">
                    <input type="hidden" name="redirect_uri" value="${redirect_uri}" />
                    <input type="text" name="username" placeholder="Username" required />
                    <input type="password" name="password" placeholder="Password" required />
                    <button type="submit">Authorize</button>
                </form>
            </div>
        </body>
        </html>
    `);
});

// Route: /approve (Login form POST handler)
app.post('/approve', (req, res) => {
    const { username, password, redirect_uri } = req.body;

    // Validate username/password
    if (validUsers[username] && validUsers[username] === password) {
        const authCode = Math.random().toString(36).substring(2);
        tempAuthCodes[authCode] = username;
        res.redirect(`${redirect_uri}?code=${authCode}`);
    } else {
        res.status(401).send(`
            <html>
                <body>
                    <h2>Invalid Credentials</h2>
                    <p>Please check your username and password.</p>
                    <a href="/authorize">Back to login</a>
                </body>
            </html>
        `);
    }
});

// Route: /token (Exchange code for access token)
app.post('/token', (req, res) => {
    const { code } = req.body;
    if (tempAuthCodes[code]) {
        const token = 'access_token_' + Math.random().toString(36).substring(2);
        accessTokens[token] = tempAuthCodes[code];
        delete tempAuthCodes[code];
        res.json({ access_token: token, token_type: 'bearer' });
    } else {
        res.status(400).json({ error: 'invalid_grant' });
    }
});

// Route: /userinfo (Return info for access token)
app.get('/userinfo', (req, res) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        const username = accessTokens[token];
        if (username) {
            res.json({ username });
            return;
        }
    }
    res.status(401).json({ error: 'invalid_token' });
});

// (Optional) Protected /admin route for testing access control
app.get('/admin', (req, res) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        const username = accessTokens[token];
        if (username === 'admin') {
            res.send('<h1>Welcome, Admin! You have special access.</h1>');
        } else {
            res.status(403).send('<h1>Forbidden: Admins only</h1>');
        }
    } else {
        res.status(401).send('<h1>Unauthorized</h1>');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Auth server running at http://localhost:${PORT}`);
});
