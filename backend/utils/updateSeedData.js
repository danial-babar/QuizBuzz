const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const User = require('../models/User');
const Quiz = require('../models/Quiz');

// Load env vars
dotenv.config({ path: './.env' });

// Connect to DB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const updateQuizResults = async () => {
  try {
    // Get the first user and quiz
    const user1 = await User.findOne({ email: 'john@example.com' });
    const user2 = await User.findOne({ email: 'jane@example.com' });
    const quiz1 = await Quiz.findOne({ title: 'General Knowledge Quiz' });
    const quiz2 = await Quiz.findOne({ title: 'Science Quiz' });

    if (!user1 || !user2 || !quiz1 || !quiz2) {
      console.error('Required data not found in the database');
      process.exit(1);
    }

    // Read the quiz results file
    const resultsPath = path.join(__dirname, '../_data/quizResults.json');
    let results = JSON.parse(fs.readFileSync(resultsPath, 'utf-8'));

    // Replace placeholders with actual IDs
    results = JSON.stringify(results, null, 2)
      .replace(/\{\{USER1_ID\}\}/g, `"${user1._id}"`)
      .replace(/\{\{USER2_ID\}\}/g, `"${user2._id}"`)
      .replace(/\{\{QUIZ1_ID\}\}/g, `"${quiz1._id}"`)
      .replace(/\{\{QUIZ2_ID\}\}/g, `"${quiz2._id}"`);

    // Replace question IDs
    const quiz1QuestionIds = quiz1.questions.map(q => q._id.toString());
    const quiz2QuestionIds = quiz2.questions.map(q => q._id.toString());
    
    for (let i = 0; i < quiz1QuestionIds.length; i++) {
      results = results.replace(
        new RegExp(`\{\{QUESTION${i + 1}_ID\}\}`, 'g'), 
        `"${quiz1QuestionIds[i]}"`
      );
    }
    
    for (let i = 0; i < quiz2QuestionIds.length; i++) {
      results = results.replace(
        new RegExp(`\{\{QUESTION${i + 4}_ID\}\}`, 'g'), 
        `"${quiz2QuestionIds[i]}"`
      );
    }

    // Write the updated results back to the file
    fs.writeFileSync(resultsPath, results);
    
    console.log('Quiz results data updated with actual document IDs'.green.inverse);
    process.exit();
  } catch (err) {
    console.error('Error updating quiz results:', err);
    process.exit(1);
  }
};

updateQuizResults();
