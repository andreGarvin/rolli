const db = require('./db.js');

// db.save_message({ db_name: 'global', msg: 'Hello, world'}, (err, resp_payload) => {
//     if (err) {
//         console.log(err);
//         return;
//     }
//     socket.emit('', resp_payload);
// });

exports.connection = function( socket ) {
    
    // varible used to store all users that connect with server/websocket
    const users_obj = {};

    // the 'join' channel/session
    socket.on('join', ( user_name ) => {
        
        console.log(`rolli-server: over ${ Object.keys( users_obj ) } active users`)
        
        /*
            once  user joins the channel save the user to the
            'users'  object keeping track of the user on the chat rooms
            or ative, but to see who logs off. displaying aand removing
            people from certain list like 'active_users' array
        */
        users_obj[ user_name ] = socket.id;
        
        console.log(`rolli-server: new user '${ user_name }' has joined rolli.`);
        
        
        db.get_groups_db(user_name, (err, data) => {
            if (err) {
                socket.emit('join', err);
                return;
            }
            
            socket.emit('join', data);
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
                console.log(`rolli-server: '${ u }' has left rolli.`);
            }
            
        }
        
        console.log(`rolli-server: over ${ Object.keys( users_obj ) } active users.`)
        
    });
    
    socket.on('global', ( msg ) => {
    
        switch( msg.session.group ) {
        
            case 'global':
                console.log('sending message to global channel/session');
                return;
                
            case 'rolli_bot':
                console.log('sending message to rolli bot channel/session.');
                return;
            
            default:
                if ( msg.type === 'whisper' ) {
                    console.log(`sending whisper to ${ msg.recp }`);
                    return;
                }
                
                console.log(`sending message to ${ msg.session.group } channel/session.`);
                return;
        }
        
    });
    
};
