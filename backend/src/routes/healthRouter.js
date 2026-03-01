import express from 'express';

const healthRouter = express.Router();

healthRouter.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running fine 🚀',
  });
});

export default healthRouter;
