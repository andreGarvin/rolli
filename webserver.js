// file system module in core node modules
var fs = require('fs');

// express server module
var express = require('express');
var app = express();

// http request module
var rolli_server = require('http').Server(app);

// body-parser for recevieing and sending JSON data
var BodyParser = require('body-parser');

// used to able to send and recevie JSON objects to the beakend and frontend
app.use(BodyParser.urlencoded({ extended: true }));
app.use(BodyParser.json());


// initilizing socket.io
var io = require('socket.io')(rolli_server);


// my modules:
var bot = require('./bot.js'); // the rolli-bot code
var routes = require('./routes.js'); // routes for the server
var channel = require('./channels.js');


// port the chat app is running on
var port = process.env.PORT || 3000;

// getting acess to the files in the current working directory
app.use(express.static(`${__dirname}/app`));


// decalring varibles useed in the nodejs webserver/sockets
const users = {};

// getting the groups.json file to load
var groups = JSON.parse( fs.readFileSync('groups.json') );


// made a similar includes() function cause the server keeps yelling 
// at me syaing its not a function because its a es7 || es6 function
function includes( array, item ) {
     
    for ( var i in array ) {
         
        if ( array[i] === item ) {
              
            return true;
        }
    }
    
    return false; 
}

// console.log( bot.data.send_gif() );

// rolli url paths:
app.get('/', routes.index);
app.get('/feedback', routes.GET_feedback);
app.post('/feedback', routes.POST_feedback);
app.post('/group', routes.Creategroups);


// soket.io channels/sessions:
io.on('connection', function( socket ) {

      socket.on('join', channel.join);
      socket.on('global', channel.global_channel);
      socket.on('disconnect', channel.disconnect);

});


// running th chat app
rolli_server.listen( port, function() {

    console.log(`listening on *: ${ port }`);
});
