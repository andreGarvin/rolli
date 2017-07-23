import * as firebase from 'firebase';
import firebasedb from '../firebase';

export default {
     template: `<div class='auth-container col-xs-8 col-sm-5 col-md-4 col-xs-offset-3 col-sm-offset-4 col-md-offset-4'>
            <h2 class='text-center'>{{ login ? 'login' : 'create account' }}</h2>

            <p class='lead text-center text-danger'>{{ ui_message }}</p>
            <div class='col-xs-12 col-sm-12'>
                 <span v-if='login'>
                       <input v-model='email' id='email' type='text' class='form-control' placeholder='email' />
                       <input v-model='password' type='password' class='form-control' placeholder='password' />
                       <button @click='auth("user")' class='btn btn-success pull-left'>login</button>
                 </span>
                <span v-else='create'>
                     <input v-model='user_name' type='text' class='form-control' placeholder='user name' />
                     <input v-model='full_name' type='text' class='form-control' placeholder='full name' />
                     <input v-model='email' type='text' id='email' class='form-control' placeholder='email' />
                     <input v-model='password' type='password' class='form-control' placeholder='password' />
                     <input v-model='password_2' type='password' class='form-control' placeholder='re-enter password' />

                     <button @click='auth("create")' class='btn btn-default pull-left'>create account</button>
                </span>
            </div>

            <p @click='create = !( create ); login = !( login )' id='switch-btn' class='lead pull-right'>{{ login ? 'sign up' : 'login' }}</p>
     </div>`,
     data: function() {

          return {
              login: true,
              create: false,
              email: '',
              user_name: '',
              full_name: '',
              password: '',
              password_2: '',
              ui_message: ''
          }
     },
     methods: {
          not_empty: function( arr ) {

                var resp  = true;
                for ( let i in arr ) {

                    if ( arr[i].length === 0 ) {

                        resp =  false;
                    }
                }

                return resp;
          },
          auth: function( type ) {

                if ( type === 'user' && this.not_empty([ this.email, this.password ]) ) {


                    this.ui_message = 'success';
                    var promise = firebase.auth().signInWithEmailAndPassword( this.email, this.password );

                    promise.catch(e => console.log( e.message ) );
                    return;
                }
                else if ( type === 'create' && this.not_empty([ this.email, this.user_name, this.password, this.password_2, this.full_name ]) ) {

                    if ( this.password === this.password_2 ) {

                        var promise = firebase.auth().createUserWithEmailAndPassword( this.email, this.password );
                        promise.then(r => {

                            // create the user before sigining them in
                            const userObj = {
                              email: this.email,
                              user_name: this.user_name,
                              full_name: this.full_name,
                            };
                            firebasedb.create('user', userObj, (err, obj) => {
                                if (err) {

                                    console.log('error');
                                    this.ui_message = err.msg;
                                    return;
                                }

                                this.ui_message = obj.msg;
                            });
                        })
                        promise.catch(e => console.log( this.ui_message = e.message ) )
                        return;
                    }

                    return this.ui_message = 'The passowrds do not match, please try again';
                }

                this.ui_message = `Please provide all the information need to ${ this.login ? 'login' : 'create your account' }`;
          }
    }
};
