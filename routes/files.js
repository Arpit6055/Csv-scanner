const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const CSVToJSON = require('csvtojson');
const File = require('../models/file');
const Csv = require('../models/csv')
const { v4: uuidv4 } = require('uuid');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
let storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/') ,
    filename: (req, file, cb) => {
        const uniqueName = `${path.parse(file.originalname).name}${Date.now()*Math.random()}${path.extname(file.originalname)}`;
              cb(null, uniqueName)
    } ,
});

let upload = multer({ storage, limits:{ fileSize: 1000000 * 100 }, }).single('myfile'); //100mb

router.post('/',ensureAuthenticated, (req, res) => {
  upload(req, res, async (err) => {
    try {
            var fileExt = await req.file.filename.split('.').reverse()[0];
            // console.log(fileExt);
            if(!req.file ){
              return res.json({error: 'All fields are required'});
            }
            else if (fileExt !="csv"){
              fs.unlinkSync(req.file.path);
              return res.json({ file: `Please upload a ".csv" file` });
            }
            if(fileExt=='csv'){
              CSVToJSON().fromFile(req.file.path).then(async(JSONdata) => {
                const csv = new Csv({
                  filename : req.file.filename,
                  data : JSONdata
                });
                //saving csv file data into JSON format
                const csvResponse = await csv.save();
                console.log(csvResponse);
              }).catch(err => {
                  console.log(err);
              });
     
              const file = new File({
                userOwnerId: req.user._id,
                userOwnerName: req.user.name,
                filename: req.file.filename,
                path: req.file.path,
                size: req.file.size,
                uuid: uuidv4(),
            });
            const response = await file.save();
            res.json({ file: `${process.env.APP_BASE_URL}/files/${response.uuid}` });
          }
      } catch (error) {
        console.log(error);
        res.send(error)
      }
      });
});

module.exports = router;