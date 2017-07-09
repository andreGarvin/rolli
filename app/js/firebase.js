import * as firebase from 'firebase';
import tool from './tools';

firebase.initializeApp({
    apiKey: "AIzaSyC8kFt2_cHkLPF3YHrhB9yi_b37VJBcdfM",
    authDomain: "rolli-db.firebaseapp.com",
    databaseURL: "https://rolli-db.firebaseio.com",
    projectId: "rolli-db",
    storageBucket: "rolli-db.appspot.com",
    messagingSenderId: "1097445602183"
})

const date = new Date;

/*
    creates new data to insert to the database
    such groups or a new use to the firebase db
*/
function create( type, obj, callback ) {

    var resp;
    switch ( type ) {

        case 'user':


            firebase.database().ref('usersdb').on('value', ( u ) => {

                u = u.val();

                var users_emails = tool.map(tool.ObjectValues( u.val ), ( i ) => {

                    return i.email;
                })
                // checking the user the user_name exist and the email
                if (
                    tool.includes(users_emails, obj.email)
                    &&
                    tool.includes(tool.ObjectKeys( u ), obj.user_name )
                ) {

                    resp = callback({
                        status: false,
                        msg: 'user exist',
                    }, undefined);
                }
                else {

                    if ( tool.not_empty( obj.user_name )  ) {

                        saveTo(`usersdb/${ obj.user_name }`, )
                    }
                }

                //     resp = callback(null, {
                //         obj: obj,
                //         msg: `Created user '${ obj.user_name }'`
                //     });
                // }
                // else {

                //     resp = callback({
                //         status: false,
                //         msg: 'create a user name'
                //     }, undefined);
                // }
            });

            break;

        case 'group':

            // change to code to check if the group exist in the dbatabse first
            firebase.database().ref('groups_db').on('value', (g) => {

                g = Object.keys( g );

                if ( tool.includes(g, obj.group_name) ) {

                    obj = {
                        attachments: false,
                        db_obj: {
                            admin: obj.user_name,
                            key: obj.key
                        },
                        messages: false
                    };

                    // saving the use to the firebase database
                    saveTo(`groups_db/${ obj.group_name }`, obj, (err, data) => {
                        if (err) {

                            resp = callback(err, undefined);
                        }
                        else {

                            resp = callback(null, data);
                        }
                    })

                }
                else {

                    resp = callback({
                        status: false,
                        msg: 'Group name already exist, please another group name.'
                    });
                }
            })
            break;
    }

    return resp;
}


// saves data to the data by taking a path to the data insertion
function saveTo( db_path, input, callback ) {

    try {

        firebase.database().ref(db_path).set(input);

        return callback(null) || 0;
    }
    catch (e) {

        return callback({
            status: false,
            msg: e.message
        }) || 0;
    }
}

// gets specfic data from the firebase database
// function getFrom( path, callback ) {}

/*
    searchs throughout the entire database
    for user, groups, or messages sent
*/
function search_db( obj, callback ) {

    firebase.database().ref('groups_db').on('value', (g) => {

        var x = tool.filter(tool.ObjectKeys(g), (j) => {

            return j === obj.query;
        })


        if ( x.length !== 0 ) {

            // var y = tool.map(x, (e) => {

            //     return groups
            // });

            return callback( null, x );
        }
        else {

            return callback({
                status: false,
                msg: `there are not reusults for '${ obj.query }'`
            });
        }
    })
}

// get the user information once the user is signed in
function get_user( userObj, callback ) {

    const usersdb = firebase.database().ref('usersdb');
    usersdb.on('value', (u) => {

        /*
            goes over all the users in the usersdb array
            returns each users email.
        */
        var users_emails = tool.map(tool.ObjectValues( u.val() ), ( i ) => {

            return i.email;
        });

        // checks to see if the user email exist in the ueser_emails array
        if ( tool.includes(users_emails, userObj.email) ) {


            return callback(null, u.val()[ userObj.user_name ]);
        }

        return callback({
            status: false,
            userObj: userObj
        }, undefined);
    });
}

function get_groups( obj, callback ) {

    firebase.database().ref('groups_db').on('value', (g) => {
        g = g.val();

        var group_arr = {};
        var x = tool.filter(Object.keys( g ), (g_arr) => {

            var g_members = g[g_arr].db_obj.members;
            return (
                tool.includes( obj.groups, g_arr )
                &&
                tool.includes( tool.ObjectValues( g_members ), obj.user_name )
            );
        })


        for ( var s in x ) {

            group_arr[ x[s] ] = g[ x[s] ];
        }

        return callback( group_arr );
    })
}

export default {
    firebase: firebase,
    saveTo: saveTo,
    search_db: search_db,
    get_user: get_user,
    create: create,
    get_groups: get_groups
}

/*
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

                if ( i === 'global' ) {

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


exports.save_message = function( payload, callback ) {

    db.get('db_obj', (err, db_obj) => {
        if (err) {
            return callback({
                type: 'db',
                msg: err.message
            }, undefined);
        }

        const db_name = payload.session.group;
        if ( es6.includes( Object.keys( db_obj.db_groups ), db_name ) ) {

            db_obj.db_groups[db_name].msgs.push( payload );

            db.put('db_obj', db_obj, (err) => {
                if (err) {
                    return callback({
                        type: 'send-message',
                        msg: err.message
                    }, undefined);
                }

                return callback(null, {
                   type: 'send-message',
                   resp: payload
                });

            });
        }

    });

};



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


exports.activeUser = function( action, user_name, socket_id ) {};

exports.addUserToGroup = function( db_name, user_name ) {};
exports.deleteUserFromGroup = function( db_name, user_name ) {};
*/
