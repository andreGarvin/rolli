var date = new Date;

const app = new Vue({

     el: '#app',
     data: {
          feedback_msg: {
               msg: '',
               user_name: '',
               time: `${ date.getMonth() }/${ date.getDate() }/${ date.getFullYear() } ${ date.getHours() - 12 }:${ date.getMinutes() }`
          }
     },
     methods: {
         send_feedback: function() {

              var app = this;
              axios.post('http://localhost:3000/feedback', app.feedback_msg)
                 .then( function( resp ) {
                      var resp = resp.data;

                      if ( resp.status == true ) {

                          alert( resp.msg );
                          return true;
                      }
                      alert( resp.msg );
                 });
         }
     }
});
