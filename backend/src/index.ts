import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { MONGO_URI, PORT } from './config';
import authRoutes from './routes/auth';
import cookieParser from 'cookie-parser';

const app = express();

app.use(
    cors({
      origin: 'http://localhost:3000', // Your frontend URL
      credentials: true, // Allow cookies
    })
  );
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

mongoose
    .connect(MONGO_URI, { dbName: 'studyroom' })
    .then(() => {
        console.log('Connected to MongoDB Atlas');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err);
    });

app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
