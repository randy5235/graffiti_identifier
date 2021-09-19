import express from 'express';

import {router}  from './routes';

const app = express();

const port = 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('uploads'));
app.use('/api', router);
// app.get('/', (req, res) => res.send('Hello, World!'));

// eslint-disable-next-line no-console
app.listen(port, () => console.log(`Server is running on port ${port}`));
