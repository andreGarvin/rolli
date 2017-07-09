import firebasedb, { firebase } from './js/firebase';
import tool from './js/tools';
import axios from 'axios';

import VueComponent from './js/VueComponents';

import './main.css';

const date = new Date;

const app = new Vue({
    el: '#app', // selecting the target element on the html page
    data: {
        user_data: {
            profile: {
                profile_pic: "https://ca.slack-edge.com/T0K0A1PFC-U1P37RNJK-8f7c680c8cd8-1024",
                user_name: 'andreGarvin'
            }
        },
        groups: {
            global: {
                messages: {
                    0: {
                        type: 'text',
                        message: 'Hello, world',
                        user_name: 'andreGarvin',
                        date: '7/8/2017 2:55pm'
                    }
                }
            }
        },
        session: 'global',
        msg: {
            msg_id: '',
            date: `${ date.getMonth() }/${ date.getDate()}/${ date.getFullYear() } ${ date.toLocaleTimeString()}`,
            type: '',
            message: '',
            user_name: '',
            profile_pic: ''
        },
        query: '',
        atch_query: '',
        load: {
            load_type: '',
            load_arr: []
        },
        ui_message: '',
    },
    components: {
        message: VueComponent.message,
        profilecontainer: VueComponent.profilecontainer
    },
    methods: {
        connect: function() {

            // firebase.auth().onAuthStateChanged( user => {
            //     if ( user ) {

            //         console.log( user );
            //     }
            //     else {

            //         console.log('NOT LOGGED IN :(');
            //     }
            // });
            // var app = this;

            // let firebaseUser = {
            //     user_name: '',
            //     email: 'jhondoe@gmail.com',
            //     full_name: 'jhon doe',
            // };
            // firebasedb.get_user(firebaseUser, (err, user_data) => {
            //     if (err) {

            //         firebasedb.create('user', err.userObj, (err, userObj ) => {
            //             if (err) {

            //                 console.log( err )
            //                 return;
            //             }

            //             console.log( userObj );
            //             // this.connect()
            //         });
            //         return;
            //     }

            //     console.log( user_data );

            //     // if (err) {
            //     //     firebasedb.create('user', firebaseUser);
            //     //     this.connect();
            //     // }
            //     // app.user_data = user_data;

            //     // let user_name = user_data.profile.user_name;
            //     // firebasedb.get_groups({ user_name: user_name, groups: user_data.groups }, (groups) => {
            //     //     if (groups.length) {

            //     //         return console.log('No groups :(');
            //     //     }

            //     //     app.groups = groups;
            //     // })
            // })
        },
        // clears the window/screen of the chat space
        clearscreen: function() {

            this.load.load_arr = [];
        },
        _send: function( type, src ) {

            this._query = '';
            this.load.load_arr = [];

            this.msg.type = type;
            this.msg.message = src;
            firebasedb.saveTo(`groups_db/${ this.session }/messages/${ this.groups[ this.session ].messages.length || 0 }`, this.msg);
        },
        create_group: function() {

            const group_name = prompt('group name'),
            group_obj = {
                group_name: group_name,
                admin: this.user_data.user_name,
            };
            firebasedb.create('group', group_obj, (err, new_group) => {
                if (err) return console.log(err);

                let groups = this.groups;
                groups.push( new_group );

                this.groups = groups;
            })
        },
        send_msg: function() {

            this.msg.message = this.msg.message.replace(/^\s+|\s+$/g, '');
            if ( this.msg.message.length !== 0 ) {


                this.msg.type = 'text';
                this.msg.user_name = this.user_data.profile.user_name;
                this.msg.msg_id = tool.hash();

                let group_mgs_len = this.groups[ this.session ].messages.length;
                firebasedb.saveTo(`groups_db/${ this.session }/messages/${ group_mgs_len || 0 }`, this.msg, (err) => {
                    if (err) {

                        console.log( err );
                        return;
                    }

                    // this.groups[ this.session ].messages = this.groups[ this.session ].messages;
                    this.msg.message = '';
                });
            }
        },
        atch_load: function( type ) {

            // set the '_query' to a empty string
            this.atch_query = '';
            this.load.load_arr = [];
            this.load.load_type = type;

            // check if the '_query' does not equal a empty string
            if ( this.load.load_arr.length === 0 ) {

                // refernce to te vue this object
                var app = this;

                switch ( type ) {

                    case 'emojis':
                        this.load.load_arr = [
                            'https://github.global.ssl.fastly.net/images/icons/emoji/grinning.png?v5',
                            'https://github.global.ssl.fastly.net/images/icons/emoji/grimacing.png?v5',
                            'https://github.global.ssl.fastly.net/images/icons/emoji/grin.png?v5',
                            'https://github.global.ssl.fastly.net/images/icons/emoji/smiley.png?v5',
                            'https://github.global.ssl.fastly.net/images/icons/emoji/smile.png?v5',
                            'https://github.global.ssl.fastly.net/images/icons/emoji/sweat_smile.png?v5',
                            'https://github.global.ssl.fastly.net/images/icons/emoji/laughing.png?v5',
                            'https://github.global.ssl.fastly.net/images/icons/emoji/innocent.png?v5',
                            'https://github.global.ssl.fastly.net/images/icons/emoji/wink.png?v5',
                            'https://github.global.ssl.fastly.net/images/icons/emoji/relieved.png?v5',
                            'https://github.global.ssl.fastly.net/images/icons/emoji/relaxed.png?v5',
                            'https://github.global.ssl.fastly.net/images/icons/emoji/triumph.png?v5',
                            'https://github.global.ssl.fastly.net/images/icons/emoji/unamused.png?v5',
                            'https://github.global.ssl.fastly.net/images/icons/emoji/sunglasses.png?v5',
                            'https://github.global.ssl.fastly.net/images/icons/emoji/neutral_face.png?v5',
                            'https://github.global.ssl.fastly.net/images/icons/emoji/blush.png?v5',
                            'https://github.global.ssl.fastly.net/images/icons/emoji/joy.png?v5',
                            'https://github.global.ssl.fastly.net/images/icons/emoji/cry.png?v5',
                            'https://github.global.ssl.fastly.net/images/icons/emoji/new_moon_with_face.png?v5',
                            'https://github.global.ssl.fastly.net/images/icons/emoji/full_moon_with_face.png?v5',
                            'https://github.global.ssl.fastly.net/images/icons/emoji/frog.png?v5',
                            'https://github.global.ssl.fastly.net/images/icons/emoji/-1.png?v5',
                            'https://github.global.ssl.fastly.net/images/icons/emoji/+1.png?v5',
                            'https://github.global.ssl.fastly.net/images/icons/emoji/b.png?v5',
                            'https://github.global.ssl.fastly.net/images/icons/emoji/100.png?v5'
                        ];
                        break;
                    case 'gifs':

                        // make a GET request to the gihpy API
                        axios.get('https://api.giphy.com/v1/gifs/trending?api_key=dc6zaTOxFJmzC')
                            .then(function( resp ) {
                                // assign the 'resp.data' to variable
                                var giphy_resp = resp.data;

                                // iterate over the 'data' in the resp from gihpy API
                                for ( var j in giphy_resp.data ) {

                                    // check if the 'src'/url does not equal a empty string or not avaible
                                    if ( giphy_resp.data[j].images.original.url !== undefined ) {

                                        //  append the results that are not undfined to the 'gihpy.gifs' array
                                        app.load.load_arr.push( giphy_resp.data[j].images.fixed_width_small.url );
                                    }
                                }
                            })
                        break;
                    case 'memes':

                        axios.get('https://dankexpress.herokuapp.com/')
                            .then( (resp) => {
                                resp = resp.data;
                                console.log( !resp.status.bool )
                                if ( !resp.status.bool ) {

                                    console.log( resp.msg )
                                    return;
                                }

                                resp = resp.resp;
                                app.load.load_arr = resp.map(( i ) => {

                                    return i.src
                                })
                            })
                        break;
                }
            }
        }
    },
    watch: {
        query: function() {

            var query = this.query.replace(/^\s+|\s+$/g, '');
            if ( query.length !== 0 ) {

                firebasedb.search_db({ query: query }, (err, data) => {
                    if (err) return console.log(err);

                    console.log( data );
                })
            }
        },
        atch_query: function() {

            var query = this.atch_query.replace(/^\s+|\s+$/g, '');
            if ( query.length < 0 || query.length !== 0 ) {

                var app = this;
                switch ( app.load.load_type ) {

                    case 'gifs':

                        axios.get(`https://api.giphy.com/v1/gifs/search?q=${ query }&api_key=dc6zaTOxFJmzC`)
                            .then(function( resp ) {
                                app.load.load_arr = [];

                                var giphy_resp = resp.data;
                                for ( var j in giphy_resp.data ) {

                                    if ( giphy_resp.data[j].images.original.url !== undefined ) {

                                        app.load.load_arr.push( giphy_resp.data[j].images.fixed_width_small.url );
                                    }
                                }
                        })
                        break;
                    case 'memes':

                        axios.get(`https://dankexpress.herokuapp.com/${ query }`)
                            .then( (resp) => {
                                resp = resp.data;
                                if ( !resp.status.bool ) {

                                    console.log( resp.msg )
                                    return;
                                }

                                resp = resp.resp;
                                app.load.load_arr = resp.map(( i ) => {

                                    return i.src
                                })
                            })
                        break;
                }
            }
            else {

                this.load.load_arr = [];
                this.atch_load( this.load.load_type );
            }
        }
    }
});
// app.connect();





