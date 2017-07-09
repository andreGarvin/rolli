import firebasedb, { firebase } from './js/firebase';
import tool from './js/tools';
import axios from 'axios';

// Vue components
import VueComponent from './js/VueComponents';

// css styles
import './main.css';

const date = new Date;

const app = new Vue({
    el: '#app', // selecting the target element on the html page
    data: {
        user_data: undefined,
        groups: {},
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

            var app = this;
            // firebase.auth().onAuthStateChanged( user => {
            //     if ( user ) {
            //         console.log( user );
            //     }
            //     else {
            //         console.log('NOT LOGGED IN :(');
            //     }
            // });


            let firebaseUser = {
                user_name: 'andreGrvin',
                email: 'andregarvin718@gmail.com',
                full_name: 'andre garvin',
            };
            firebasedb.fetch_user(firebaseUser, (err, user_data) => {
                if (err) {

                    console.log( err )
                    // firebasedb.create('user', err.userObj, (err, userObj ) => {
                    //     if (err) {
                    //
                    //         console.log( err )
                    //         return;
                    //     }
                    //
                    //     console.log( userObj );
                    //     // this.connect()
                    // });
                    // if (err) {
                    //     firebasedb.create('user', firebaseUser);
                    //     this.connect();
                    // }
                    return;
                }

                // assiging the user_data to the 'user_data' Vue proprety
                app.user_data = user_data;

                var user_name = user_data.profile.user_name;
                // fetching the user/s groups
                firebasedb.fetch_groups({ user_name: user_name, uid: user_data.uid, groups: tool.ObjectValues( user_data.groups ) }, (groups) => {
                    if ( Object.keys( groups ).length !== 0 ) {

                      app.groups = groups;
                      return;
                    }
                })
            })
        },
        // clears the window/screen of the chat space
        clearscreen: function() {

            this.load.load_arr = [];
        },
        atch_send: function( type, src ) {

            this._query = '';
            this.load.load_arr = [];

            this.msg.type = type;
            this.msg.message = src;
            this.msg.msg_id = tool.hash();
            this.msg.user_name = this.user_data.profile.user_name;
            this.msg.profile_pic = this.user_data.profile.profile_picture;


            let group_msg_len = this.groups[ this.session ].messages.length;
            firebasedb.saveTo(`groups_db/${ this.session }/messages/${ group_msg_len || 0 }`, this.msg);

            this.msg.message = '';
        },
        create_group: function() {

            const group_name = prompt('group name'),
            group_obj = {
                group_name: group_name,
                admin: this.user_data.user_name
            };
            if ( tool.not_empty( groups_name ) ) {

                firebasedb.create('group', group_obj, (err, new_group) => {
                  if (err) return console.log(err);

                  let groups = this.groups;
                  groups.push( new_group );

                  this.groups = groups;
                })
            }
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
app.connect();
