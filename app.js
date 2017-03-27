const level = require('level'),
    sublevel = require('level-sublevel');

var es6 = require('./lib/includes.js');

const db = level('./rolli_db', { valueEncoding: 'json' });


// use this
// db.get('db_obj', function(err, data) {
//     var groups = [];
//     db.get('test', function(err, data) {
//         groups.push( data )
//         console.log(groups);
//     })
// })

// function create_group_db( db_name ) {
//     let group_db = sublevel( level(`./db/${ db_name }`, { valueEncoding: 'json' }) );
    
//     let group_db_obj = {
        
//     };
    
//     group_db.put('')
// }
// var target_db = db.sublevel('rolli-bot'),
//     group_db = target_db.createReadStream()
            
// group_db.on('data', function(group_obj) {
    
    
//     console.log( group_obj );
// });

var db_obj = {
    active_users: 0,
    db_groups: {
        global: {
            group_name: 'global',
            group_db_obj: {
                k: null,
                admins: [ '@rolli' ]
            },
            msgs: [],
            members: [],
            attachements: [],
            requests: []
        },
        rolli_bot: {
            group_name: 'rolli_bot',
            gropup_db_obj: {
                k: null,
                admin: '@rolli-bot'
            },
            msgs: [],
            members: [],
            attachements: [],
            requests: []
        }
    },
    admin_obj: {
        admins: [
            'andreGarvin'
        ],
        pas: 'MAC_DEMARCO'
    },
    feedback: []
}

db.put('db_obj', db_obj, function(err) {
    if (err) {
        console.log( err.message );
        return;
    }
    
    
    db.get('db_obj', function(err, obj) {
        console.log(obj);
    })
})

// db.get('db_obj', function(err, obj) {
//     if (err) {
//         console.log(`error: ${ err.message }`);
//         return;
//     }
    
//     console.log( obj );
// })

// function isMember( array, item ) {
     
//     for ( var i in array ) {
         
//         if ( array[i] === item ) {
              
//             return true;
//         }
//     }
    
//     return false; 
// }

// function get_groups( groups, group_members, user_name ) {
    
    
//     console.log(groups);
//     console.log( group_members);
//     console.log( user_name );
//     // for ( var i in group_obj ) {
//     //     var group_members =
//     //     if ( !isMember( group_obj[i].members, user_name ) ) {
            
            // var target_db = db.sublevel( i ),
            //     group_db = target_db.createReadStream()
            
            // group_db.on('data', function(group_obj) {
                
            //     groups[group_obj.key] = group_obj;
            //     console.log( groups );
            // });
//     //     }
//     // }

// }

// db.get('db_obj', function(err, db_obj ) {
//     get_groups( Object.keys( db_obj.db_groups.default_groups ), db_obj.db_groups.default_groups, 'andreGarvin' );
// })


// var obj = {
//     group_name: 'rolli-bot',
//     gropup_db_obj: {
//         k: null,
//         admin: '@rolli-bot'
//     },
//     msgs: [],
//     attachements: [],
//     requests: []
// }


// target_db.put('rolli-bot', obj, function() {
//     console.log('created global');
// })

// db.get('db_obj', function(err, db_obj) {
    
    
    
    // for ( var i in db_obj.db_groups.default_groups ) {
        
        // var target_db = db.sublevel( i ),
        //     group_db = target_db.createReadStream()
        
    //     group_db.on('data', function( data ) {
    //         console.log( data );
    //     })
        
    // }
    
// })

// // db.get('db_obj', function(err, obj) {
// //     console.log( obj.db_groups );
// // });