
var profilecontainer = {
    props: [ 'user_name', 'profile_pic' ],
    template: `<div class="profile-container col-xs-12 col-sm-12 col-md-12">
                   <img class='img-responsive img-rounded col-xs-7 col-sm-7 col-md-6' :src='profile_pic' />
                   <p style='color: #fff; word-wrap: break-word; margin-top: 50px;' class='lead'>{{ user_name }}</p>
               </div>`
},

message = {
  props: ['msg', 'user_name'],
  template: `<div v-if='msg.user_name === user_name' class='pull-right'>
                    <p v-if='msg.type === "text"' id="me" class='msg lead'>{{ msg.message }}</p>
                    <img v-else='msg.type !== "text"' :src='msg.message' class='src img-responsive img-rounded pull-right' />
                    <div class='col-xs-12 col-sm-12 col-md-12'>
                        <p style='color: #999' class='pull-right'>{{ msg.date }}; @{{ msg.user_name }} </p>
                    </div>
              </div>
              <div v-else='msg.user_name !== user_name' class='pull-left'>
                    <p v-if='msg.type === "text"' id="other" class='msg lead'>{{ msg.message }}</p>
                    <img v-else='msg.type !== "text"' :src='msg.message' class='src img-responsive img-rounded' />
                    <div class='col-xs-12 col-sm-12 col-md-12'>
                        <p style='color: #999' class='pull-left'>{{ msg.date }}; @{{ msg.user_name }} </p>
                    </div>
                </div>`
}

export default {
    profilecontainer: profilecontainer,
    message: message
}
