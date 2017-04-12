const db = require('./db.js'),
    bot = require('./bot.js');  // the rolli-bot module

exports.connection = function( io ) {
    
    io.on('connection', ( socket ) => {
    
        // varible used to store all users that connect with server/websocket
        const users_obj = {};
    
        // the 'join' channel/session
        socket.on('join', ( user_name ) => {
            
            /*
                once  user joins the channel save the user to the
                'users'  object keeping track of the user on the chat rooms
                or ative, but to see who logs off. displaying aand removing
                people from certain list like 'active_users' array
            */
            users_obj[ user_name ] = socket.id;
            
            
            console.log(`*rolli-server: new user '${ user_name }' has joined rolli.`);
            console.log(`\n*rolli-server: ${ Object.keys( users_obj ).length } active.`)
            
            db.get_groups_db([], (err, data) => {
                if (err) {
                    io.emit('join', err);
                    return;
                }
                
                io.emit('join', data);
            });
            
        });
        
        
        //  if a user disconnects from the rolli web apllication
        socket.on('disconnect', () => {
            
            
            // find the user in the 'users' objects
            for ( var u in users_obj ) {
                
                // check if the id matches in the 'user_obj'
                if( users_obj[ u ] === socket.id ) {
                    
                    /*
                        if so exists remove for the 
                        "user" from the 'user_obj' and
                        send alert/'emit' to all the chat rooms
                        that the user has left no longer 
                        'groups[<group name>].active_users'
                    */
                    
                    delete( u );
                    console.log(`*rolli-server: ${ Object.keys( users_obj ).length } active.`)
                    console.log(`*rolli-server: '${ u }' has left rolli.`);
                }
                
            }
            
        });
        
        socket.on('global', ( msg ) => {
            
            const session = msg.session.group;
            
            
            switch( session ) {
                
                case 'global':
                    db.save_message(msg, (err, resp_payload) => {
                        if (err) {
                            console.log(err);
                            return;
                        }
                        
                        io.emit('global', resp_payload.resp);
                    });
                    break;
                default:
                    
                    db.save_message(msg, (err, resp_payload) => {
                        if (err) {
                            console.log(err);
                            return;
                        }
                        
                        io.emit('global', resp_payload.resp);
                    });
                    
                    break;
                /*
                    // default:
                        
                    //     console.log( session );
                    //     console.log( msg.msg );
                        // if ( session === 'animal' ) {
                        //     console.log();
                        //     // console.log( msg );
                        //     // io.emit(session, msg);
                        //     return;
                        // }
                        // if ( msg.type === 'whisper' ) {
                        //     console.log(`sending whisper to ${ msg.recp }`);
                        //     return;
                        // }
                        // db.save_message({ db_name: 'global', msg: 'Hello, world'}, (err, resp_payload) => {
                        //     if (err) {
                        //         console.log(err);
                        //         return;
                        //     }
                            
                        //     socket.emit('', resp_payload);
                        // });
                        // return;
                */
        }
            
            
        });
    
    });
};


/*
// THERE IS A BUG HERE & default !!!!!
case 'rolli_bot':
// const bot_resp = bot.anaylze( msg );

// db.save_message({ db_name: 'global', msg: 'Hello, world'}, (err, resp_payload) => {
//     if (err) {
//         console.log(err);
//         return;
//     }
    
//     socket.emit('', resp_payload);
// });
console.log( session );
console.log( msg );
// io.emit(session, {
//     type: 'text',
//     msg: 'hey',
//     time: '3/7/2017 10:04:13 AM',
//     user_name: 'dre',
//     session: {
//         group: 'global',
//         key: null
//     }
// });
return;
*/