const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
const port = 3000;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));  // To handle URL-encoded data from forms

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// GET route for serving the HTML form
app.get('/user', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// POST route to handle form data
app.post('/user/signup', (req, res) => {
    const { username, email, password } = req.body;

    // Log the form data to the console
    console.log('Username:', username);
    console.log('Email:', email);
    console.log('Password:', password);

    // Send a response back to the client
    res.send('Form submitted successfully!');
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});




