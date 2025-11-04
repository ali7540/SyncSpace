import express from 'express';
import cors from 'cors';
import apiRoutes from './api/routes/index.js';

const app = express();

app.use(cors({
  origin: '*', // For development. In production, list your frontend's domain
}));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use('/api', apiRoutes);

app.get('/', (req, res) => {
  res.status(200).json({ message: 'SyncSpace Backend is running!' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

export default app;
