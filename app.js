const level = require('level'),
    sublevel = require('level-sublevel');

var es6 = require('./lib/includes.js');

const db = sublevel( level('./rolli_db', { valueEncoding: 'json' }) );

function isMember( array, item ) {
     
    for ( var i in array ) {
         
        if ( array[i] === item ) {
              
            return true;
        }
    }
    
    return false; 
}

function get_groups( group_obj, user_name ) {
    
    var groups = [];
    
    for ( var i in group_obj ) {
        if ( isMember( group_obj[i].members, user_name ) ) {
            console.log( user_name);
        }
        else {
            groups.push( group_obj );
        }
    }
    
    console.log( groups );
}

db.get('db_obj', function(err, db_obj ) {
    get_groups( db_obj.db_groups.default_groups, 'andreGarvin' );
})


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
        
    //     var target_db = db.sublevel( i ),
    //         group_db = target_db.createReadStream()
        
    //     group_db.on('data', function( data ) {
    //         console.log( data );
    //     })
        
    // }
    
// })

// // db.get('db_obj', function(err, obj) {
// //     console.log( obj.db_groups );
// // });