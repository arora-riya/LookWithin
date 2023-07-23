var mongoose = require('mongoose');

// Connect to Database (This should create the database if it doesn't exist)
mongoose.connect('mongodb://127.0.0.1:27017/lookwithin');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error :'));
db.once('open', function(){
    console.log("Database lookwithin connected");
});

// Pre-Existing Psychiatrist Records
const psychiatrist_schema = new mongoose.Schema({
    pid : String,
    pname : String
  });
const psychiatrist = mongoose.model('psychiatrist', psychiatrist_schema);

const ps1 = new psychiatrist({pid : 'LW22001', pname : 'Paras Bedi'});
const ps2 = new psychiatrist({pid : 'LW22002', pname : 'Riya Arora'});
const ps3 = new psychiatrist({pid : 'LW23001', pname : 'Sara Gupta'});

ps1.save();
ps2.save();
ps3.save();

