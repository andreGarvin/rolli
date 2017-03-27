// required node modules
const level = require('level');

// required 'lib' modules
const es6 = require('./includes.js');


const db = level('./rolli_db', { valueEncoding: 'json' });


exports.create_group_db = function( db_name, group_db_obj, callback ) {
    
    db.get('db_obj', (err, db_obj) => {
        if (err) {
            console.log(err.message);
            return callback({
                type: 'db',
                msg: err.message
            }, undefined);
        }
        
        const db_groups = Object.keys( db_obj.db_groups );
        
        if ( es6.includes( db_groups, db_name ) !== true ) {
            
            const new_db_obj = db_obj.db_groups;
            
            new_db_obj[db_name] = group_db_obj;
            
            db.put('db_obj', db_obj, (err) => {
                if (err) {
                    return callback({
                        type: 'db',
                        msg: `error: occured while trying to save <db: ${ db_name }>; ${ err.message }`
                    }, undefined);
                }
                
                return callback(null, {
                    type: 'create-group',
                    resp: group_db_obj
                });
                
            });
            
        }
        
        return callback({
            type: 'ui',
            msg: `Group ${ db_name } already exists/created.`
        }, undefined);
        
    });
    
};


exports.get_groups_db = function( obj, callback ) {
    
    function isMember( group_members, user_name ) {
    
        for ( var i in group_members ) {
     
            if ( group_members[i] === i ) {
              
                return true;
            }
        }
        
        return false;
    }


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
            if ( i === 'global' || i === 'rolli_bot') {
                groups[i] = db_groups[i];
            }
            else {
                // side note add the security functionaliry for the session name & key for groups
                if ( isMember( db_groups[i].members, 'andreGarvin' ) ) {
                    console.log( db_groups[i].members );
                }
            }
        }
        
        return callback(null, {
            type: 'get-groups',
            resp: groups
        });
        
    });
    
};

exports.searchGroups = function( db_name, callback ) {
    
    db.get('db_obj', (err, db_obj) => {
        if (err) {
            return callback({ 
                type: 'db',
                msg: err.message
            }, undefined);
        }
        
        const db_groups = Object.keys( db_obj.db_groups ).filter((group) => {
            return group.slice(0, db_name.length) === db_name;
        });
        
        if ( db_groups.length ) {
            return callback(null, {
                type: 'search-groups',
                resp: db_groups
            });
        }
        
        return callback({
            type: 'search-groups',
            msg: `No results for '${ db_name }'.`
        }, undefined);
        
        
    });
    
};

// exports.
var save_message = function( payload, callback ) {
    
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


// exports.activeUser = function( action, user_name, socket_id ) {};

// exports.addUserToGroup = function( db_name, user_name ) {};
// exports.deleteUserFromGroup = function( db_name, user_name ) {};
