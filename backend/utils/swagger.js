const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'QuizBuzz API',
      version: '1.0.0',
      description: 'API for QuizBuzz - A Quiz Application',
      contact: {
        name: 'QuizBuzz Support',
        email: 'support@quizbuzz.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000/api/v1',
        description: 'Development server'
      },
      {
        url: 'https://api.quizbuzz.com/api/v1',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      responses: {
        UnauthorizedError: {
          description: 'Access token is missing or invalid'
        },
        BadRequest: {
          description: 'Bad request. Please check your input data.'
        },
        NotFound: {
          description: 'The requested resource was not found.'
        },
        ServerError: {
          description: 'Internal server error.'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'The auto-generated id of the user'
            },
            name: {
              type: 'string',
              description: 'User\'s full name',
              example: 'John Doe'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User\'s email address',
              example: 'john@example.com'
            },
            role: {
              type: 'string',
              enum: ['user', 'admin'],
              default: 'user',
              description: 'User role'
            },
            totalScore: {
              type: 'number',
              description: 'Total score across all quizzes',
              default: 0
            },
            quizzesTaken: {
              type: 'number',
              description: 'Number of quizzes taken',
              default: 0
            },
            averageScore: {
              type: 'number',
              description: 'Average score across all quizzes',
              default: 0
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Date and time when the user was created'
            }
          }
        },
        Quiz: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'The auto-generated id of the quiz'
            },
            title: {
              type: 'string',
              description: 'Title of the quiz',
              example: 'General Knowledge Quiz'
            },
            description: {
              type: 'string',
              description: 'Description of the quiz',
              example: 'Test your general knowledge with this fun quiz!'
            },
            category: {
              type: 'string',
              description: 'Category of the quiz',
              example: 'General Knowledge'
            },
            difficulty: {
              type: 'string',
              enum: ['easy', 'medium', 'hard'],
              default: 'medium',
              description: 'Difficulty level of the quiz'
            },
            timeLimit: {
              type: 'number',
              description: 'Time limit in seconds',
              default: 300,
              example: 300
            },
            questions: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Question'
              }
            },
            createdBy: {
              $ref: '#/components/schemas/User'
            },
            isPublished: {
              type: 'boolean',
              default: false,
              description: 'Whether the quiz is published and visible to users'
            },
            timesPlayed: {
              type: 'number',
              default: 0,
              description: 'Number of times the quiz has been played'
            },
            averageScore: {
              type: 'number',
              default: 0,
              description: 'Average score of all attempts at this quiz'
            },
            ratingsAverage: {
              type: 'number',
              default: 0,
              minimum: 0,
              maximum: 5,
              description: 'Average rating of the quiz (0-5)'
            },
            ratingsQuantity: {
              type: 'number',
              default: 0,
              description: 'Number of ratings received'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Date and time when the quiz was created'
            }
          }
        },
        Question: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'The auto-generated id of the question'
            },
            question: {
              type: 'string',
              description: 'The question text',
              example: 'What is the capital of France?'
            },
            options: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/QuestionOption'
              },
              minItems: 2,
              maxItems: 5,
              description: 'Array of possible answers'
            },
            explanation: {
              type: 'string',
              description: 'Explanation of the correct answer',
              example: 'Paris is the capital and most populous city of France.'
            },
            points: {
              type: 'number',
              default: 1,
              minimum: 1,
              description: 'Points awarded for a correct answer'
            },
            timeLimit: {
              type: 'number',
              default: 30,
              minimum: 5,
              description: 'Time limit in seconds to answer this question'
            }
          }
        },
        QuestionOption: {
          type: 'object',
          properties: {
            text: {
              type: 'string',
              description: 'The option text',
              example: 'Paris'
            },
            isCorrect: {
              type: 'boolean',
              default: false,
              description: 'Whether this option is the correct answer'
            }
          }
        },
        QuizResult: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'The auto-generated id of the quiz result'
            },
            user: {
              $ref: '#/components/schemas/User'
            },
            quiz: {
              $ref: '#/components/schemas/Quiz'
            },
            answers: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/UserAnswer'
              },
              description: 'Array of user answers'
            },
            score: {
              type: 'number',
              minimum: 0,
              maximum: 100,
              description: 'Percentage score (0-100)'
            },
            totalQuestions: {
              type: 'number',
              minimum: 1,
              description: 'Total number of questions in the quiz'
            },
            correctAnswers: {
              type: 'number',
              minimum: 0,
              description: 'Number of correct answers'
            },
            timeSpent: {
              type: 'number',
              minimum: 0,
              description: 'Time spent on the quiz in seconds'
            },
            completedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Date and time when the quiz was completed'
            }
          }
        },
        UserAnswer: {
          type: 'object',
          properties: {
            question: {
              type: 'string',
              description: 'Reference to the question ID'
            },
            selectedOption: {
              type: 'number',
              minimum: 0,
              description: 'Index of the selected option'
            },
            isCorrect: {
              type: 'boolean',
              description: 'Whether the answer was correct'
            },
            timeTaken: {
              type: 'number',
              minimum: 0,
              description: 'Time taken to answer in seconds'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            error: {
              type: 'string',
              description: 'Error message',
              example: 'Not authorized to access this route'
            }
          }
        },
        Success: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            data: {
              type: 'object',
              description: 'Response data',
              additionalProperties: true
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./routes/*.js', './models/*.js'] // Path to the API routes
};

const specs = swaggerJsdoc(options);

module.exports = { specs, swaggerUi };
