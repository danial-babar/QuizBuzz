const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, 'Please add a question'],
    trim: true,
    maxlength: [1000, 'Question cannot be more than 1000 characters']
  },
  options: [
    {
      text: {
        type: String,
        required: [true, 'Please add option text'],
        trim: true
      },
      isCorrect: {
        type: Boolean,
        default: false
      }
    }
  ],
  explanation: {
    type: String,
    trim: true,
    maxlength: [1000, 'Explanation cannot be more than 1000 characters']
  },
  points: {
    type: Number,
    default: 1,
    min: [1, 'Points must be at least 1']
  },
  timeLimit: {
    type: Number,
    default: 30, // seconds
    min: [5, 'Time limit must be at least 5 seconds']
  }
});

const QuizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    trim: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  timeLimit: {
    type: Number,
    default: 300, // 5 minutes in seconds
    min: [30, 'Time limit must be at least 30 seconds']
  },
  questions: [QuestionSchema],
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  timesPlayed: {
    type: Number,
    default: 0
  },
  averageScore: {
    type: Number,
    default: 0
  },
  ratingsAverage: {
    type: Number,
    default: 0,
    min: [0, 'Rating must be at least 0'],
    max: [5, 'Rating cannot be more than 5']
  },
  ratingsQuantity: {
    type: Number,
    default: 0
  }
});

// Static method to get average score of a quiz
QuizSchema.statics.getAverageScore = async function(quizId) {
  const obj = await this.aggregate([
    {
      $match: { _id: quizId }
    },
    {
      $lookup: {
        from: 'quizresults',
        localField: '_id',
        foreignField: 'quiz',
        as: 'results'
      }
    },
    {
      $project: {
        averageScore: { $avg: '$results.score' },
        timesPlayed: { $size: '$results' }
      }
    }
  ]);

  try {
    await this.model('Quiz').findByIdAndUpdate(quizId, {
      averageScore: obj[0]?.averageScore || 0,
      timesPlayed: obj[0]?.timesPlayed || 0
    });
  } catch (err) {
    console.error(err);
  }
};

// Call getAverageScore after save or update quiz results
// This would be called from the QuizResult model

module.exports = mongoose.model('Quiz', QuizSchema);
