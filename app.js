const express = require('express');
const app = express();
const morgan = require('morgan'); //logging tool for HTTP servers
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const mailerRoutes = require('./api/routes/mailers');

mongoose.connect('mongodb+srv://node-mailer:' + process.env.MONGO_ATLAS_PW + '@node-rest-mailer.p4zyl.mongodb.net/' + process.env.MONGO_ATLAS_NM + '?retryWrites=true&w=majority',
    { useNewUrlParser: true,
        useUnifiedTopology: true }
);

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')));


app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, PATCH, DELETE');
        return res.status(200).json({});
    }
    next();
});

app.use('/mailers', mailerRoutes);

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
});

module.exports = app;