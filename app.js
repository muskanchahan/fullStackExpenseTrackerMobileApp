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
const { expenses } = require('./modul/index');

// GET route for serving the HTML form
app.get('/user',async (req, res) => {
    try{
        const expens=await expenses.findAll();
        console.log(expens);
        res.status(200).json(expens);
    }
    catch(error){
        console.log('Error in fetching expence' ,error);
        res.status(500).json({error:'faild to fecthing expence'});
    }
});


// GET route to serve the login page
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});


// POST route to handle form data
app.post('/user/signup', async(req, res) => {
  try{
    console.log('recevied data:' ,req.body)
    const newExpence =await  expenses.create(req.body);
    res.status(201).json(newExpence);
    console.log(newExpence);
  }  
  catch(error){
    console.log(error);
    res.status(500).json({error:'Failed to create items'});
  }
});

app.post('/user/login', async (req, res) => {
  const { email, password } = req.body; // Get the email and password from the request body
  try {
      // Find the user by email
      const user = await expenses.findOne({ where: { email } });

      if (!user) {
          // If the user does not exist
          return res.status(404).json({ error: 'User not found' });
      }

      // Check if the password matches (assuming you're not hashing passwords yet)
      if (user.password === password) {
          res.status(200).json({ message: 'Login successful' });
      } else {
          res.status(401).json({ error: 'Incorrect password' });
      }
  } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ error: 'Failed to log in' });
  }
});


// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});




