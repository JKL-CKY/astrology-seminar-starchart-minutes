import * as express from 'express';
import * as cors from 'cors';
import * as dotenv from 'dotenv';
import seminarRoutes from './routes/seminarRoutes';
import * as fs from 'fs';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const uploadsDir = 'uploads';
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

app.use('/api/seminars', seminarRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: '占星研讨会服务运行中 ✨' });
});

export default app;
