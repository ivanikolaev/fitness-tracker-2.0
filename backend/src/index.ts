import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from 'dotenv';
import { AppDataSource } from './data-source';
import { errorHandler } from './middlewares/errorHandler';
import authRoutes from './routes/authRoutes';
import exerciseRoutes from './routes/exerciseRoutes';
import workoutRoutes from './routes/workoutRoutes';
import userRoutes from './routes/userRoutes';

// Load environment variables
config();

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    cors({
        origin: function(origin, callback) {
            const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174'];
            if (!origin || allowedOrigins.indexOf(origin) !== -1) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true,
    })
);
app.use(helmet());
app.use(morgan('dev'));

// Routes
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/users', userRoutes);

// Error handling middleware
app.use(errorHandler);

// Initialize database connection and start server
const startServer = async () => {
    try {
        await AppDataSource.initialize();
        console.log('Database connection established');

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Error during server startup:', error);
        process.exit(1);
    }
};

startServer();
