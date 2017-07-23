export default {
  props: [ 'msg', 'user_name' ],
  template: `<div v-if='msg.user_name === user_name' class='pull-right'>
                  <span v-if='msg.type !== "src"'>
	                     <p v-if='msg.type === "text"' id="me" class='msg lead'>{{ msg.message }}</p>
		                   <p v-else='msg.type === "url"' class='msg lead' id='me'>
			                    <a :href='msg.message'>{{ msg.message }}</a>
		                   </p>
		              </span>
                  <img v-else='msg.type === "src"' :src='msg.message' class='src img-responsive img-rounded pull-right' />
                        <div class='col-xs-12 col-sm-12 col-md-12'>
                            <p style='color: #999' class='pull-right'>{{ msg.date }}; @{{ msg.user_name }} </p>
                        </div>
              </div>

              <div v-else='msg.user_name !== user_name' class='pull-left'>
		               <span v-if='msg.type !== "src"'>
	                       <p v-if='msg.type === "text"' id="other" class='msg lead'>{{ msg.message }}</p>
		                     <p v-else='msg.type === "url"' class='msg lead' id='other'>
			                      <a :href='msg.message'>{{ ms.message }}</a>
		                     </p>
	                  </span>
                    <img v-else='msg.type === "src"' :src='msg.message' class='src img-responsive img-rounded' />
                        <div class='col-xs-12 col-sm-12 col-md-12'>
                            <p style='color: #999' class='pull-left'>{{ msg.date }}; @{{ msg.user_name }} </p>
                        </div>
              </div>`
};
