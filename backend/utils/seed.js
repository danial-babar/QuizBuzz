const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const colors = require('colors');
const mongoose = require('mongoose');
const User = require('../models/User');
const Quiz = require('../models/Quiz');
const QuizResult = require('../models/QuizResult');

// Load env vars
dotenv.config({ path: './.env' });

// Connect to DB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Read JSON files
const users = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../_data/users.json'), 'utf-8')
);

const quizzes = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../_data/quizzes.json'), 'utf-8')
);

const results = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../_data/quizResults.json'), 'utf-8')
);

// Import into DB
const importData = async () => {
  try {
    await User.deleteMany();
    await Quiz.deleteMany();
    await QuizResult.deleteMany();

    await User.create(users);
    await Quiz.create(quizzes);
    await QuizResult.create(results);

    console.log('Data Imported...'.green.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

// Delete data
const deleteData = async () => {
  try {
    await User.deleteMany();
    await Quiz.deleteMany();
    await QuizResult.deleteMany();

    console.log('Data Destroyed...'.red.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
}
