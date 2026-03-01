import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import authRouter from './routes/authRouter.js';
import swaggerSpec from './config/swagger.config.js';
import { errorMiddleware } from './middleware/errorMiddleware.js';
import { UnVerifyedUserDelete } from './utils/unVerifyedUserDelete.js';
import healthRouter from './routes/healthRouter.js';
const app = express();
app.use(helmet());
 app.use(cors());

app.use(express.json()); // body parser

// Start the cleanup process
UnVerifyedUserDelete();

// Swagger UI route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running',
    documentation: '/api-docs',
    health: '/health',
  });
});
app.use('/', healthRouter);
app.use('/api/auth', authRouter);

// Error handling middleware
app.use(errorMiddleware);

export default app;
