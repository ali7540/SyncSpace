import express from 'express';
import cors from 'cors';
import apiRoutes from './api/routes/index.js';

const app = express();

const allowedOrigins = [
  process.env.FRONTEND_URL, // Your live Vercel URL
  'http://localhost:3000'     // Your local dev URL
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
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
