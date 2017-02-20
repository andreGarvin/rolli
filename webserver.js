// express server module
var express = require('express');
var app = express();

// http request module
var rolli_server = require('http').Server(app);

var BodyParser = require('body-parser');

// initilizing socket.io
var io = require('socket.io')(rolli_server);

// used to able to send json objects to thre beakend and send json objects to the frontend
app.use(BodyParser.urlencoded({ extended: true }));
app.use(BodyParser.json());

// port the chat app is running on
var port = process.env.PORT || 3000;



app.use(express.static(__dirname));

const users = {};

app.get('/', function( req, resp ) {

  resp.sendFile( `${ __dirname  }/index.html` );
});

app.post('/group', ( req, resp ) => {

  groups[req.body.name] = req.body;

  resp.json({ resp: `'${ req.body.name }' was creted.`, status: true });
});

io.on('connection', function( socket ) {

      socket.on('join', function( msg ) {

            users[ msg.user_name ] = socket.id;
            io.emit( msg );

            console.log(`${ msg.user_name } has joined the chat room.`);
      });


     socket.on('global', function( msg ) {

          io.emit('global', msg);
     });



     socket.on('disconnect', function( scoket ) {

            for ( var j in users ) {
                if ( users[j] === socket.id ) {

                    delete( j );
                    console.log(`${ j } has left the chat room.`);
                }
           }
     });

});


// running th chat app
rolli_server.listen( port, function(){

  console.log(`listening on *: ${ port }`);
});
