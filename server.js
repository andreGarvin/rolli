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


// required 'lib' modules:
var bot = require('./lib/bot.js');           // the rolli-bot code
var routes = require('./lib/routes.js');     // routes for the server
var channel = require('./lib/channels.js');  // socket channels for the socket.io


// port the chat app is running on
var port = process.env.PORT || 3000;


// getting acess to the files in the current working directory
app.use(express.static(`${__dirname}/app`));


// rolli url paths:
app.get('/', routes.index);
// app.post('/group', routes.Creategroups);
// app.get('/feedback', routes.GET_feedback);
// app.post('/feedback', routes.POST_feedback);


// soket.io channels/sessions:
io.on('connection', function( socket ) {
    
    const db = require('./lib/db.js');
    
    // decalring varibles useed in the nodejs webserver/sockets
    const users = {};

    // the 'join' channel/session
    socket.on('join', function( msg ) {
    
        /*
            once  user joins the channel save the user to the
            'users'  object keeping track of the user on the chat rooms
            or ative, but to see who logs off. displaying aand removing
            people from certain list like 'active_users' array
        */
        
        users[ msg.user_name ] = socket.id;
        
        db.get_groups( msg , function(err, resp) {
            if (err) {
                socket.emit( resp );
                return;
            }
            
            socket.emit('join', resp );
        });
    });


    // socket.on('disconnect', );
    // socket.on('global', channel.route_channels);

});


// running th chat app
rolli_server.listen( port, function() {

    console.log(`listening on *: ${ port }`);
});
