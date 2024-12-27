import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { MONGO_URI, PORT } from './config';
import authRoutes from './routes/auth';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
