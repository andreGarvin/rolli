const db = require('./db.js'),
    axios = require('axios');


var date = new Date;

// current time/date
const curr_time = `${ date.getMonth() + 1 }/${ date.getDate() }/${ date.getFullYear() } ${ date.toLocaleTimeString() }`;

    
//  sends a random gif
exports.send_gif = function() {

    // making a 'GET' request to gihpy API
    axios.get('https://api.giphy.com/v1/gifs/trending?api_key=dc6zaTOxFJmzC')
        .then((resp) => {
    
    var gifs = [];

    var giphy_resp = resp.data;
    
        for ( var j in giphy_resp.data ) {
    
            if ( giphy_resp.data[j].images.original.url !== undefined ) {
        
                gifs.push( giphy_resp.data[j].images.fixed_width_small.url );
            }
        }
    
        
        // picking a random gif from the f=gifs array
        var ran_i = Math.floor( Math.random() * gifs.length );
        var random_gif = gifs[ ran_i ];
        
        return random_gif;
    });
};

exports.reply = function() {
    
    //  work bank of repsones
    const word_bank = [ 'how is the wether.', 'I like bannas.', 'what is your favorite furit?', 'How is the kids?', 'where brooklyn at ?!', 'Facts my guy !!' ];
    word_bank.push(`It is ${ this.curr_time } right now.`);
    
    var ran_j = Math.floor( Math.random() * word_bank.length );
    var random_response = this.word_bank[ ran_j ];
    
    return random_response;
};

exports.search = function( arg, callback ) {
    
    db.search_db(arg, (err, db_resp) => {
        if (err) {
            return callback(err, undefined);
        }
        
        return callback(null, db_resp);
    })
    
};

// bot.search({ action: 'group', db_name: 'global' }, (err, resp) =>{
//     if (err) {
//         console.log(err.msg);
//         return;
//     }
//     console.log( resp );
// })

/*
    features:
        - if you have a very hilarius convo with the rolli_bot it will post
        somthing as a post it faebook page and rate the convo
*/