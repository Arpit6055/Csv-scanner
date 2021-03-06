const router = require('express').Router();
const File = require('../models/file');
const Csv = require('../models/csv');



const fs = require('fs');
const { ensureAuthenticated } = require('../config/auth');

router.get('/:uuid', ensureAuthenticated, async (req, res) => {
    try {
        const file = await File.findOne({ uuid: req.params.uuid });
      
        return res.render('download', { uuid: file.uuid, fileName: file.filename, user: req.user.name,fileSize: file.size, downloadLink: `${process.env.APP_BASE_URL}/files/download/${file.uuid}` });
     
    } catch(err) {
        return res.render('dashboard');
    }
});

router.get('/read/:uuid', ensureAuthenticated, async (req, res) => {
    try {
        const file = await File.findOne({ uuid: req.params.uuid });
        const csv = await Csv.findOne({ filename: file.filename });
        const data = JSON.stringify(csv.data, null, 10);
        res.render('read', {data});
     
    } catch(err) {
        console.log(err);
        return res.render('dashboard');
    }
});

router.get('/delete/:uuid', ensureAuthenticated, async (req, res) => {
    try {
        const file = await File.findOne({ uuid: req.params.uuid });
        const csv = await Csv.findOne({ filename: file.filename });
        fs.unlinkSync(file.path);
        await file.remove();
        await csv.remove();
        console.log(`successfully deleted ${file.filename}`);
        res.redirect('/dashboard')
     
    } catch(err) {
        return res.render('/dashboard');
    }
});


module.exports = router;
