// required node modules
const level = require('level');

// required 'lib' modules
const es6 = require('./includes.js');


const db = level('./rolli_db', { valueEncoding: 'json' });


exports.create_group_db = function( group_db_obj, callback ) {
    
    db.get('db_obj', (err, db_obj) => {
        if (err) {
            
            return callback({
                type: 'db',
                msg: err.message
            }, undefined);
        }
        
        const db_groups = Object.keys( db_obj.db_groups );
        
        if ( es6.includes( db_groups, group_db_obj.group_name ) === false ) {
            
            const new_db_obj = db_obj.db_groups;
            new_db_obj[group_db_obj.group_name] = group_db_obj;
            
            db.put('db_obj', db_obj, (err) => {
                if (err) {
                    
                    return callback({
                        type: 'db',
                        msg: `error: error occured while trying to create <db: ${ group_db_obj.group_name }>; ${ err.message }`
                    }, undefined);
                }
                
                return callback(null, {
                    type: 'create-group',
                    resp: group_db_obj
                });
                
            });
            
        }
        else {
            
            return callback({
                type: 'ui',
                msg: `Group '${ group_db_obj.group_name }' already exists/created.`
            }, undefined);
        }
        
    });
    
};


exports.get_groups_db = function( req_groups, callback ) {
    
    db.get('db_obj', function(err, db_obj) {
        if (err) {
            
            return callback({
                type: 'db',
                msg: err.message
            }, undefined);
        }
        
        const db_groups = db_obj.db_groups;
        
        var groups = {};
        for ( var i in db_groups ) {
            
            if ( req_groups.length === 0 ) {
                
                if ( i === 'global' || i === 'rolli_bot' ) {
                
                    if ( i === 'rolli_bot' ) {
                        db_groups[i].msgs = [];
                    }
                
                    groups[i] = db_groups[i];
                }
            }
            else if ( es6.includes( req_groups, i ) ) {
                groups[i] = db_groups[i];
            }
            
        }
        
        return callback(null, {
            type: 'get-groups',
            groups: groups
        });
        
    });
    
};

exports.search_db = function( query_obj, callback ) {
    
    db.get('db_obj', (err, db_obj) => {
        if (err) {
            
            return callback({
                type: 'db',
                msg: `error: ${ err.message }`
            }, undefined);
        }

        if ( query_obj.db_name === 'uni' ) {
            console.log( db_obj.db_groups );
        }
        else if ( query_obj.action === 'user' ) {
            
            
            try {
                
                return callback(null, {
                    type: 'user-search',
                    data: db_obj[ query_obj.db_name ].members
                });
            }
            catch (err) {
                return callback(null, {
                    type: 'user-search',
                    data:  `Group '${ query_obj.db_name }' has no memebrs`
                });
            }
            
        }
        else if ( query_obj.action === 'group' ) {
            
            const db_groups = Object.keys( db_obj.db_groups ).filter((group) => {
                return group.slice(0, query_obj.db_name.length) === query_obj.db_name;
            });
   
            if ( db_groups.length ) {
                
                return callback(null, {
                    type: 'search-groups',
                    data: db_groups
                });
            }
    
            return callback({
                type: 'search-groups',
                msg: `No results for '${ query_obj.db_name }'.`
            }, undefined);
            
        }
        
        return callback({
            type: 'search',
            msg: `search for '${ query_obj.action ? query_obj.action : 'null query _action_' }' resulted to null; query search in '${ query_obj.db_name ? query_obj.db_name: 'null db_name' }' was not successful.`
        }, undefined);
        
    });
    
};

/*


    
    // function isMember( group_members, user_name ) {
    
    //     for ( var i in group_members ) {
     
    //         if ( group_members[i] === i ) {
              
    //             return true;
    //         }
    //     }
        
    //     return false;
    // }

// side note add the security functionaliry for the session name & key for groups
                // if ( isMember( db_groups[i].members, user_name ) ) {
                //     groups[i] = db_groups[i];
                // }

// user gloabl search
            // if ( query_obj.db_name === '' ) {
                
            //     return callback(null, {
            //         type: 'global-search',
            //         data: Object.keys( db_obj.db_groups ).map( (group) => {
                        
            //             if ( db_obj.db_groups[group].members !== undefined ) {
            //                 return db_obj.db_groups[group];
            //             }
                        
            //         })
            //     });
                
            // }

exports.save_message = function( payload, callback ) {
    
    db.get('db_obj', (err, db_obj) => {
        if (err) {
            return callback({
                type: 'db',
                msg: err.message
            }, undefined);
        }
        
        if ( es6.includes( Object.keys( db_obj.db_groups ), payload.db_name ) ) {
            
            db_obj.db_groups[payload.db_name].msgs.push({ msg: payload.msg });
            
            db.put('db_obj', db_obj, function(err) {
                if (err) {
                    return callback({
                        type: 'send-message',
                        msg: err.message
                    }, undefined);
                }
                
                return callback(null, {
                   type: 'send-message',
                   resp: payload.msg
                });
                
            });
        }
        
        return callback({
            type: 'send-message',
            msg: `failure to save message to unkown group '${ payload.db_name }'.`
        }, undefined);
        
    });
    
};


exports.activeUser = function( action, user_name, socket_id ) {};

exports.addUserToGroup = function( db_name, user_name ) {};
exports.deleteUserFromGroup = function( db_name, user_name ) {};
*/
