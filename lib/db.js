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
        
        
        if ( es6.includes( obj.db_groups, db_name ) !== true ) {
            
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


function isMember( group_members, user_name ) {
    
    for ( var i in array ) {
         
        if ( array[i] === item ) {
              
            return true;
        }
    }
    
    return false;
}

fucntion get_groups() {
    var groups = {};
    
    for ( var i in group_obj ) {
        if ( isMember( group_obj[i].members, user_name ) ) {
            console.log( user_name);
        }
        else {
            groups group_obj );
        }
    }
    
    console.log( groups );
}


exports.get_groups_db = function( obj, callback ) {
    
    db.get('db_obj', function(err, db_obj ) {
        get_group(db_obj.db_groups.default_groups, 'andreGarvin');
    });
};

// db.get('db_obj', function(err, db_obj) {
//         if (err) {
//             return callback(false, {
//                 status: {
//                     bool: undefined,
//                     txt: '',
//                     code: 500
//                 },
//                 msg: 'error: Could not retrieve groups from db; exit.'
//             });
//         }
        
//         /*
//             itrate over the groups in the groups_obj.groups
//             use includes to see if the user is in the group,
//             after that if so add them to the grops then return 
//             callback()
        
//         */
        
//         for ( var g in db_obj ) {
            
//             var db_name = db_obj[g];
            
//             var target_db = db.sublevel( db_name ),
//                 group_db = target_db.createReadStream()

//             group_db.on('data', function( group_obj ) {
//                 console.log( group_obj );
//             });
//         }
//     });

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
    // if ( group_member_obj.groups.length === 0 ) {
        
    //     var default_groups = ['global', 'rolli-bot'];
    //     for ( var i in default_groups ) {
            
    //         var db_name = default_groups[i];
            
            // var target_db = db.sublevel( db_name ),
            //     group_db = target_db.createReadStream()
        
            
            // group_db.on('data', function( db_obj ) {
                
    //             groups[ db_obj.key ] = db_obj.value;
                
                // return callback(null, {
                //     status: {
                //         bool: true,
                //         txt: 'OK',
                //         code: 200
                //     },
                //     groups: groups
                // });
    //         });
            
    //     }
        
    // }
    // else {
    //     for ( var i in group_obj ) {
    //         console.log( group_obj[i].group );
    //     }
    //     return callback(null, { msg: 'hello, wolrd', status: true });
    // }
    
    // userOauth db_name