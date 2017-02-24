// express server module
var express = require('express');
var app = express();

// http request module
var rolli_server = require('http').Server(app);

var BodyParser = require('body-parser');

// initilizing socket.io
var io = require('socket.io')(rolli_server);

// file system module in core node modules
var fs = require('fs');


// used to able to send json objects to thre beakend and send json objects to the frontend
app.use(BodyParser.urlencoded({ extended: true }));
app.use(BodyParser.json());

// port the chat app is running on
var port = process.env.PORT || 3000;


app.use(express.static(__dirname));


// decalring varibles
const users = {};
var groups = JSON.parse( fs.readFileSync('groups.json') );


app.get('/', function( req, resp ) {

  resp.sendFile( `${ __dirname  }/index.html` );
});

app.post('/group', ( req, resp ) => {

  groups[req.body.name] = req.body;

  console.log( groups );

  fs.writeFile('groups.json', JSON.stringify( groups, null, 4 ) );
  resp.json({ msg: `'${ req.body.name }' was creted.`, status: true });
});

io.on('connection', function( socket ) {

      socket.on('join', function( msg ) {

            users[ msg.user_name ] = socket.id;

            var user_groups = {};
            for ( var i  in msg.groups ) {

                if ( msg.user_name in groups[msg.groups[i]].members ) {

                    user_groups[ msg.groups[i] ] = groups[ msg.groups[i] ];
                }
            }

            io.emit('join', user_groups);

            console.log(`${ msg.user_name } has joined the chat room.`);
      });


     socket.on('global', function( msg ) {

           for ( var g in groups ) {

                if ( msg.session.group === groups[g].name && msg.session.k === groups[g].k && msg.user_name in groups[g].members ) {

                    io.emit(groups[g].name, { type: msg.type, msg: msg.msg, time: msg.time, user_name: msg.user_name });
                }
            }

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
