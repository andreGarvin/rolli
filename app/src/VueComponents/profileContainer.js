export default {
    props: [ 'user_name', 'profile_pic' ],
    template: `<div class="profile-container col-xs-12 col-sm-12 col-md-12">
                   <img class='img-responsive img-rounded col-xs-7 col-sm-7 col-md-6' :src='profile_pic' />
                   <p style='color: #fff; word-wrap: break-word;' class='lead col-xs-12'>{{ user_name }}</p>
               </div>`
};
