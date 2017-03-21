var request = require('request');

var date = new Date;

const bot = {
      // current time/date
     curr_time: `${ date.getMonth() + 1 }/${ date.getDate() }/${ date.getFullYear() } ${ 12 - date.getHours() }:${ date.getMinutes() }`,
      //  work bank of repsones
     word_bank: [ 'how is the wether.', 'I like bannas.', 'what is your favorite furit?', 'How is the kids?', 'where brooklyn at ?!', 'Facts my guy !!' ],
     //  sends a random gif
     send_gif: function() {

        // making a 'GET' request to gihpy API
        request.get('https://api.giphy.com/v1/gifs/trending?api_key=dc6zaTOxFJmzC', function(err, resp) {

                if( err ) {

                   // if a error occurs console log error
                   return err;
                }
                else {

                    // parsing the resp into a object from a string to access the JSON 'data' reposne from gihpyAPI
                    var giphy_resp = JSON.parse( resp.body );

                    // delaring gifs a empty array
                    var gifs = [];

                    // going over the json object 'data' with the array of memes
                    for ( var j in giphy_resp.data ) {

                         //  if meme src/url is not 'undefined' then append it the gifs array
                         if ( giphy_resp.data[j].images.original.url !== undefined ) {

                            gifs.push( giphy_resp.data[j].images.fixed_width_small.url );
                         }
                    }

                    // picking a random gif from the f=gifs array
                    var ran_i = Math.floor( Math.random() * gifs.length );
                    var random_gif = gifs[ ran_i ];

                    console.log( random_gif );
                    return random_gif;
                }
        });
     },
     reply: function() {

          this.word_bank.push(`It is ${ this.curr_time } right now.`);
          var ran_j = Math.floor( Math.random() * this.word_bank.length );
          var random_response = this.word_bank[ ran_j ];

          return random_response;
     }
    //  search: function( arg ) {}
};

exports.data = bot;

// features:
    // if you have a very hilaripus onvo with the mrioli bot it will post
    // somthing as a post t  faebook page and rate the convo
