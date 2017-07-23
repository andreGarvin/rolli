export default {
      props: [ 'condition', 'items', 'method' ],
      template: `<ul class='pull-right' v-if='condition'>
                     <p v-for='item in items' @click='method( item )'>{{ item }}</p>
                </ul>`
};
