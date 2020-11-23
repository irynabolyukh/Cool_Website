const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const app = express();
const morgan = require('morgan'); //logging tool for HTTP servers
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const config = require('config');
const title = config.get('App.title');
const color = config.get('App.color');
const domain = config.get('App.domain');
const emailVerify = config.get('App.emailVerify');

const adminRoutes = require('./api/routes/admin');

mongoose.connect('mongodb+srv://node-mailer:' + process.env.MONGO_ATLAS_PW + '@node-rest-mailer.p4zyl.mongodb.net/' + process.env.MONGO_ATLAS_NM + '?retryWrites=true&w=majority',
    { useNewUrlParser: true,
        useUnifiedTopology: true }
);

app.use(expressLayouts);
app.set('layout', './layouts/admin-layout');
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

let pages = [{"name": "HOME", "href": "/home"}, {"name": "TRAININGS", "href": "/trainings"}, {"name": "ABOUT", "href": "/about"}];
let pagesUkr = [{"name": "ГОЛОВНА", "href": "/home-ukr"}, {"name": "ТРЕНІНГИ", "href": "/trainings-ukr"}, {"name": "ПРО НАС", "href": "/about-ukr"}];

app.use('/home', (req, res) => {
    res.render('home', {
        layout: './layouts/regular-layout', emailVerify: emailVerify,
        title: title, color: color, pages: pages, domain: domain
    });
});

app.use('/home-ukr', (req, res) => {
    res.render('home-ukr', {
        layout: './layouts/regular-layout-ukr', emailVerify: emailVerify,
        title: title, color: color, pages: pagesUkr, domain: domain
    });
});

app.use('/about', (req, res) => {
    res.render('about', {
        layout: './layouts/regular-layout', emailVerify: emailVerify,
        title: title, color: color, pages: pages, domain: domain
    });
});

app.use('/about-ukr', (req, res) => {
    res.render('about-ukr', {
        layout: './layouts/regular-layout-ukr', emailVerify: emailVerify,
        title: title, color: color, pages: pagesUkr, domain: domain
    });
});

app.use('/trainings', (req, res) => {
    res.render('trainings', {
        layout: './layouts/regular-layout', emailVerify: emailVerify,
        title: title, color: color, pages: pages, domain: domain
    });
});

app.use('/trainings-ukr', (req, res) => {
    res.render('trainings-ukr', {
        layout: './layouts/regular-layout-ukr', emailVerify: emailVerify,
        title: title, color: color, pages: pagesUkr, domain: domain
    });
});

app.use('/admin', adminRoutes);

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