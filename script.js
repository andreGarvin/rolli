const date = new Date;

const app = new Vue({
    el: '#app',
    data: {
        socket: io(),
        msg: '',
        query: '',
        gif_query: '',
        seen: true,
        groupbin: false,
        resp: null,
        curr_date: `${ date.getMonth() }/${ date.getDate() }/${ date.getFullYear() } ${ date.getHours() - 12 }:${ date.getMinutes() }`,
        gihpy: {
            gifs: [],
        },
        user: {
            listedgroups: ['global'],
            user_name: 'andreGarvin',
            session: {
              group: 'global',
              key: 'meme_cats'
            },
            groups: {
              global: {
                    name: 'global',
                    k: 'meme_cats',
                    msgs: [],
                    attachments: [],
                    members: [],
                    active_users: []
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

            while ( user_name.length === 0 ) {
                var user_name = prompt('eneter user name');
            }

            this.user.user_name = user_name;
            this.socket.emit('join', { 'user_name': user_name, groups: Object.keys( this.user.groups ), whisper: [] });

            this.socket.on('join', function( msg ) {

                 console.log( msg );
            });
        },

        // sending message to otherin channel
        send_msg: function() {

            if ( this.msg.length !== 0 ) {

                if ( this.msg.slice(0, 2) === 'w/' ) {

                    this.socket.emit(this.user.session.group,{ type: 'whisper', recp: this.user.user_name, recv: this.msg.split(' ')[1].split(':')[0], msg: this.msg.split(' ').slice(2, this.msg.length).join(' '), time: this.curr_date, session: this.user.session });
                }
                else {

                    this.socket.emit(this.user.session.group, { type: 'text', msg: this.msg, time: this.curr_date, user_name: this.user.user_name, session: this.user.session });
                }

                this.msg = '';
            }

        },

        // recving messages
        recv_msg: function() {

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
                      this.user.groups[this.user.session.group].msgs.push( msg );
                }
            }.bind(this));

        },

        // loding gifs
        load_gifs: function() {

              this.gif_query = '';

              if ( this.gihpy.gifs.length === 0 ){


                  var app = this;


                  axios.get('https://api.giphy.com/v1/gifs/trending?api_key=dc6zaTOxFJmzC')
                      .then(function( resp ) {
                          var giphy_resp = resp.data;

                          for ( var j in giphy_resp.data ) {
                              if ( giphy_resp.data[j].images.original.url !== undefined ) {
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
                this.gif_query = '';
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

            function sendURL( url ) {

              this.socket.emit(this.user.group, { type: 'url', link: url, user_name: this.user.user_name, time: '12:44 pm'} );
              return true;
            }

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
            if ( this.gif_query.length < 0 || this.gif_query.length !== 0 ) {
                var app = this;

                axios.get(`https://api.giphy.com/v1/gifs/search?q=${ app.gif_query}&api_key=dc6zaTOxFJmzC`)
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
