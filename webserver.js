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

var users = [
  {
    username: 'andreGravin',
    groups: ['groupOne'],
    admin: false
  },
  {
    username: 'jhon doe',
    groups: ['groupTwo', 'meme'],
    admin: ['groupTwo', 'meme']
  }
];
const groups = {};

app.get('/:username', function( req, resp ) {

  resp.sendFile( `${ __dirname  }/index.html` );
});

app.post('/group', ( req, resp ) => {

  groups[req.body.name] = req.body;

  resp.json({ resp: `'${ req.body.name }' was creted.`, status: true });
});

io.on('connection', function( socket ) {

  console.log('user ', socket.id, ' has joined');


  socket.emit('join', { user_id: socket.id, user_name: 'andreGarvin', msg: 'New user joined.' });

  socket.on('join', function( msg ) {

    console.log( msg );
  });

   socket.on('global', function( msg ) {
     
      io.emit('global', msg);
   });

  socket.on('disconnect', function( scoket ) {

    console.log(socket.id, ' left.');
  });

});


// running th chat app
rolli_server.listen( port, function(){

  console.log('listening on *:'+ port);
});
