import express from 'express';
import { Registration } from '../controllers/authController.js';

const authRouter = express.Router();

//It is testing api for swagger ui
/**
 * @swagger
 * /api/auth/registration:
 *   post:
 *     summary: Register a new student
 *     tags:
 *      - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: Rahul
 *               email:
 *                 type: string
 *                 example: rahul@gmail.com
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error or user already exists
 *       500:
 *         description: Server error
 */

authRouter.post('/registration', Registration);

export default authRouter;
