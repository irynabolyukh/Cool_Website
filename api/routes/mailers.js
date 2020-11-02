const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');

const Mailer = require('../models/mailer');

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'netluvflix@gmail.com',
        pass: 'netluvflix123'
    }
});

router.use('/send', function (req, res, next){
    const text = req.body.messageTemplate + '\n' + req.body.myMessage;
    Mailer.find().select('mail -_id').exec().then(mails => {
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
    Mailer.find().exec().then(docs => {
        console.log(docs);
        res.status(200).render('index.ejs', {
            mailers: docs
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

router.post('/', (req,res,next) => {
    const mailer = new Mailer({
        _id: new mongoose.Types.ObjectId(),
        firstName: req.body.firstName,
        surname: req.body.surname,
        midName: req.body.midName,
        mail: req.body.mail
    });

    mailer.save().then(result => {
        console.log(result);
        res.status(201).redirect('/mailers');
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

router.get('/:mailerId', (req,res,next) => {
    const id = req.params.mailerId;
    Mailer.findById(id).select('firstName surname midName _id').exec().then(doc => {
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

router.post('/update/:mailerId', (req,res,next) => {
    const id = req.params.mailerId;
    const updateOps = {};
    for (const [key, value] of Object.entries(req.body)) {
        if(value !== ''){
            updateOps[key] = value;
        }
    }
    Mailer.update({ _id: id }, { $set: updateOps })
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

router.post('/delete/:mailerId', (req,res,next) => {
    const id = req.params.mailerId
    Mailer.remove({
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