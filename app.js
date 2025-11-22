const express = require('express');
const app = express();
const PORT = 3001;
// const db = require('./quries.js');

app.use(express.json());

const bodyParser = require('body-parser');

app.use(bodyParser.json());

app.listen(PORT, () => {
    console.log(`Server listening on PORT: ${PORT}`);
});

// ROUTES
// Homepage
app.get('/', (request, response) => {
    response.send('Welcome to E-Commerce');
});


