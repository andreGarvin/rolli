import firebasedb, { firebase } from './js/firebase';
import { hash } from './js/hash';
import axios from 'axios';

// Vue components
import VueComponents from './js/VueComponents/index.js';

// css styles
import './main.css';

const date = new Date;

const app = new Vue({
    el: '#app', // selecting the target element on the html page
    components: VueComponents,
    data: {
        user_data: undefined,
        query: '',
        msg: {
            msg_id: '',
            date: `${ date.getMonth() }/${ date.getDate()}/${ date.getFullYear() } ${ date.toLocaleTimeString()}`,
            type: '',
            message: '',
            user_name: '',
            profile_pic: ''
        },
        session: 'global',
        groups: {},
        new_group: {
            group_name: '',
            key: ''
        },
        atch_query: '',
        load: {
            show: false,
            load_type: '',
            load_arr: []
        },
        show_dropdown: false,
        setting_items: [
            'create group',
            'account',
            'settings',
            'logout',
        ],
    },
    methods: {
        connect: function() {

            var app = this;
            firebasedb.firebase.auth().onAuthStateChanged( user => {
                if ( user ) {

                    firebasedb.fetch_user(user.email, (err, user_data) => {
                        if (err) {

                            return console.log( err )
                        }

                        // assiging the user_data to the 'user_data' Vue proprety
                        app.user_data = user_data;

                        var user_name = user_data.profile.user_name;
                        // fetching the user/s groups
                        firebasedb.fetch_groups({ user_name: user_name, uid: user_data.uid, groups: Object.values( user_data.groups ) }, (groups) => {
                            if ( Object.keys( groups ).length !== 0 ) {

                              app.groups = groups;
                              return;
                            }
                        })
                    })
                }
                else {

                      this.user_data = undefined;
                }
            });
        },
        logoutMethod: function() {

            return firebasedb.firebase.auth().signOut();
        },
        // clears the window/screen of the chat space
        clearscreen: function() {

            return this.load.load_arr = [];
        },
        atch_send: function( type, src ) {

            this._query = '';
            this.load.show = false;
            this.load.load_arr = [];

            // setting all props with data
            this.msg.type = 'src';
            this.msg.message = src;
            this.msg.msg_id =  hash.hash();
            this.msg.user_name = this.user_data.profile.user_name;
            this.msg.profile_pic = this.user_data.profile.profile_picture;
            
            let group_msg_len = this.groups[ this.session ].messages.length;
            firebasedb.saveTo(`groups_db/${ this.session }/messages/${ group_msg_len || 0 }`, this.msg, ( rsp ) => {
	    	         if ( !rsp.status ) return console.log( rsp.msg );

              	 this.msg.message = '';
	          })
        },
        create_group: function() {

            const group_name = prompt('group name').replace(/^\s+|s+$/g, ''),
            group_obj = {
                group_name: group_name,
                admin: this.user_data.profile.user_name,
		            uid: this.user_data.uid
            };
      	    console.log( group_obj )
            if ( group_name.length !== 0 ) {

                firebasedb.create('group', group_obj, (err, new_group) => {
                    if (err) return console.log(err);

                    console.log(`${ group_name } was created, add friends to join your group to make it more active.`)
                })
            }
        },
        send_msg: function() {

	         // this function validates wether the input is a url
	          function isUrl( input ) {

          		  var pieces = input.split(' ')
          		  for ( let p in pieces ) {

          		       var has_proto = pieces[p].split(':')[0],
          		       has_paths = pieces[p].split('').includes('/');
          		       if ( has_proto === 'https' || has_proto === 'http' ) {

          			         if ( has_paths ) {

          		               return true;
          			         }
          		       }
          		       else if ( has_paths && pieces[p].split('.').length === 2 ) {

          			          return true;
          		       }
        		    }

		            return false;

	         }

	    function checkExtension( str, extn_arr ) {

		 // splits the string between every '/'
		 var split_str = str.split('/');
		 // gets the length of that array of split_str
		 var split_str_len = split_str.length;

		 // assigns 'str' to the last element of the 'split_str'
		 str = split_str[split_str_len - 1];

		 // gets the last three characters of the str
		 var str_extn = str.slice(str.length - 3, str.length);
		 return extn_arr.includes(str_extn) ? true : false;
	    }

	    this.msg.message = this.msg.message.replace(/^\s+|\s+$/g, '');
            if ( this.msg.message.length !== 0 ) {


		if ( isUrl( this.msg.message ) && checkExtension(this.msg.message, ['png', 'jpg']) ) {
			this.msg.type = 'src';
		}
		else if ( isUrl( this.msg.message ) ) {

			this.msg.type = 'url';
		}
		else {

		    this.msg.type = 'text';
		}

		this.msg.msg_id =  hash.hash()
		this.msg.user_name = this.user_data.profile.user_name;

                let group_mgs_len = this.groups[ this.session ].messages.length;
                firebasedb.saveTo(`groups_db/${ this.session }/messages/${ group_mgs_len || 0 }`, this.msg, (err) => {
                    if (err) return console.log( err );

                    this.msg.message = '';
                });
            }
        },
        atch_load: function( type ) {
            this.load.show = true;

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

                                    return i.src;
                                })
                            })
                        break;
                }
            }
        },
        dispatch_action: function( action ) {

              switch ( action ) {

                    case 'create group':

                          this.create_group();
                          break;
                    case 'logout':

                          this.logoutMethod();
                          break;
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
