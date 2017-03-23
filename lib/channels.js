const db = require('./db.js');

exports.connection = function( socket ) {
    
    // decalring varibles useed in the nodejs webserver/sockets
    const users_obj = {};

    // the 'join' channel/session
    socket.on('join', function( msg ) {
        
        /*
            once  user joins the channel save the user to the
            'users'  object keeping track of the user on the chat rooms
            or ative, but to see who logs off. displaying aand removing
            people from certain list like 'active_users' array
        */
        
        users_obj[ msg ] = socket.id;
        
        console.log(`rolli-server: new user '${ msg }' has joined rolli.`);
        
        db.get_groups( { user_name: msg, groups: [] }, function(err, resp) {
            if (err) {
                socket.emit( resp );
                return;
            }
            
            socket.emit('join', resp);
        });
        
    });

    //  if a user disconnects from the rolli web apllication
    socket.on('disconnect', function() {
        
        
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
        
    });
    
    // socket.on('global', function() {});

};