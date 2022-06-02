const express = require('express');
const bodyParser = require('body-parser');
const app = express();

require('dotenv').config()


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use('/api/v1', require('./routers/v1.js'));

app.listen(process.env.PORT, () => {
    console.log(`server running at PORT: ${process.env.PORT}`)
})