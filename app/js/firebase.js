import * as firebase from 'firebase';
import hash from './hash';

firebase.initializeApp({
    apiKey: "AIzaSyC8kFt2_cHkLPF3YHrhB9yi_b37VJBcdfM",
    authDomain: "rolli-db.firebaseapp.com",
    databaseURL: "https://rolli-db.firebaseio.com",
    projectId: "rolli-db",
    storageBucket: "rolli-db.appspot.com",
    messagingSenderId: "1097445602183"
})

const date = new Date,
// formatting the current time
current_time = `${ date.getMonth() }/${ date.getDate()}/${ date.getFullYear() } ${ date.toLocaleTimeString()}`;


function saveTo( db_path, input, callback ) {
    /*
        saves data to the data by taking
        a path to the data insertion this
        fucntion runs sync and async.
    */

    try {

        firebase.database().ref(db_path).set(input);
        return callback({
            status: true,
            msg: `firebase: Data Was Stored To '${ db_path }'.`
        }) || true;
    }
    catch (e) {

          // if any erros aoccur then return back the error message
          return callback({
              status: false,
              msg: e.message
          }) || {
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
    let templateUserObj, templateGroupObj;
    switch ( type ) {

        case 'user':

            firebase.database().ref('usersdb').once('value', ( users ) => {

                    users = users.val();
                    // gets all the users emails
                    var users_emails = Object.values( users ).map( ( i ) => {

                        return i.email;
                    })


                    // checking the user the user_name exist and the email
                    if ( users_emails.includes( obj.email ) ) {

                        // return back the callback
                        resp = callback({
                            status: false,
                            msg: 'This Rolli Account Already Exist.',
                        }, undefined);
                    }
                    else {

                           //  format the userObj with given user input from 'obj'
                           templateUserObj = {
                                uid:  hash.hash(),
                                email: obj.email,
                                invitations: false,
                                groups: {
                                    0: 'global'
                                },
                                profile: {
                                    joined: current_time,
                                    profile_picture: 'http://i0.kym-cdn.com/photos/images/newsfeed/000/862/065/0e9.jpg',
                                    full_name: obj.full_name,
                                    user_name: obj.user_name
                                },
                            };
                            // saving the user to the firebase database 'userdb' collection
                            saveTo(`usersdb/${ obj.user_name }`, templateUserObj, (report) => {
                                  if (!report.status) {

                                      resp = callback(report, undefined)
                                  }
                                  else {

                                      resp = callback(null, {
                                          status: true,
                                          msg: `User Rolli Account Created: Welcome '${ obj.user_name }' To Rolli.`,
                                      })

                                      add_user_to_group('global', obj.user_name, templateUserObj.uid)
                                  }
                            })

                  }
            });
            break;

        case 'group':

            // change to code to check if the group exist in the dbatabse first
            firebase.database().ref('groups_db').once('value', (groups) => {

                    groups = groups.val();
                    // checks if the group name does not exist
                    if ( !Object.keys( groups ).includes( obj.group_name ) ) {

                        // fomat the group obj with user input from 'obj'
                        templateGroupObj = {
                            attachments: false,
                            db_obj: {
				                        admin: obj.admin,
                                init: current_time,
                                key: obj.key || 'global',
                                members: {}
                            },
                            messages: false,
                            requests: false
                        };

                        templateGroupObj.db_obj.members[ obj.admin ] = obj.uid;
                        // saving the group data to the firebase database 'groups_db' collection
                        saveTo(`groups_db/${ obj.group_name }`, templateGroupObj, (err, data) => {
                            if (err) {

                                resp = callback(err, undefined);
                            }
                            else {

                                add_user_to_group(group_name, obj.admin, obj.uid)
                                resp = callback(null, {
                                     status: true,
                                     msg: `New Group '${ obj.group_name }' Was Created.`
                                })
                            }
                        })

                    }
                    else {

                          // if the group exist return callback
                          resp = callback({
                                status: false,
                                msg: `Sorry Group Name '${ obj.group_name }' Already Exist, Please choose Another Group Name.`
                          })
                    }
            })
            break;
    }

    // returns back whatever response from ether switch statement
    return resp;
}

// adds new user to the group
function add_user_to_group( group_name, user_name, uid ) {

    saveTo(`groups_db/${ group_name }/db_obj/members/${ user_name }`, uid);
    firebase.database().ref('groups_db').on('value', ( groups ) => {

        let group_memebers = Object.keys( groups.val()[ group_name ].db_obj.memebers );
        if ( group_memebers.includes( user_name ) ) {

            console.log(`You Are Now A Memeber Of '${ group_name }'`)
            return true;
        }
        else {

              console.log(`You Were Not Added To '${ group_name }'`)
              return false;
        }
    })
};


function search_db( obj, callback ) {
    /*
        searchs throughout the entire database
        for user, groups, or messages sent
    */

    firebase.database().ref('groups_db').on('value', (groups) => {

        //  the groups object
        groups = groups.val();
        obj.groups
        // returns back the groups names that macth the query string
        var matchs = Object.keys(groups).filter( ( group_name ) => {

            return group_name.slice(0, obj.query.length).toLowerCase() === obj.query.toLowerCase();
        })

        // if 'match' is not empty then return back the array of matches
        if ( matchs.length !== 0 ) {

            return callback( null, matchs );
        }
        else {

            // elese retrun back no matches were found
            return callback({
                status: false,
                msg: `There are not reusults for '${ obj.query }'.`
            });
        }
    })
}

// get the user information once the user is signed in
function fetch_user( email, callback ) {

    const usersdb = firebase.database().ref('usersdb');
    usersdb.on('value', (users) => {

        // the users_db object
        users = users.val();

        // array of all the users_data from the firebase database
        let users_values = Object.values( users ),
        user_data = users_values.filter( ( i ) => {

            /*
            goes over all the users in the usersdb array returns
            users data if 'uerObj.email' matches 'i.email'.
            */
            if ( i.email === email ) {

                return i;
            }
        });

        return callback(null, user_data[0])
    });
}

function fetch_groups( obj, callback ) {

    firebase.database().ref('groups_db').on('value', (groups) => {

        // holds the groups object
        groups = groups.val();

        // the object holding the users groups
        var user_groups = {};
        var memeber_in_groups = Object.keys( groups ).filter( (group_name) => {

            // getting back the arry of users in the group
            var group_members = Object.keys( groups[group_name].db_obj.members );

            // returns back the groups if the user is a group memeber
            return (
              (
            		  // checks weather the user is a memberin the group
                  group_members.includes( obj.user_name )
                  &&
            		  // checks if the uid is also in the group
                  Object.values( groups[group_name].db_obj.members ).includes( obj.uid )
              )
              &&
              // checks if the 'group_name' is in the users groups ('obj.groups')
              obj.groups.includes( group_name )
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
    add_user_to_group: add_user_to_group,
    fetch_groups: fetch_groups,
    fetch_user: fetch_user,
    search_db: search_db,
    firebase: firebase,
    saveTo: saveTo,
    create: create
}
