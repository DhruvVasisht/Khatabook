const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

// Middleware for JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setting view engine
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, "public")));

// Ensure 'hisaab' directory exists
const hisaabDir = path.join(__dirname, 'hisaab');
if (!fs.existsSync(hisaabDir)){
    fs.mkdirSync(hisaabDir);
}

// Route: Home
app.get('/', (req, res) => {
    fs.readdir(hisaabDir, (err, files) => {
        if (err) return res.status(500).send(err);
        res.render('index', { files });
    });
});

// Route: Create page
app.get('/create', (req, res) => {
    res.render('create');
});

// Route: Edit page
app.get('/edit/:filename', (req, res) => {
    fs.readFile(path.join(hisaabDir, req.params.filename), 'utf-8', (err, filedata) => {
        if (err) return res.status(500).send(err);
        res.render('edit', { filedata, filename: req.params.filename });
    });
});

// Route: View file
app.get('/hisaab/:filename', (req, res) => {
    fs.readFile(path.join(hisaabDir, req.params.filename), 'utf-8', (err, filedata) => {
        if (err) return res.status(500).send(err);
        res.render('hisaab', { filedata, filename: req.params.filename });
    });
});

// Route: Delete file
app.get('/delete/:filename', (req, res) => {
    fs.unlink(path.join(hisaabDir, req.params.filename), (err) => {
        if (err) return res.status(500).send(err);
        res.redirect('/');
    });
});

// Route: Update file
app.post('/update/:filename', (req, res) => {
    fs.writeFile(path.join(hisaabDir, req.params.filename), req.body.content, (err) => {
        if (err) return res.status(500).send(err);
        res.redirect('/');
    });
});

// Route: Create new file
app.post('/createhisaab', (req, res) => {
    const currentDate = new Date();
    const date = `${currentDate.getDate()}-${currentDate.getMonth() + 1}-${currentDate.getFullYear()}-${currentDate.getHours()}hrs`;
    const filePath = path.join(hisaabDir, `${date}.txt`);
    fs.writeFile(filePath, req.body.content, (err) => {
        if (err) return res.status(500).send(err);
        res.redirect('/');
    });
});

// Export the app for serverless function
module.exports = app;
