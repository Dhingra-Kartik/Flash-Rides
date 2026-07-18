const express = require('express');
const bodyParser = require('body-parser');
const v1Router = require('./routes/v1Routes')
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/v1', v1Router);

app.listen(process.env.PORT, ()=>{
    console.log(`SERVER IS LISTENING AT ${process.env.PORT}`);
})