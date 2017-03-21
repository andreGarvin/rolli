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

<<<<<<< HEAD
=======

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

>>>>>>> 3e1cbfada77519c03ab5e74f9cf7ec333c19aa1d
// rolli url paths:
app.get('/', routes.index);
app.get('/feedback', routes.GET_feedback);
app.post('/feedback', routes.POST_feedback);
app.post('/group', routes.Creategroups);


// soket.io channels/sessions:
io.on('connection', function( socket ) {

<<<<<<< HEAD
      socket.on('join', channel.join);
      socket.on('global', channel.global_channel);
      socket.on('disconnect', channel.disconnect);
=======
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
                var members = groups[i]['members'];
                // cheks to see if the user is in the memebers board/array

                if ( includes(members, msg.user_name ) && i !== "feedback" ) {
                    // if the user belongs in the chat room inset in into the 'user_groups' object
                    
                    user_groups[ i ] = groups[ i ];
                    
                }
            }

            // if the user is not in any group send them the defualt group chat
            if ( Object.keys( user_groups ).length === 0 ) {

                user_groups = {
                   gloabl: groups.global
                }
                
                groups.global.members.push( msg.user_name );
                // groups['rolli-bot'].members.push( msg.user_name );
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
                        if ( msg.session.group === g && msg.session.k === groups[g].k && includes(groups[g].members, msg.user_name ) && g !== "feedback" ) {

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
>>>>>>> 3e1cbfada77519c03ab5e74f9cf7ec333c19aa1d

});


// running th chat app
rolli_server.listen( port, function() {

    console.log(`listening on *: ${ port }`);
});
