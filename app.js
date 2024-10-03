
const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const cors = require('cors');
const { User, sequelize } = require('./modul/index');  
const Expense = require('./modul/index2');  
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const authMiddleware = require('./middleware/auth');

// Token generation function
function generateToken(userId) {
    const token = jwt.sign({ id: userId }, 'yourSecretKey'); // Use a secure secret key
    return token;
}

const app = express();
const port = 3000;
app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


app.get('/leaderboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'leaderboard.html'));
});

app.get('/api/leaderboard', async (req, res) => {
  try {
    // Fetch all users and their total expense sums
    const leaderboardData = await User.findAll({
      include: [{
        model: Expense,
        attributes: []  // No need to retrieve individual expense rows
      }],
      attributes: [
        'id', 'username',
        [sequelize.fn('SUM', sequelize.col('Expenses.amount')), 'totalExpense']
      ],
      group: ['id'],
      order: [[sequelize.literal('totalExpense'), 'DESC']] // Order by total expense descending
    });

    // Format the data for easier consumption in the frontend
    const formattedData = leaderboardData.map(user => ({
      username: user.username,
      totalExpense: user.getDataValue('totalExpense') // This will get the calculated field
    }));

    res.status(200).json(formattedData);
  } catch (error) {
    console.log('Error fetching leaderboard data:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard data' });
  }
});


// Serve login page
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Serve signup page
app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Get all users
app.get('/user', async (req, res) => {
  try {
    const users = await User.findAll(); // Fetch all users
    res.status(200).json(users);
  } catch (error) {
    console.log('Error fetching user details:', error);
    res.status(500).json({ error: 'Failed to fetch user details' });
  }
});

// User login
app.post('/user/login', async (req, res) => {
  const { email, password } = req.body;
  
  console.log("Email:", email, "Password:", password); // Check if values are received correctly
  
  if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
      const foundUser = await User.findOne({ where: { email } });
      if (!foundUser) {
          return res.status(400).json({ error: 'User not found' });
      }

      const isPasswordValid = await bcrypt.compare(password, foundUser.password);
      if (!isPasswordValid) {
          return res.status(400).json({ error: 'Incorrect Password' });
      }

      const token = generateToken(foundUser.id);
      return res.status(200).json({
          success: true,
          message: 'User logged in successfully',
          token: token
      });
  } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'An error occurred during login' });
  }
});

// User signup
app.post('/user/signup', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    res.redirect('/ExpenseTracker');
  } catch (error) {
    res.status(500).json({ error: 'Error creating user' });
  }
});

// Serve expense tracker page
app.get('/ExpenseTracker', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'expense.html'));
});

// Get all expenses (API) - Protected route
app.get('/api/ExpenseTracker', authMiddleware.authenticate, async (req, res) => {
  try {
    const userId = req.userId; // Retrieved from middleware
    const expenses = await Expense.findAll({ where: { UserId: userId } }); // Filter by user ID

    if (expenses.length === 0) {
      return res.status(404).json({ message: 'No expenses found for this user.' });
    }

    console.log(expenses);
    res.status(200).json(expenses); // Send expenses back
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
});

// POST request to add a new expense (Protected)
app.post('/api/ExpenseTracker', authMiddleware.authenticate, async (req, res) => {
  try {
    const { type, name, date, amount } = req.body;
    const userId = req.userId; // Retrieved from middleware

    // Associate the expense with the logged-in user
    const newExpense = await Expense.create({
      type,
      name,
      date,
      amount,
      UserId: userId,
    });

    console.log('New expense created:', newExpense);
    return res.status(201).json(newExpense); // Return the new expense directly

  } catch (error) {
    console.log('Error adding expense:', error);
    return res.status(500).json({ message: 'Error in posting the expense', error });
  }
});

// DELETE request to remove an expense (Protected)
app.delete('/api/ExpenseTracker/:id', authMiddleware.authenticate, async (req, res) => {
  try {
    const expenseId = req.params.id;
    const userId = req.userId; // Retrieved from middleware

    // Find the expense by ID and ensure it belongs to the logged-in user
    const expense = await Expense.findOne({ where: { id: expenseId, UserId: userId } });

    if (!expense) {
      return res.status(404).json({ error: 'Expense not found or not authorized' });
    }

    await expense.destroy();
    res.status(200).json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error('Error deleting expense:', error);
    res.status(500).json({ error: 'An error occurred while deleting the expense' });
  }
});

// PUT request to update an expense (Protected)
app.put('/api/ExpenseTracker/:id', authMiddleware.authenticate, async (req, res) => {
  try {
    const expenseId = req.params.id;
    const { name, date, amount, type } = req.body;
    const userId = req.userId; // Retrieved from middleware

    // Find the expense by ID and ensure it belongs to the logged-in user
    const expense = await Expense.findOne({ where: { id: expenseId, UserId: userId } });

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found or not authorized' });
    }

    // Update fields
    expense.name = name || expense.name;
    expense.date = date || expense.date;
    expense.amount = amount || expense.amount;
    expense.type = type || expense.type;

    await expense.save();
    console.log('Expense Updated:', expense);
    res.status(200).json(expense);
  } catch (error) {
    console.error('Error updating expense:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

User.hasMany(Expense);
Expense.belongsTo(User);

sequelize.sync({ alter: true })
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });
  })
  .catch((error) => {
    console.log('Error syncing database:', error);
  });
