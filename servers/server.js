const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());

const { run } = require('./db/connexionDb');

app.listen(port, async () => {
    try {
        await run();
        console.log(`Server is running on port: ${port}`);
    } catch (err) {
        console.error(err);
    }
});