/*
getUser: function() {

            var userObj = {
                full_name: 'andre garvin',
                date: `${ date.getMonth() }/${ date.getDate()}/${ date.getFullYear() } ${ date.toLocaleTimeString()}`,
                user_name: 'andreGarvin',
                email: 'andregarvin718@gmail.com'
            };
            firebasedb.getUser(userObj, (err, user_data) => {
                if (err) {

                    console.log(err);
                    return
                }

                console.log( user_data );
            });
        }

*/


/*
    methods: {

        // connectimg to the webserver
        connect: function() {

            setting the user name to nothing so the while
               loop starts and to be assinged later
            var user_name = prompt('enter user name');

            // if the user does given in data keep prmpting for a username
            while ( user_name.length === 0 ) {
                user_name = prompt('enter user name');
            }

            // if the user gives a 'user_name'
               // assign it to the 'this.user.user_name'
            this.user.user_name = user_name;


                emit a message to the sever to get the users
                retriving all the groups the iuser is in

            this.socket.emit('join', user_name);


                waiting for the retirved groups the user is in from the backend
                and assign the data to the user groups.

            this.socket.on('join', function( resp ) {

                // assiging the resp data to the users 'this.user.groups'
                this.user.groups = resp.groups;

                this.user.groups_len = Object.keys( this.user.groups ).length;

            }.bind(this));

        },

        searchForGroups: function( query ) {

            if ( query.replace(/^\s+|\s+$/g, '') !== '' && query.length !== 0 ) {

                var app = this;

                axios.get('/search/' + query)
                    .then(function( resp ) {
                        resp = resp.data;

                        if ( resp.status.bool ) {

                            app.group_results = resp.data;
                        }
                        else {

                            app.group_results = resp.err_msg;
                            this.group_results = [];
                            this.query = '';
                        }

                    });

                return;
            }

            this.group_results = [];
            this.query = '';

        },

        // sending message to otherin channel
        send_msg: function() {

            // if the user 'this.msg' is not empty send it
            if ( this.msg.length !== 0 && this.msg.replace(/^\s+|\s+$/g, '') !== '' ) {

                // else if it is a reggular message then print/append to the main stream
                this.socket.emit('global', {
                    type: 'text',
                    msg: this.msg,
                    time: this.curr_date,
                    user_name: this.user.user_name,
                    session: this.user.session
                });

                // empty the 'msg' data to a empty string
                this.msg = '';
            }
        },

        // recving messages
        recv_msg: function() {

            // recv message from the channel/session the user in on
            this.socket.on(this.user.session.group, function( msg ) {

                // recv the message from bakend
                this.user.groups[msg.session.group].msgs.push( msg );

            }.bind(this));

        },

        // loding gifs
        load_gifs: function() {

            // set the 'gihpy.gif_query' to a empty string
            this.gif_query = '';

            // check if the 'gihpy.gif_query' does not equeal a empty string
            if ( this.gihpy.gifs.length === 0 ) {

                // decalare a app varibel that hldet the 'this' key word
                var app = this;

                // make a GET request to the gihpy API
                axios.get('https://api.giphy.com/v1/gifs/trending?api_key=dc6zaTOxFJmzC')
                    .then(function( resp ) {
                        // assign the 'resp.data' to variable
                        var giphy_resp = resp.data;

                        // iterate over the 'data' in the resp from gihpy API
                        for ( var j in giphy_resp.data ) {

                          // check if the 'src'/url does not equal a empty string or not avaible
                          if ( giphy_resp.data[j].images.original.url !== undefined ) {

                              //  append the results that are not undfined to the 'gihpy.gifs' array
                              app.gihpy.gifs.push( giphy_resp.data[j].images.fixed_width_small.url );
                            }
                        }
                    });
            }
        },

        // sending gifs to other on the channel
        send_gif: function( src ) {

            this.socket.emit(this.user.session.group, {
                type: 'gif',
                src: src,
                time: this.curr_date,
                user_name: this.user.user_name,
                session: this.user.session
            });

            this.gihpy.gifs = [];
            this.gif_query = '';

        },

        createGroup: function() {

            var groupName = prompt('group name:').replace(/^\s+|\s+$/g, '');
            var GroupExist = false;

            if ( groupName.length !== 0 && groupName !== '' ) {

                var app = this;

                axios.post('/create_group/', { group_name: groupName, user_name: this.user.user_name })
                    .then(function( resp ) {

                        resp = resp.data;

                        if ( resp.status.bool ) {

                            app.user.groups[resp.new_group.group_name] = resp.new_group;

                            return;
                        }

                        console.log( resp.err_msg );
                    });

            }

        },

        get_group: function( group_name ) {

            var groups = [ group_name  ];

            var app = this;
            axios.post('/get-groups', {
                groups: groups,
                user_name: this.user.user_name
            }).then( function( resp ) {

                    resp = resp.data;

                    var groups = Object.keys( resp.groups );

                    var user_groups = app.user.groups;
                    for ( var i in groups ) {
                        user_groups[ groups[i] ]= resp.groups[ groups[i] ];
                    }

                    app.user.groups = user_groups;
                    console.log( user_groups );
                });

            this.group_results = [];
            this.query = '';
        },

        // clears the window/screen of the chat space
        clearscreen: function() {
            this.groupbin = false;
            this.gihpy.gifs = [];
        }

    },
    watch: {

        query: function() {

            this.searchForGroups( this.query );

        },

        // continous reloading and searching for gifs
        gif_query: function() {



        }
    }
however if the perosn sends a whisper
then do not print to the main stream

// if ( this.msg.slice(0, 2) === 'w/' ) {

//     // emit to backend
//     this.socket.emit(this.user.session.group, {
//         type: 'whisper',
//         recp: this.user.user_name,
//         recv: this.msg.split(' ')[1].split(':')[0],
//         msg: this.msg.split(' ').slice(2, this.msg.length).join(' '),
//         time: this.curr_date,
//         session: this.user.session
//     });

// }


function random() {

        var names = [
            'fizzy', 'popa', 'nut cracker',
            'table of doom',  'sexxy bear',
            'winter sleeper', 'octocat',
            'breezie', 'teletubie', 'boo zeah',
            'this old dog', 'salad pants'
        ];

        return names[Math.floor(Math.random() * names.length)]
    }
*/

