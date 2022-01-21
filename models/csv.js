const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const csvSchema = new Schema({
    filename: { type: String, required: true },
    data : {type:JSON, required:true}
}, { timestamps: true });

module.exports = mongoose.model('Csv', csvSchema);