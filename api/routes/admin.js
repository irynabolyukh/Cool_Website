const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');

const config = require('config');
// const title = process.env.App.title;
const title = config.get('App.title');
const domain = config.get('App.domain');
const color = config.get('App.color');

const Application = require('../models/application');
const Training = require('../models/training');

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'netluvflix@gmail.com',
        pass: 'netluvflix123'
    }
});

router.use('/send', function (req, res, next){
    const text = req.body.messageTemplate + '\n' + req.body.myMessage;
    Application.find().select('mail -_id').exec().then(mails => {
        let mailOptions = {
            from: 'netluvflix@gmail.com',
            to: mails,
            subject: 'Spam Mailer',
            text: text
        };
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
        res.redirect('/mailers');
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error: err,
            message: "Cannot send message"
        });
    });
});

router.get('/', (req,res,next) => {
    Application.find().exec().then(docs => {
        console.log(docs);
        res.status(200).render('index.ejs', {
            mailers: docs,
            title: title,
            domain: domain,
            color: color
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

router.post('/', (req,res,next) => {
    const application = new Application({
        _id: new mongoose.Types.ObjectId(),
        firstName: req.body.firstName,
        surname: req.body.surname,
        mail: req.body.mail,
        phoneNum: req.body.phoneNum,
        applicText: req.body.applicText
    });

    application.save().then(result => {
        console.log(result);
        res.status(201).redirect('/mailers');
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

router.post('/training', (req,res,next) => {
    const training = new Training({
        _id: new mongoose.Types.ObjectId(),
        nameT: req.body.nameT,
        descrShort: req.body.descrShort,
        descrLong: req.body.descrLong
    });

    training.save().then(result => {
        console.log(result);
        res.status(201).redirect('/mailers');
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

router.get('/:applicId', (req,res,next) => {
    const id = req.params.applicId;
    Application.findById(id).select('firstName surname _id').exec().then(doc => {
        console.log(doc);
        if(doc){
            res.status(200).json(doc);
        }else{
            res.status(404).json({
                message: "No mailer found for provided ID"
            });
        }
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

router.post('/update/:applicId', (req,res,next) => {
    const id = req.params.applicId;
    const updateOps = {};
    for (const [key, value] of Object.entries(req.body)) {
        if(value !== ''){
            updateOps[key] = value;
        }
    }
    Application.update({ _id: id }, { $set: updateOps })
        .exec().then(result => {
            console.log(result);
            res.status(200).redirect('/mailers');
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

router.post('/delete/:applicId', (req,res,next) => {
    const id = req.params.applicId
    Application.remove({
       _id: id
    }).exec().then(result => {
        res.status(200).redirect('/mailers');
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    });
});

module.exports = router;