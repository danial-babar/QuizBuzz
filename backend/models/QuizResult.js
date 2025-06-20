const mongoose = require('mongoose');

const AnswerSchema = new mongoose.Schema({
  question: {
    type: mongoose.Schema.ObjectId,
    ref: 'Quiz.questions',
    required: true
  },
  selectedOption: {
    type: Number,
    required: true
  },
  isCorrect: {
    type: Boolean,
    required: true
  },
  timeTaken: {
    type: Number,
    required: true,
    min: [0, 'Time taken cannot be negative']
  }
});

const QuizResultSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  quiz: {
    type: mongoose.Schema.ObjectId,
    ref: 'Quiz',
    required: true
  },
  answers: [AnswerSchema],
  score: {
    type: Number,
    required: true,
    min: [0, 'Score cannot be negative']
  },
  totalQuestions: {
    type: Number,
    required: true,
    min: [1, 'Total questions must be at least 1']
  },
  correctAnswers: {
    type: Number,
    required: true,
    min: [0, 'Correct answers cannot be negative']
  },
  timeSpent: {
    type: Number,
    required: true,
    min: [0, 'Time spent cannot be negative']
  },
  completedAt: {
    type: Date,
    default: Date.now
  }
});

// Create index for better query performance
QuizResultSchema.index({ user: 1, quiz: 1 });

// Static method to get user's stats
QuizResultSchema.statics.getUserStats = async function(userId) {
  const stats = await this.aggregate([
    {
      $match: { user: mongoose.Types.ObjectId(userId) }
    },
    {
      $group: {
        _id: '$user',
        totalQuizzes: { $sum: 1 },
        totalScore: { $sum: '$score' },
        avgScore: { $avg: '$score' },
        totalTimeSpent: { $sum: '$timeSpent' },
        totalCorrectAnswers: { $sum: '$correctAnswers' },
        totalQuestions: { $sum: '$totalQuestions' }
      }
    }
  ]);

  if (stats.length > 0) {
    const userStats = stats[0];
    userStats.accuracy = (userStats.totalCorrectAnswers / userStats.totalQuestions) * 100;
    return userStats;
  }

  return null;
};

// Call getAverageScore after save
QuizResultSchema.post('save', async function() {
  // Update quiz stats
  await this.model('Quiz').getAverageScore(this.quiz);
  
  // Update user stats
  const userStats = await this.model('QuizResult').getUserStats(this.user);
  if (userStats) {
    await this.model('User').findByIdAndUpdate(this.user, {
      totalScore: userStats.totalScore,
      quizzesTaken: userStats.totalQuizzes,
      averageScore: Math.round(userStats.avgScore || 0)
    });
  }
});

module.exports = mongoose.model('QuizResult', QuizResultSchema);
