const Quiz = require('../models/Quiz');
const QuizResult = require('../models/QuizResult');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Get all quizzes
// @route   GET /api/v1/quiz
// @access  Public
exports.getQuizzes = asyncHandler(async (req, res, next) => {
  // Copy req.query
  const reqQuery = { ...req.query };

  // Fields to exclude
  const removeFields = ['select', 'sort', 'page', 'limit'];

  // Loop over removeFields and delete them from reqQuery
  removeFields.forEach(param => delete reqQuery[param]);

  // Create query string
  let queryStr = JSON.stringify(reqQuery);

  // Create operators ($gt, $gte, etc)
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

  // Finding resource
  let query = Quiz.find(JSON.parse(queryStr)).populate('createdBy', 'name');

  // Select Fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Quiz.countDocuments(JSON.parse(queryStr));

  query = query.skip(startIndex).limit(limit);

  // Executing query
  const quizzes = await query;

  // Pagination result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    };
  }

  res.status(200).json({
    success: true,
    count: quizzes.length,
    pagination,
    data: quizzes
  });
});

// @desc    Get single quiz
// @route   GET /api/v1/quiz/:id
// @access  Public
exports.getQuiz = asyncHandler(async (req, res, next) => {
  const quiz = await Quiz.findById(req.params.id).populate('createdBy', 'name');

  if (!quiz) {
    return next(
      new ErrorResponse(`Quiz not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: quiz
  });
});

// @desc    Create new quiz
// @route   POST /api/v1/quiz
// @access  Private
exports.createQuiz = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.createdBy = req.user.id;

  const quiz = await Quiz.create(req.body);

  res.status(201).json({
    success: true,
    data: quiz
  });
});

// @desc    Update quiz
// @route   PUT /api/v1/quiz/:id
// @access  Private
exports.updateQuiz = asyncHandler(async (req, res, next) => {
  let quiz = await Quiz.findById(req.params.id);

  if (!quiz) {
    return next(
      new ErrorResponse(`Quiz not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is quiz owner or admin
  if (quiz.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this quiz`,
        401
      )
    );
  }

  quiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: quiz
  });
});

// @desc    Delete quiz
// @route   DELETE /api/v1/quiz/:id
// @access  Private
exports.deleteQuiz = asyncHandler(async (req, res, next) => {
  const quiz = await Quiz.findById(req.params.id);

  if (!quiz) {
    return next(
      new ErrorResponse(`Quiz not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is quiz owner or admin
  if (quiz.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete this quiz`,
        401
      )
    );
  }

  await quiz.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Submit quiz results
// @route   POST /api/v1/quiz/:id/submit
// @access  Private
exports.submitQuiz = asyncHandler(async (req, res, next) => {
  const quiz = await Quiz.findById(req.params.id);

  if (!quiz) {
    return next(
      new ErrorResponse(`Quiz not found with id of ${req.params.id}`, 404)
    );
  }

  // Calculate score
  let score = 0;
  let correctAnswers = 0;
  const answers = [];
  let totalTimeSpent = 0;

  for (const answer of req.body.answers) {
    const question = quiz.questions.id(answer.questionId);
    
    if (!question) continue;
    
    const isCorrect = question.options[answer.selectedOption]?.isCorrect || false;
    
    if (isCorrect) {
      score += question.points;
      correctAnswers++;
    }
    
    answers.push({
      question: question._id,
      selectedOption: answer.selectedOption,
      isCorrect,
      timeTaken: answer.timeTaken || 0
    });
    
    totalTimeSpent += answer.timeTaken || 0;
  }

  // Calculate percentage
  const percentage = Math.round((score / quiz.questions.reduce((sum, q) => sum + q.points, 0)) * 100);

  // Create quiz result
  const quizResult = await QuizResult.create({
    user: req.user.id,
    quiz: quiz._id,
    answers,
    score: percentage,
    totalQuestions: quiz.questions.length,
    correctAnswers,
    timeSpent: Math.round(totalTimeSpent / 1000) // Convert to seconds
  });

  // Update user's score stats
  await req.user.updateScoreStats(percentage);

  // Update quiz stats
  quiz.timesPlayed += 1;
  await quiz.save();

  res.status(201).json({
    success: true,
    data: quizResult
  });
});

// @desc    Get quiz results for a user
// @route   GET /api/v1/quiz/results
// @access  Private
exports.getUserResults = asyncHandler(async (req, res, next) => {
  const results = await QuizResult.find({ user: req.user.id })
    .populate({
      path: 'quiz',
      select: 'title category difficulty'
    })
    .sort('-completedAt');

  res.status(200).json({
    success: true,
    count: results.length,
    data: results
  });
});

// @desc    Get leaderboard
// @route   GET /api/v1/quiz/leaderboard
// @access  Public
exports.getLeaderboard = asyncHandler(async (req, res, next) => {
  const leaderboard = await QuizResult.aggregate([
    {
      $group: {
        _id: '$user',
        totalScore: { $sum: '$score' },
        quizzesTaken: { $sum: 1 },
        averageScore: { $avg: '$score' },
        lastPlayed: { $max: '$completedAt' }
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'user'
      }
    },
    {
      $unwind: '$user'
    },
    {
      $project: {
        'user.password': 0,
        'user.__v': 0,
        'user.role': 0,
        'user.resetPasswordToken': 0,
        'user.resetPasswordExpire': 0,
        'user.createdAt': 0,
        'user.updatedAt': 0
      }
    },
    {
      $sort: { totalScore: -1 }
    },
    {
      $limit: 50
    }
  ]);

  res.status(200).json({
    success: true,
    count: leaderboard.length,
    data: leaderboard
  });
});
