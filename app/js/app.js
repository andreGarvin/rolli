const date = new Date;

const app = new Vue({
    el: '#app', // selecting the target element on the html page
    data: {
        
        // the socket method/initilizing
        socket: io(),
        
        // holds the value of 'msg'
        msg: '',
        
        // holds the value for 'query'
        query: '',
        
        // the 'seen' variabelfor displaying things on the website
        seen: true,
        
        // displays the group settings panel
        // groupbin: false,
        
        // holds the resp from the backend webserver
        resp: {},
        
        group_results: [],
        
        // displaying the cureent tima and date.
        curr_date: date.getMonth() +'/'+ date.getDate() +'/'+ date.getFullYear() + ' ' + date.toLocaleTimeString(),
        
        gif_query: '',   // holds the value for the 'gihpy.gif_query'
        gihpy: {
            gifs: [],        // array of results from gihpy API in 'gifs'
        },
        
        // the user info/settings
        user: {
            user_name: '',   // 'user_name' of the user in the chat room
            
            // manging the chat channels the user is on
            session: {
                group: 'global',
                key: null
            },
            groups: {}
            // whispers: {},
        }
    },
    methods: {

        // connectimg to the webserver
        connect: function() {
    
            /* setting the user name to nothing so the while
               loop starts and to be assinged later */
            var user_name = prompt('enter user name');
            
            // if the user does given in data keep prmpting for a username
            while ( user_name.length === 0 ) {
                user_name = prompt('enter user name');
            }
    
            // if the user gives a 'user_name'
               // assign it to the 'this.user.user_name'
            this.user.user_name = user_name;
            
            /*
                emit a message to the sever to get the users
                retriving all the groups the iuser is in
            */
            this.socket.emit('join', user_name);
    
            /*
                waiting for the retirved groups the user is in from the backend
                and assign the data to the user groups.
            */
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
    
                /*
                    however if the perosn sends a whisper
                    then do not print to the main stream
                */
                if ( this.msg.slice(0, 2) === 'w/' ) {
    
                    // emit to backend
                    this.socket.emit(this.user.session.group, {
                        type: 'whisper',
                        recp: this.user.user_name,
                        recv: this.msg.split(' ')[1].split(':')[0],
                        msg: this.msg.split(' ').slice(2, this.msg.length).join(' '),
                        time: this.curr_date,
                        session: this.user.session
                    });
                    
                }
                else {
    
                    // else if it is a reggular message then print/append to the main stream
                    this.socket.emit('global', {
                        type: 'text',
                        msg: this.msg,
                        time: this.curr_date,
                        user_name: this.user.user_name,
                        session: this.user.session
                    });
                    
                }
    
                // empty the 'msg' data to a empty string
                this.msg = '';
            }
        },

        // recving messages
        recv_msg: function() {
            // recv message from the channel/session the user in on
            this.socket.on(this.user.session.group, function( msg ) {
                
                if ( msg.type === 'gif' || msg.type === 'src' || msg.type === 'url' ) {

                    /*
                        recv the message from bakend
                        appends to the attchments
                    */
                    this.user.groups[this.user.session.group].attachments.push( msg );
                }

                // recv the message from bakend
                this.user.groups[this.user.session.group].msgs.push( msg );
            
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
            axios.post('/get-groups', { groups: groups, user_name: this.user.user_name })
                .then(function( resp ) {
                    
                    resp = resp.data;
                    
                    let groups = Object.keys( resp.groups );
                    
                    for ( var i in groups ) {
                        app.user.groups[ groups[i] ] = resp.groups[ groups[i] ];
                    }
                    
                    console.log( Object.keys( app.user.groups ) );
                });
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
            
            if ( this.gif_query.length < 0 || this.gif_query.length !== 0 ) {
                
                var app = this;
                
                axios.get('https://api.giphy.com/v1/gifs/search?q='+ app.gif_query + '&api_key=dc6zaTOxFJmzC')
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
