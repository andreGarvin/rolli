import firebasedb from, { firebase } './js/firebase';

const date = new Date;

const app = new Vue({
    el: '#app', // selecting the target element on the html page
    data: {
        ui_message: 'Hello, world',
        msg: {
            date: `${ date.getMonth() }/${ date.getDate()}/${ date.getFullYear() } ${ date.toLocaleTimeString()}`,
            message: '',
            user_name: '',
            profile_pic: ''
        }
    },
    methods: {
        connect: function() {
            
            firebase.auth().onAuthStateChanged(firebaseUser => {
                
                if ( firebaseUser ) {
                    
                    firebaseUser = {
                        email: firebaseUser.email,
                        full_name: firebaseUser.displayName.toLowerCase(),
                    };
                    firebasedb.getUser(firebaseUser, (err, user_data) => {
                        if (err) return console.log( err );
                        
                        console.log( user_data );
                    })
                }
                else {
                    
                    window.open('auth.html', '_slef');
                }
            });
        },
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
    }
});

// init the connection
// app.connect();
// recving message
// app.recv_msg();


/*

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
however if the perosn sends a whisper
then do not print to the main stream
*/
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

/*
    const date = new Date;
const app = new Vue({
    el: '#app',
    data: {
        msg: '',
        query: '',
        resp: {},
        
    },
    methods: {},
    watch: {}
});


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
    <div class="container-fluid">
                
                <!--sidebar -->
                <div class="col-xs-4 col-md-3 sidebar-nav">
                    <h1 class='col-md-2 col-xs-2'> Rolli </h1>
                    <input type="text" class="form-control" v-model='query' placeholder='search' />
                    
                    <button @click='createGroup' class="btn btn-success btn-block">create group</button>
                    
                    <div v-if='group_results.length !== 0' style='margin-top: 10px;' class='bin col-md-12 col-xs-12'>
                        <p v-if="typeof( group_results ) === 'string'">
                            {{ group_results }}
                        </p>
                        <ul v-else="typeof( group_results ) === 'object'" v-for='group in group_results'>
                            <li id='group' @click='get_group( group )'>
                                {{ group }}
                            </li>
                        </ul>
                    </div>
                    
                    <!--<button @click='createGroup' type="button" class="btn btn-success">add group</button>-->
                    <div v-for='group in Object.keys( user.groups )' class='col-md-12 col-xs-12'>
                        <h3 @click='user.session.group = group' class="group-tag text-center"> {{ group }} </h3>
                    </div>
                </div>

                <div class="row">
                
                    <div class="navbar navbar-default">
                        <h2 class='text-center'>{{ user.session.group }}</h2>
                        <!--<button @click='groupbin = !( groupbin )' type="button" class="btn btn-default pull-right">|||</button>-->
                    </div>
                    
                    <!--screen of the chat room-->
                    <div v-if='user.groups_len'class="screen col-md-9 col-xs-8 col-md-offset-3 col-xs-offset-4 container-fulid row">
                        
                        <span v-for='msg in user.groups[user.session.group].msgs'>
                            
                            <!--client sending message -->
                            <div v-if="msg.user_name === user.user_name" class="col-md-12 col-xs-12">
                        
                                <ul class='pull-right'>
                                    <li v-if="msg.type === 'text' " class='msg lead' id='me'> {{ msg.msg }} </li>
                                    <li v-else="msg.type === 'gif' ">
                                        <img :src="msg.src" class='gif img-responsive img-rounded' />
                                    </li>
                                    <li v-for="m in user.groups[user.session.group].memder">
                                        <p v-if='m === user.user_name' v-for="msg in m.whisper">
                                            {{ msg.msg }}
                                            <small>{{ msg.time }}; @{{ msg.recp }}</small>
                                        </p>
                                    </li>
                                </ul>
                                <div style='color: #999' class='col-md-12 col-xs-12'>
                                    <p class='pull-right'>{{ msg.time  }}; @{{ msg.user_name }} </p>
                                </div>
                            </div>
                        
                        
                            <!--if the user is recving the message -->
                            <div v-else="msg.user_name !== user.user_name" class="col-md-12 col-xs-12">
                    
                                <ul class='pull-left'>
                                    <li v-if=" msg.type === 'text' " class='msg lead' id='other'> {{ msg.msg }} </li>
                    
                                    <li v-else=" msg.type === 'gif' ">
                                        <img :src="msg.src" class='gif img-responsive img-rounded' />
                                    </li>
                                </ul>
                                <div style='color: #999' class='col-md-12 col-xs-12'>
                                    <p class='pull-left'>{{ msg.time  }}; @{{ msg.user_name }} </p>
                                </div>
                    
                            </div>
                        
                        </span>
                    </div>
                    
                    <!--the gif container -->
                    <div v-if='gihpy.gifs.length !== 0' class="gif-bin col-xs-6 col-md-7 col-xs-offset-5 col-md-offset-4">
                    
                        <button @click='gihpy.gifs = []' type="button" class="close" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    
                        <!--the input box -->
                        <input style='margin-bottom: 20px' type="text" class="form-control" v-model='gif_query' placeholder='search' />
                    
                        <!--the gif display -->
                        <div class="gif-container">
                            <img @click='send_gif( gif )' v-for='gif in gihpy.gifs' :src="gif" class='gif img-responsive img-rounded'/>
                        </div>
                    
                    </div>
                    
                    
                    <!--the input box for sending messages -->
                    <div class="input-box col-xs-8 col-md-9 col-xs-offset-4 col-md-offset-3 form-group form-group-lg row">
                    
                        <div class="col-md-9 col-xs-9">
                        
                            <!--input box -->
                            <input @click='clearscreen'  type="text" class="form-control" id="formGroupInputLarge" v-model='msg' v-on:keyup.enter='send_msg' placeholder='message' />
                        </div>
                        
                        <!--the buttons -->
                        <div  class='options col-md-3 col-xs-3'>
                            <button  @click='load_gifs' class="btn btn-success pull-right">Gifs</button>
                        </div>
                
                </div>
                
                <!--end of the .row div-->
                </div>

            <!--end of .container-fluid div-->
            </div>
        
        <!--end of the #app div-->
        </div>
*/