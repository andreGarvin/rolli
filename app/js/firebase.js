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

// saves data to the data by taking a path to the data insertion
function saveTo( db_path, input ) {

    try {

        firebase.database().ref(db_path).set(input);
        return;
    }
    catch (e) {

        return {
            status: false,
            msg: e.message
        };
    }
}

function create( type, obj, callback ) {
    /*
        creates new data to insert to the database
        such groups or a new use to the firebase db
    */
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



function search_db( obj, callback ) {
    /*
        searchs throughout the entire database
        for user, groups, or messages sent
    */

    firebase.database().ref('groups_db').on('value', (grups) => {

        //  the groups object
        groups = groups.val();
        var matchs = tool.filter(tool.ObjectKeys(groups), ( group_name ) => {

            return groups_name.slice(0, obj.query) === obj.query;
        })


        if ( matchs.length !== 0 ) {

            return callback( null, matchs );
        }
        else {

            return callback({
                status: false,
                msg: `There are not reusults for '${ obj.query }'.`
            });
        }
    })
}

// get the user information once the user is signed in
function fetch_user( userObj, callback ) {

    const usersdb = firebase.database().ref('usersdb');
    usersdb.on('value', (users) => {

        // the users_db object
        users = users.val();
        /*
            goes over all the users in the usersdb array
            returns each users email.
        */
        var users_emails = tool.map(tool.ObjectValues( users ), ( i ) => {

            return i.email;
        });

        // checks to see if the user email exist in the ueser_emails array
        if ( tool.includes(users_emails, userObj.email) ) {


            return callback(null, users[ userObj.user_name ])
        }

        return callback({
            status: false,
            userObj: userObj,
            msh: `User '${ userObj.user_name }' does not exist.`
        }, undefined)
    });
}

function fetch_groups( obj, callback ) {

    firebase.database().ref('groups_db').on('value', (groups) => {

        // holds the groups object
        groups = groups.val();

        // the object holding the users groups
        var user_groups = {};
        var memeber_in_groups = tool.filter(Object.keys( groups ), (group_name) => {

            // getting back the arry of users in the group
            var group_members = Object.keys( groups[group_name].db_obj.members );

            // returns back the groups if the user is a group memeber
            return (
              (
                  tool.includes( group_members, obj.user_name )
                  &&
                  tool.includes( tool.ObjectValues( groups[group_name].db_obj.members ), obj.uid )
              )
              &&
              tool.includes( obj.groups, group_name )
            );
        })

        for ( var s in memeber_in_groups ) {

            // insert the groups the user is part of in the 'user_groups' object
            user_groups[ memeber_in_groups[s] ] = groups[ memeber_in_groups[s] ];
        }

        return callback( user_groups );
    })
}

export default {
    fetch_groups: fetch_groups,
    search_db: search_db,
    firebase: firebase,
    fetch_user: fetch_user,
    saveTo: saveTo,
    create: create
}
