import { errors } from 'celebrate';
import cors from 'cors';
import express from 'express';
import path from 'path';

import routes from './routes';

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);

app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));

app.use(errors());

// eslint-disable-next-line no-console
app.listen(3333, () => console.log('🚀 server started on port 3333!'));
