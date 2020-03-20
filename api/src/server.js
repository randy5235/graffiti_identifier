const express = require('express');
const bodyParser = require('body-parser');

const router = require('./routes');

const app = express();

const port = 3000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('uploads'));
app.use('/api', router);
// app.get('/', (req, res) => res.send('Hello, World!'));

// eslint-disable-next-line no-console
app.listen(port, () => console.log(`Server is running on port ${port}`));
