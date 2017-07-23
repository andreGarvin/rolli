export default {
     props: [ 'connect', 'create_acount' ],
     template: `<div class='auth-container col-xs-6 col-sm-5 col-md-4 col-xs-offset-3 col-sm-offset-4 col-md-offset-4'>
            <h2 class='text-center'>rolli Login</h2>

            <p class='lead text-center'>{{ ui_message }}</p>
            <div class='col-xs-12 col-sm-12'>
                 <span v-if='login'>
                       <input v-model='email' id='email' type='text' class='form-control' placeholder='email' />
                       <input v-model='password' type='password' class='form-control' placeholder='password' />
                       <button @click='' class='btn btn-success pull-left'>login</button>
                 </span>
                <span v-else='create'>
                     <input type='text' class='form-control' placeholder='user name' />
                     <input type='text' id='email' class='form-control' placeholder='email' />
                     <input type='password' class='form-control' placeholder='password' />
                     <input type='password' class='form-control' placeholder='re enter password' />

                     <button @click='' class='btn btn-default pull-left'>create account</button>
                </span>
            </div>

            <p @click='create = !( create ); login = !( login )' id='high-light' class='lead pull-right'>{{ login ? 'sign up' : 'login' }}</p>
     </div>`,
     data:function() {
          return {
              login: true,
              create: false,
              email: '',
              password: '',
              user_name: '',
              password_2: '',
              ui_message: ''
          }
     },
     methods: {

          check_input: function() {

              function not_empty( arr ) {

                  for ( let i in arr ) {

                      if ( arr[i].length === 0 ) {

                          return false;
                      }
                  }

                  return false;
              }

              if ( not_empty([ this.email, this.password, this.password ])  ) {

                  connect(  )
              }
          }
     },
     watch: {
          password: function() {

            if ( this.password.length === 5 ) {

                this.alert_message();
            }
          }
     }
}
