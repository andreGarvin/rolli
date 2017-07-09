
var profilecontainer = {
    props: [ 'user_name', 'profile_pic' ],
    template: `
        <div class="profile-container col-xs-12 col-sm-12 col-md-12">
            <img class='img-responsive img-circle col-xs-7 col-sm-7 col-md-6' :src='profile_pic' />
            <p style='color: #fff; word-wrap: break-word; margin-top: 6px;' class='lead col-xs-12 col-sm-12 col-md-12'>
                {{ user_name }}
            </p>
        </div>
    `
},

message = {
  props: ['msg', 'user_name'],
  template: `<span v-if='msg.user_name === user_name' class='col-xs-12 col-sm-12 col-md-12'>
                <div class='col-xs-7 col-sm-5 col-md-4 pull-right'>
                    <p v-if='msg.type === "text"' id="me" class='msg lead'>{{ msg.message }}</p>
                    <img v-else='msg.type !== "text"' :src='msg.message' class='src img-responsive img-rounded' />
                </div>
                <div class='col-xs-12 col-sm-12 col-md-12'>
                    <p style='color: #999' class='pull-right'>{{ msg.date }}; @{{ msg.user_name }} </p>
                </div>
            </span>
            <span v-else='msg.user_name !== user_name' class='col-xs-12 col-sm-12 col-md-12'>
                <div class=' col-xs-7 col-sm-5 col-md-4 pull-left'>
                    <p v-if='msg.type === "text"' id="other" class='msg lead'>{{ msg.message }}</p>
                    <img v-else='msg.type !== "text"' :src='msg.message' class='src img-responsive img-rounded' />
                </div>
                <div class='col-xs-12 col-sm-12 col-md-12'>
                    <p style='color: #999' class='pull-left'>{{ msg.date }}; @{{ msg.user_name }} </p>
                </div>
            </span>`
}

export default {
    profilecontainer: profilecontainer,
    message: message
}