// function checkType( input ) {
            // let ext = input.slice(input.length - 3, input.length);
            //     if ( ext === 'jpg' || ext === 'png' ) {
            //         if( isLink( input ) ) {
            //             return true;
            //         }
            //         return false;
            //     }
            //     return false;
            // if ( isLink( this.msg.message ) ) {
            //     this.msg.type = 'link';
            //     firebasedb.saveTo(`groups/${ this.session }/messages`, this.msg).(this);
            // }
            // else if ( isImage( this.msg.message ) ) {

            //     this.msg.type = 'image';
            //     firebasedb.saveTo(`groups/${ this.session }/messages`, this.msg).(this);
            // }
            // }

// #                 //     var x = tool.filter(u, (i) => {

// #                 //         return i.uid === obj.uid;
// #                 //     })

// #                 //     if ( x.length !== 0 ) {

// #                 //         resp = callback({
// #                 //             status: false,
// #                 //             msg: `This user name '${ obj.profile.user_name }' already exist choose another user name.`
// #                 //         });
// #                 //     }
// #                 //     else {

// #                 //         obj = {
// #                 //             joined: `${ date.getMonth() }/${ date.getDate()}/${ date.getFullYear() } ${ date.toLocaleTimeString()}`,
// #                 //             profile: {
// #                 //                 email: obj.email,
// #                 //                 full_name: obj.full_name,
// #                 //                 profile_picture: false,
// #                 //                 user_name: obj.user_name !== undefined || '' ? obj.user_name : 'user_name'
// #                 //             },
// #                 //             groups: false,
// #                 //             uid: tool.hash()
// #                 //         };
// #                 //         // saving the use to the firebase database
// #                 //         saveTo(`usersdb/${ obj.profile.user_name }`, obj, (err, data) => {
// #                 //             if (err) {

