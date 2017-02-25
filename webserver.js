// express server module
var express = require('express');
var app = express();

// http request module
var rolli_server = require('http').Server(app);

// body-parser for recevieing and sending JSON data
var BodyParser = require('body-parser');

// initilizing socket.io
var io = require('socket.io')(rolli_server);

// file system module in core node modules
var fs = require('fs');

// the rolli-bot code
var bot = require('./bot.js');

// used to able to send and recevie JSON objects to the beakend and frontend
app.use(BodyParser.urlencoded({ extended: true }));
app.use(BodyParser.json());


// port the chat app is running on
var port = process.env.PORT || 3000;

// getting acess to the files in the current working directory
app.use(express.static(__dirname));


// decalring varibles useed in the nodejs webserver/sockets
const users = {};

// getting the groups.json file to load
var groups = JSON.parse( fs.readFileSync('groups.json') );

// console.log( bot.data.send_gif() );

// rolli url paths:

    // sending the rolli home page
    app.get('/', function( req, resp ) {

        // sends a response of the file hosting the chat rooms
        resp.sendFile( `${ __dirname  }/index.html` );
    });

    // creating new groups
    app.post('/group', ( req, resp ) => {

        groups[req.body.name] = req.body;

        console.log( groups );

        fs.writeFile('groups.json', JSON.stringify( groups, null, 4 ) );
        resp.json({ msg: `'${ req.body.name }' was creted.`, status: true });
    });



// soket.io channels/sessions:
    io.on('connection', function( socket ) {

          // the 'join' channel/session
          socket.on('join', function( msg ) {

                /*
                   once  user joins the channel save the user to the
                   'users'  object keeping track of the user on the chat rooms
                   or ative, but to see who logs off. displaying aand removing
                   people from certain list like 'active_users' array
                */
                users[ msg.user_name ] = socket.id;

                // finds the chat rooms the user is in and is OAuthenticated to be in the chat rooms
                var user_groups = {};
                for ( var i in groups ) {

                    // cheks to see if the user is in the memebers board/array
                    if ( groups[i].members.includes( msg.user_name ) ) {

                        // if the user belongs in the chat room inset in into the 'user_groups' object
                        user_groups[ i ] = groups[ i ];
                    }
                }

                // if the user is not in any group send them the defualt group chat
                if ( Object.keys( user_groups ).length === 0 ) {

                   user_groups = {
                       gloabl: groups.global,
                       'rolli-bot': groups['rolli-bot']
                   }
                }

                // send/'emits' the data back to the user to the 'groups' data object on the client side
                io.emit('join', { groups: user_groups, user_name: msg.user_name });

                // logs to the console the new user that has joined the chat room/website rolli
                console.log(`${ msg.user_name } has joined the chat room.`);
          });

          //the global channel/session
          socket.on('global', function( msg ) {

                 if ( msg.session.group === 'global' && msg.session.key === groups.global.k ) {

                      groups.global.msgs.push( msg );

                     // send/'emit' the msg the the channel/session
                     io.emit('global', msg);

                 }
                 else if ( msg.session.group === 'rolli-bot' ) {

                          for ( var user in groups['rolli-bot'].msgs ) {

                               if ( user === msg.user_name ) {
                                   groups['rolli-bot'].msgs[user].push( msg );
                               }
                               else {

                                     groups['rolli-bot'].msgs[msg.user_name] = [];
                                     groups['rolli-bot'].msgs[msg.user_name].push( msg );
                               }
                          }

                          var bot_response = [ bot.data.send_gif(), bot.data.reply() ];
                          // send/'emit' the msg the the channel/session
                          io.emit('rolli-bot', { type: 'bot', resp: bot_response[ Math.floor(Math.random() * bot_response.length)], time: bot.data.curr_time, recv: msg.user_name });
                 }
                 else {

                       // goes over all the group chats to see which message to send the messge to'
                          // also saves/appends the msg to the atual 'groups' object
                       for ( var g in groups ) {

                            // checks if the user belongs in the group chat room and has the 'key' to the group chat room
                            if ( msg.session.group === g && msg.session.k === groups[g].k && groups[g].members.includes( msg.user_name ) ) {

                                // send/'emits' or send the message rto the actul group and appends it to the 'group[<group name>].msgs' array
                                groups[g].msgs.push( msg )
                                io.emit(g, msg);
                            }
                        }

                  }

                  fs.writeFile('groups.json', JSON.stringify( groups, null, 4 ) );
            });


            //  if a user disconnects from the rolli web apllication
            socket.on('disconnect', function( scoket ) {

                    // find the user in the 'users' objet
                    for ( var j in users ) {

                          // if the user exists remove fro the 'user' object and 'groups[<group name>].active_users' object
                              // also sends/'emits' message to deleted or alert on the front end/client side that a 'user' is no longer active
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
