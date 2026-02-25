import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger.js';
import authRouter from './routes/authRouter.js';
import { ConnectDb } from './config/connectDB.js';

const app = express();
app.use(helmet());

app.use(express.json()); // body parser

// Swagger UI route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/auth', authRouter);

app.get('/', (req, res) => {
  res.send('Backend is running 🚀');
});

const data = 10;

if (data > 5) {
  console.log('Data is greater than 5');
}

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  ConnectDb();
});