// #                 //                 resp = callback(err, undefined);
// #                 //             }
// #                 //             else {

// #                 //                 resp = callback(null, data);
// #                 //             }
// #                 //         })

// #                 //         saveTo(``)

// #                 //     }
// #                 // }
// #                 // else {

// #                 //     if ( tool.not_empty( obj.user_name )  ) {

// #                 //         obj = {
// #                 //         joined: `${ date.getMonth() }/${ date.getDate()}/${ date.getFullYear() } ${ date.toLocaleTimeString()}`,
// #                 //         profile: {
// #                 //             email: obj.email,
// #                 //             full_name: obj.full_name,
// #                 //             profile_picture: false,
// #                 //             user_name: obj.user_name
// #                 //         },
// #                 //         groups: {
// #                 //             '0': 'global'
// #                 //         },
// #                 //         uid: tool.hash()
// #                 //         };
// #                 //         // saving the use to the firebase database
// #                 //         saveTo(`usersdb/${ obj.profile.user_name }`, obj, (err, data) => {
// #                 //             if (err) {

// #                 //                 resp = callback === undefined ? err : callback(err, undefined);
// #                 //             }
// #                 //             else {

// #                 //                 resp = callback === undefined ? true : callback(null, data);
// #                 //             }
// #                 //         })
// #                 //     }

// #                 // }
