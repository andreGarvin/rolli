const date = new Date;

const app = new Vue({
    el: '#app',
    data: {
        socket: io(),    // the socket method/initilizing
        msg: '',         // holds the value of 'msg'
        query: '',       // holds the value for 'query'
        seen: true,      // the 'seen' variabelfor displaying things on the website
        groupbin: false, // displays the group settings panel
        resp: null,      // holds the resp from the backend webserver
        // displaying the cureent tima and date.
        curr_date: `${ date.getMonth() }/${ date.getDate() }/${ date.getFullYear() } ${ date.getHours() - 12 }:${ date.getMinutes() }`,
        gihpy: {
            gif_query: '',   // holds the value for the 'gihpy.gif_query'
            gifs: [],        // array of results from gihpy API in 'gifs'
        },
        // the user info/settings
        user: {
            listedgroups: Object.keys( this.user.groups ),    // listed groups the user is in
            user_name: '',   // 'user_name' of the user in the chat room
            // manging the chat channels the user is on
            session: {
              group: 'global',   // group name
              key: 'meme_cats'   // group key
            },
            groups: {
              // default group chat
              global: {
                    name: 'global',  // group name
                    k: 'meme_cats',  // group key
                    msgs: [],       // group msgs
                    attachments: [],  // group attachments
                    members: [],      // group memebers
                    active_users: []  // groups active users
                  }
              }
        }
    },
    methods: {

        // connectimg to the webserver
        connect: function() {

            /* setting the user name to nothing so wthe while
               loop starts and to be assinged later */
            var user_name = '';

            // if the user does given in data keep prmpting for a username
            while ( user_name.length === 0 ) {
                   var user_name = prompt('eneter user name');
            }

            // if the user gives a 'user_name'
               // assign it to the 'this.user.user_name' data
            this.user.user_name = user_name;
            // emit a message to the backend
            this.socket.emit('join', { 'user_name': user_name, groups: Object.keys( this.user.groups ), whisper: [] });

            // wait for a message to come back from the backend
            this.socket.on('join', function( msg ) {

                 // print to the console that message
                 console.log( msg );
            });
        },

        // sending message to otherin channel
        send_msg: function() {

            // if the user 'this.msg' is not empty send it
            if ( this.msg.length !== 0 ) {

                // however if the perosn sends a whisper
                // then do not print to the main stream
                if ( this.msg.slice(0, 2) === 'w/' ) {

                    // emit to backend
                    this.socket.emit(this.user.session.group,{ type: 'whisper', recp: this.user.user_name, recv: this.msg.split(' ')[1].split(':')[0], msg: this.msg.split(' ').slice(2, this.msg.length).join(' '), time: this.curr_date, session: this.user.session });
                }
                else {

                    // else if it is a reggular message then print/append to the main stream
                    this.socket.emit(this.user.session.group, { type: 'text', msg: this.msg, time: this.curr_date, user_name: this.user.user_name, session: this.user.session });
                }

                // empty the 'msg' data to a empty string
                this.msg = '';
            }

        },

        // recving messages
        recv_msg: function() {

            // recv message from the channel/session the user in on
            this.socket.on(this.user.session.group, function( msg ) {

                // finish whisper function
                if ( msg.type === 'whisper' ) {

                    // var members = this.user.groups.global.members;
                    // for ( var m in members ) {
                    //
                    //     console.log( members[m] );
                    //     // if ( members[m].user_name === this.user.user_name )
                    //     //     members[m].whisper.push( msg );
                    //
                    // }
                }
                else {

                      // recv the message from bakend
                      this.user.groups[this.user.session.group].msgs.push( msg );
                }
             }.bind(this));

        },

        // loding gifs
        load_gifs: function() {

              // set the 'gihpy.gif_query' to a empty string
              this.gihpy.gif_query = '';

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

                this.socket.emit(this.user.session.group, { type: 'gif', src: src, time: '12:44 pm', user_name: this.user.user_name });
                this.gihpy.gifs = [];
                this.gihpy.gif_query = '';

            },

            clearscreen: function() {

                 this.groupbin = false;
                 this.gihpy.gifs = [];

            },

            switchSessionChannel: function( groupName ) {

                 this.user.session.group = groupName;
            },

            createGroup: function() {

                  var groupName = prompt('group name?');

                  var notInGroup = false;

                  for ( var j in this.user.session.groups ) {
                      if ( this.user.groups[j].name === groupName ) {

                          notInGroup = true;
                      }

                  }


                  if ( notInGroup === false ) {

                      if ( groupName )

                             var new_group = {
                                      name: groupName,
                                      msgs: [],
                                      attachments: [],
                                      members: [],
                                      active_users: []
                              };

                              const app = this;
                              axios.post('http://localhost:3000/group', new_group)
                                   .then( ( resp ) => {

                                         if ( resp.data.status === true )

                                             this.user.listedgroups.push( groupName );

                                             this.user.groups[ groupName ] = {
                                                 name: groupName,
                                                 attachments: [],
                                                 members: [],
                                                 msgs: [],
                                                 active_members: []
                                             }

                                             alert( resp.msg );
                                    });

                  }
                  else {

                      alert(`groroup '${ groupName }' exist.`);
                  }

            }
            // searching for groups from rolli webserver
            // search: function( query, user_name ) {
            //
            //     // Send a POST request
            //     axios.post({
            //         method: 'post',
            //         url: 'http://localhost:3000/search',
            //         data: {
            //             query: query,
            //             user_name: user_name
            //         }
            //     });
            //
            //     this.query = '';
            // },
            // }

    },
    watch: {
        msg: function() {

            // sends url to backend
            function sendURL( url ) {

                 this.socket.emit(this.user.group, { type: 'url', link: url, user_name: this.user.user_name, time: '12:44 pm'} );
                 return true;
            }

            // sends images to backend
            function sendIMAGE( src ) {

                 this.socket.emit(this.user.session.group, { type: 'src', 'src': src, user_name: this.user.user_name, time: '12:44 pm' });
                 return true;
            }

            if ( this.msg.slice(0, 8) === 'https://' || this.msg.slice(0, 7) === 'http://' ) {
                sendURL( msg );
            }
            else if ( this.msg.slice( 58, this.msg.length ) === '.jpg' || this.msg.slice( 58, this.msg.length ) === '.png' || this.msg.slice(59, this.msg.length) === '.jpg' || this.msg.slice(59, this.msg.length) === '.png'  ) {
                 sendIMAGE( this.msg );
            }

        },
        query: function() {

              if ( this.query.length < 0 || this.query.length !== 0 ) {

                  this.search( this.query, this.user.user_name );
              }

        },

        // continous reloading and searching for gifs
        gif_query: function() {
            if ( this.gihpy.gif_query.length < 0 || this.gihpy.gif_query.length !== 0 ) {

                var app = this;

                axios.get(`https://api.giphy.com/v1/gifs/search?q=${ app.gihpy.gif_query}&api_key=dc6zaTOxFJmzC`)
                    .then(function( resp ) {

                          app.gihpy.gifs = [];

                          var giphy_resp = resp.data;

                          for ( var j in giphy_resp.data ) {

                              if ( giphy_resp.data[j].images.original.url !== undefined ) {

                                  app.gihpy.gifs.push( giphy_resp.data[j].images.fixed_width_small.url );
                               }
                           }

                    });
            }
            else {

                 this.gihpy.gifs = [];
                 this.load_gifs();
            }

        }

    }

});

// init the connection
app.connect();
// recving message
app.recv_msg();
