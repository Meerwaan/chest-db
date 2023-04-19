require('dotenv').config({ path: '.env' });
const express = require('express');
const router = express.Router();
const app = express();
const port = 8000;

const { run } = require('./db/connexionDb'); 


router.get('/data', (req, res) => {
    res.json({ message: 'Hello World!' });
});

app.use(router);

run().then(() => {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}).catch((error) => {
    console.error(`An error occurred while connecting to the database: ${error}`);
});
