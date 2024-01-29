const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');

app.use(bodyParser.json())
app.use(morgan('dev'));
const dotenv = require('dotenv');
dotenv.config({ path: './src/config/config.env' });

app.get('/', (req, res) => {
    res.send('Server is running');
})

app.use('/api/envelopes', require('./src/routes/envelopesRouter'))
app.use('/api/transactions', require('./src/routes/transactionRouter'))

const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})

module.exports = app;

