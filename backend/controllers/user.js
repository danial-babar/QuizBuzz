const User = require('../models/User');
const QuizResult = require('../models/QuizResult');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Get all users
// @route   GET /api/v1/users
// @access  Private/Admin
exports.getUsers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get single user
// @route   GET /api/v1/users/:id
// @access  Private/Admin
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Create user
// @route   POST /api/v1/users
// @access  Private/Admin
exports.createUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);

  res.status(201).json({
    success: true,
    data: user
  });
});

// @desc    Update user
// @route   PUT /api/v1/users/:id
// @access  Private/Admin
exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!user) {
    return next(
      new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Delete user
// @route   DELETE /api/v1/users/:id
// @access  Private/Admin
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
    );
  }

  await user.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get user stats
// @route   GET /api/v1/users/stats
// @access  Private
exports.getUserStats = asyncHandler(async (req, res, next) => {
  const stats = await QuizResult.aggregate([
    {
      $match: { user: req.user._id }
    },
    {
      $group: {
        _id: '$user',
        totalQuizzes: { $sum: 1 },
        totalScore: { $sum: '$score' },
        avgScore: { $avg: '$score' },
        totalTimeSpent: { $sum: '$timeSpent' },
        totalCorrectAnswers: { $sum: '$correctAnswers' },
        totalQuestions: { $sum: '$totalQuestions' },
        quizzesByCategory: { $addToSet: '$quiz' }
      }
    },
    {
      $lookup: {
        from: 'quizzes',
        localField: 'quizzesByCategory',
        foreignField: '_id',
        as: 'quizDetails'
      }
    },
    {
      $addFields: {
        categories: {
          $reduce: {
            input: '$quizDetails',
            initialValue: [],
            in: {
              $cond: [
                { $in: ['$$this.category', '$$value'] },
                '$$value',
                { $concatArrays: ['$$value', ['$$this.category']] }
              ]
            }
          }
        }
      }
    },
    {
      $project: {
        _id: 0,
        totalQuizzes: 1,
        totalScore: 1,
        avgScore: { $round: ['$avgScore', 2] },
        totalTimeSpent: 1,
        accuracy: {
          $multiply: [
            { $divide: ['$totalCorrectAnswers', '$totalQuestions'] },
            100
          ]
        },
        categories: 1
      }
    }
  ]);

  if (stats.length === 0) {
    return res.status(200).json({
      success: true,
      data: {
        totalQuizzes: 0,
        totalScore: 0,
        avgScore: 0,
        totalTimeSpent: 0,
        accuracy: 0,
        categories: []
      }
    });
  }

  res.status(200).json({
    success: true,
    data: stats[0]
  });
});

// @desc    Get user's quiz history
// @route   GET /api/v1/users/history
// @access  Private
exports.getUserHistory = asyncHandler(async (req, res, next) => {
  const results = await QuizResult.find({ user: req.user.id })
    .populate({
      path: 'quiz',
      select: 'title category difficulty'
    })
    .sort('-completedAt')
    .limit(10);

  res.status(200).json({
    success: true,
    count: results.length,
    data: results
  });
});

// @desc    Get user's achievements
// @route   GET /api/v1/users/achievements
// @access  Private
exports.getUserAchievements = asyncHandler(async (req, res, next) => {
  const achievements = [];
  
  // Get user stats
  const stats = await QuizResult.aggregate([
    {
      $match: { user: req.user._id }
    },
    {
      $group: {
        _id: null,
        totalQuizzes: { $sum: 1 },
        maxScore: { $max: '$score' },
        perfectScores: {
          $sum: {
            $cond: [{ $eq: ['$score', 100] }, 1, 0]
          }
        },
        categories: { $addToSet: '$quiz' }
      }
    },
    {
      $lookup: {
        from: 'quizzes',
        localField: 'categories',
        foreignField: '_id',
        as: 'quizDetails'
      }
    },
    {
      $project: {
        _id: 0,
        totalQuizzes: 1,
        maxScore: 1,
        perfectScores: 1,
        uniqueCategories: { $size: '$quizDetails.category' }
      }
    }
  ]);

  const userStats = stats[0] || {
    totalQuizzes: 0,
    maxScore: 0,
    perfectScores: 0,
    uniqueCategories: 0
  };

  // Define achievements
  const achievementList = [
    {
      id: 'first_quiz',
      name: 'First Quiz',
      description: 'Complete your first quiz',
      icon: 'trophy',
      achieved: userStats.totalQuizzes >= 1,
      progress: userStats.totalQuizzes >= 1 ? 100 : 0
    },
    {
      id: 'quiz_master',
      name: 'Quiz Master',
      description: 'Complete 10 quizzes',
      icon: 'award',
      achieved: userStats.totalQuizzes >= 10,
      progress: Math.min((userStats.totalQuizzes / 10) * 100, 100)
    },
    {
      id: 'perfectionist',
      name: 'Perfectionist',
      description: 'Score 100% on a quiz',
      icon: 'star',
      achieved: userStats.maxScore === 100,
      progress: userStats.maxScore === 100 ? 100 : 0
    },
    {
      id: 'all_rounder',
      name: 'All-Rounder',
      description: 'Take quizzes in 5 different categories',
      icon: 'layers',
      achieved: userStats.uniqueCategories >= 5,
      progress: Math.min((userStats.uniqueCategories / 5) * 100, 100)
    },
    {
      id: 'perfect_streak',
      name: 'Perfect Streak',
      description: 'Get 3 perfect scores in a row',
      icon: 'zap',
      achieved: userStats.perfectScores >= 3,
      progress: Math.min((userStats.perfectScores / 3) * 100, 100)
    }
  ];

  res.status(200).json({
    success: true,
    data: achievementList
  });
});
