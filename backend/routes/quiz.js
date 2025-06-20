const express = require('express');
const {
  getQuizzes,
  getQuiz,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  submitQuiz,
  getUserResults,
  getLeaderboard
} = require('../controllers/quiz');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Quizzes
 *   description: Quiz management and retrieval
 */

/**
 * @swagger
 * /api/v1/quiz:
 *   get:
 *     summary: Get all quizzes
 *     tags: [Quizzes]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter quizzes by category
 *       - in: query
 *         name: difficulty
 *         schema:
 *           type: string
 *           enum: [easy, medium, hard]
 *         description: Filter quizzes by difficulty
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Maximum number of quizzes to return
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *     responses:
 *       200:
 *         description: List of quizzes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 pagination:
 *                   type: object
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Quiz'
 */
router.get('/', getQuizzes);

/**
 * @swagger
 * /api/v1/quiz/{id}:
 *   get:
 *     summary: Get a single quiz by ID
 *     tags: [Quizzes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Quiz ID
 *     responses:
 *       200:
 *         description: Quiz details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       404:
 *         description: Quiz not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', getQuiz);

/**
 * @swagger
 * /api/v1/quiz/leaderboard:
 *   get:
 *     summary: Get the quiz leaderboard
 *     tags: [Quizzes]
 *     responses:
 *       200:
 *         description: Leaderboard data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       totalScore:
 *                         type: number
 *                       averageScore:
 *                         type: number
 *                       quizzesTaken:
 *                         type: number
 *                       user:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           name:
 *                             type: string
 *                           email:
 *                             type: string
 */
router.get('/leaderboard', getLeaderboard);

// Protected routes (require authentication)
router.use(protect);

/**
 * @swagger
 * /api/v1/quiz/results:
 *   get:
 *     summary: Get current user's quiz results
 *     tags: [Quizzes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's quiz results
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/QuizResult'
 */
router.get('/results', getUserResults);

/**
 * @swagger
 * /api/v1/quiz/{id}/submit:
 *   post:
 *     summary: Submit quiz answers
 *     tags: [Quizzes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Quiz ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - answers
 *             properties:
 *               answers:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - questionId
 *                     - selectedOption
 *                     - timeTaken
 *                   properties:
 *                     questionId:
 *                       type: string
 *                     selectedOption:
 *                       type: number
 *                     timeTaken:
 *                       type: number
 *     responses:
 *       201:
 *         description: Quiz submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Quiz not found
 */
router.post('/:id/submit', submitQuiz);

// Admin/creator routes
router.use(authorize('admin'));

/**
 * @swagger
 * /api/v1/quiz:
 *   post:
 *     summary: Create a new quiz
 *     tags: [Quizzes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Quiz'
 *     responses:
 *       201:
 *         description: Quiz created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       400:
 *         description: Invalid input
 */
router.post('/', createQuiz);

/**
 * @swagger
 * /api/v1/quiz/{id}:
 *   put:
 *     summary: Update a quiz
 *     tags: [Quizzes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Quiz ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Quiz'
 *     responses:
 *       200:
 *         description: Quiz updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Quiz not found
 */
router.put('/:id', updateQuiz);

/**
 * @swagger
 * /api/v1/quiz/{id}:
 *   delete:
 *     summary: Delete a quiz
 *     tags: [Quizzes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Quiz ID
 *     responses:
 *       200:
 *         description: Quiz deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Quiz not found
 */
router.delete('/:id', deleteQuiz);

module.exports = router;
