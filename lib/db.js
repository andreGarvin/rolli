// required node modules
const level = require('level'),
    sublevel = require('level-sublevel');

// required 'lib' modules
const es6 = require('./includes.js');


const db = sublevel( level('./rolli_db', { valueEncoding: 'json' }) );


exports.create_group_db = function( db_name, db_obj, callback ) {
    
    db.get('db_obj', function(err, obj) {
        if (err) {
            return callback(false, "error: Coul not retrieve 'db_obj' from <db_main: rolli_db>.");
        }
        
        
        if ( es6.includes( obj.groups, db_name ) !== true ) {
            
            var new_group_db = db.sublevel( db_name );
            
            new_group_db.put(db_name, db_obj, function(err) {
                if (err) {
                    return callback(false, `error: issue/problem creating group/channel '${ db_name }'.`);
                }
                
                obj.groups.push( db_name );
                db.put('db_obj', obj, function(err) {
                    if (err) {
                        return callback(false, 'error: saving to <db_main: db_obj>.');
                    }
                    
                    return callback(null, { 
                        msg: `<db: ${ db_name }> saved.`,
                        db_obj: db_obj
                    });
                });
            
            });
            
        }
        
        return callback(false, `error: db '${ db_name }' already exists.`);
    });
    
};

exports.get_groups = function( group_obj, callback ) {
    
    for ( var i in group_obj ) {
        console.log( group_obj[i].group );
    }
    return callback(null, { msg: 'hello, wolrd', status: true });

    // var target_db = db.sublevel( obj.db_name ),
    //     group_db = target_db.createReadStream()
    
    // group_db.on('data', function(data) {
        
    //     data = data.value;
        
    //     console.log(data);
    // });
    // userOauth db_name
};

// // finds the chat rooms the user is in and is OAuthenticated to be in the chat rooms
        // var user_groups = {};
    
        // for ( var i in  ) {
        //     var members = groups[i]['members'];
        //     console.log( groups[i]['members'] );
        //     // cheks to see if the user is in the memebers board/array
        //     if ( members.includes( msg.user_name ) && i !== "feedback" ) {
    
        //         // if the user belongs in the chat room inset in into the 'user_groups' object
        //         user_groups[ i ] = groups[ i ];
        //     }
        // }

        // console.log( Object.keys( user_groups ) );
    
        // // if the user is not in any group send them the defualt group chat
        // if ( Object.keys( user_groups ).length === 0 ) {

        //     user_groups = {
        //         gloabl: groups.global,
        //         'rolli-bot': groups['rolli-bot']
        //     }
        
        // }

        // // send/'emits' the data back to the user to the 'groups' data object on the client side
        // io.emit('join', { 
        //     groups: user_groups, 
        //     user_name: 
        //     msg.user_name 
        // });

        // // logs to the console the new user that has joined the chat room/website rolli
        // console.log(`${ msg.user_name } has joined the chat room.`);