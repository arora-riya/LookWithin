// Import Part
const express = require('express');
const http = require('http');
const app = express();
require('dotenv').config();
const { auth, requiresAuth } = require('express-openid-connect');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
var mongoose = require('mongoose');

// For MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/lookwithin');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error :'));
db.once('open', function(){
    console.log("Database lookwithin connected");
});


// Database Schemas
const psychiatrist_schema = new mongoose.Schema({
  pid : String,
  pname : String
});
const psychiatrist = mongoose.model('psychiatrist', psychiatrist_schema);

const consultation_schema = new mongoose.Schema({
  pname : String,
  cdate : Date,
  ctime : String,
  cfield : String
})
const consultation = mongoose.model('consultation', consultation_schema);

// Authorization Part
app.use(
  auth({
    authRequired : false,
    // auth0Logout : true,
    issuerBaseURL:process.env.ISSUER_BASE_URL ,
    baseURL:process.env.BASE_URL,
    clientID: process.env.CLIENT_ID,
    secret: process.env.SECRET,
    idpLogout: true,
  })
);

// Setting views
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

// Middleware for Form Posting
app.use(express.urlencoded({extended:true}));

// Specifying End-Points
app.get('/', (req,res)=>{
    // res.render(req.oidc.isAuthenticated() ? 'index' : 'index2');
    if (req.oidc.isAuthenticated()){
      res.render('index', {logprompt : "LogOut", logaction : "/logout"})
    }
    else{
      res.render('index', {logprompt : "LogIn", logaction : "/login"})
    }
})

app.get('/resources', (req,res)=>{
  // res.render(req.oidc.isAuthenticated() ? 'index' : 'index2');
  if (req.oidc.isAuthenticated()){
    res.render('resources', {logprompt : "LogOut", logaction : "/logout"})
  }
  else{
    res.render('resources', {logprompt : "LogIn", logaction : "/login"})
  }
})

app.get('/tools', (req,res)=>{
  // res.render(req.oidc.isAuthenticated() ? 'index' : 'index2');
  if (req.oidc.isAuthenticated()){
    res.render('tools', {logprompt : "LogOut", logaction : "/logout"})
  }
  else{
    res.render('tools', {logprompt : "LogIn", logaction : "/login"})
  }
})

app.get('/community', (req,res)=>{
  // res.render(req.oidc.isAuthenticated() ? 'index' : 'index2');
  if (req.oidc.isAuthenticated()){
    res.render('community', {logprompt : "LogOut", logaction : "/logout"})
  }
  else{
    res.render('community', {logprompt : "LogIn", logaction : "/login"})
  }
})

app.get('/discussions', (req,res)=>{
  // res.render(req.oidc.isAuthenticated() ? 'index' : 'index2');
  res.render('discussions');
})

app.get('/consultations', (req,res)=>{
  // res.render(req.oidc.isAuthenticated() ? 'index' : 'index2');
  if (req.oidc.isAuthenticated()){
    res.render('consultations');
  }
  else{
    res.redirect('/login');
  }
})

app.get('/psychlog', async (req,res)=>{
  const dbdata = await psychiatrist.find({});
  var pids = new Array();
  dbdata.forEach(function f(element){
    pids.push(element["pid"]);
  })
  if (req.oidc.isAuthenticated()){
    res.render('psychlog', {psychdata : JSON.stringify(pids)});
  }
  else{
    res.redirect('/login');
  }
})

app.post('/psychlog', (req, res) =>{
  var newConsultation = new consultation(req.body);
  newConsultation.save().then(() => {
    res.redirect('/psychlog');
  }).catch(() => {
    res.status(400).send("Item not saved");
  })
  // console.log(req.body);
});

app.get('/consult', async (req,res)=>{
  const consultdata = await consultation.find({});
  if (req.oidc.isAuthenticated()){
    res.render('consult', {consultdata : JSON.stringify(consultdata)});
  }
  else{
    res.redirect('/login');
  }
})


// Socket Connection
const users = {};

io.on('connection', socket =>{
    // If any new user joins, let other users connected to the server know!
    socket.on('new-user-joined', name =>{ 
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });

    // If someone sends a message, broadcast it to other people
    socket.on('send', message =>{
        socket.broadcast.emit('receive', {message: message, name: users[socket.id]})
    });

    // If someone leaves the chat, let others know 
    socket.on('disconnect', message =>{
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    });


})

const port = process.env.port || 3000;
server.listen(port, () => {
    console.log(`listening on port ${port}`);
});