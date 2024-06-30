const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const chokidar = require('chokidar');
const dotenv = require('dotenv');
const showdown = require('showdown');
const app = express();
const port = 3000;

// convert markdown > html
converter = new showdown.Converter();

dotenv.config();

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session setup
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

const users = [
    { id: 1, username: process.env.ADMIN_USERNAME, password: bcrypt.hashSync(process.env.ADMIN_PASSWORD, 10) }
];

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Function to run the Python script and log output
const runPythonScript = () => {
    console.log('Running Python script...');
    const script = exec('python posts.py', { cwd: __dirname });

    script.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    });

    script.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });

    script.on('close', (code) => {
        console.log(`Python script exited with code ${code}`);
    });
};

// Run the Python script on server start
runPythonScript();

// Watch for changes in the blog/posts directory
const watcher = chokidar.watch(path.join(__dirname, 'public', 'blog', 'posts'), {
    persistent: true
});

watcher.on('add', (filePath) => {
    console.log(`File added: ${filePath}`);
    runPythonScript();
});

watcher.on('change', (filePath) => {
    console.log(`File changed: ${filePath}`);
    runPythonScript();
});

watcher.on('unlink', (filePath) => {
    console.log(`File removed: ${filePath}`);
    runPythonScript();
});

// Middleware to redirect .html URLs to their clean versions
app.use((req, res, next) => {
    if (req.url.endsWith('.html')) {
        const cleanUrl = req.url.slice(0, -5);
        res.redirect(301, cleanUrl);
    } else if (req.url.endsWith('/index')) {
        const cleanUrl = req.url.slice(0, -6);
        res.redirect(301, cleanUrl);
    } else if (req.url.endsWith('/index.html')) {
        const cleanUrl = req.url.slice(0, -11);
        res.redirect(301, cleanUrl);
    } else {
        next();
    }
});

// Authentication middleware
const requireAuth = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/login');
    }
};

// Route to serve login page
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Route to handle login
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username);

    if (user && bcrypt.compareSync(password, user.password)) {
        req.session.user = user;
        res.redirect('/create-post');
    } else {
        res.send('Invalid credentials');
    }
});

// Route to serve index without .html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Serve about without .html
app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'about.html'));
});

// Serve contact without .html
app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'contact.html'));
});

// Serve blog main page without .html
app.get('/blog', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'blog', 'index.html'));
});

// Handle requests for blog posts without .html
app.get('/blog/posts/:post', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'blog', 'posts', req.params.post, 'index.html'));
});

// Route to serve create-post page
app.get('/create-post', requireAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'protected', 'create-post.html'));
});

// Route to handle creating a new blog post
app.post('/create-post', requireAuth, (req, res) => {
    const { title, subheader, content } = req.body;
    const postDir = path.join(__dirname, 'public', 'blog', 'posts', title.replace(/\s+/g, '-').toLowerCase());
    const postPath = path.join(postDir, 'index.html');
    const date = new Date().toLocaleDateString('en-GB', {
        day: '2-digit', month: 'short', year: '2-digit'
    });

    if (!fs.existsSync(postDir)){
        fs.mkdirSync(postDir);
    }

    const htmlContent = `
<!DOCTYPE HTML>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>minimalscreen - ${title}</title>
    <link rel="stylesheet" href="/css/main.css">
</head>
<body>
    <header>
        <h1>${title}</h1>
        <aside>${date} - ${subheader}</aside>
	<nav>
	<p><a href="/">home</a> | <a href="/blog/">blog</a> | <a href="/about">about</a> | <a href="/contact">contact</a></p>
	</nav>
    </header>
    <main>
    ${converter.makeHtml(content)}
    </main>
    <footer>
    <p>love minimalscreen</p>
    </footer>
</body>
</html>
    `;

    fs.writeFile(postPath, htmlContent, (err) => {
        if (err) {
            console.error('Error writing file', err);
            res.status(500).send('Error creating post');
        } else {
            console.log('Post created:', postPath);
            runPythonScript();
            res.status(200).send('Post created successfully');
        }
    });
});

// Custom 404 handler
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    if (err.code === 'ENOENT') {
        res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
    } else {
        res.status(500).send('500 - Internal Server Error');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

