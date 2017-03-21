var fs = require('fs');

var es6 = require('./includes.js');


// sending the rolli home page
exports.index = function( req, resp ) {

    // sends a response of the file hosting the chat rooms
    resp.sendFile( `${ __dirname  }/app/index.html` );
};


// feedbak route
exports.GET_feedback = function( req, resp ) {

  //  sending the feedbak page
  resp.sendFile(`${ __dirname }/app/feedback.html`)
};


exports.POST_feedback = function( req, resp ) {

    var post_data = req.body;
    if ( post_data.msg.length !== 0 && post_data.user_name.length !== 0 )
        reps.json({ status: true, msg: `Thank you for your feedback ${ post_data.user_name }` });

    resp.json({ status: false, msg: 'ERROR: A error occured trying the send feddback mesage. Please provide a real user name and message.' });
};


// creating new groups
exports.Creategroups = function( req, resp ) {

    groups[req.body.name] = req.body;

    fs.writeFile('groups.json', JSON.stringify( groups, null, 4 ) );
    resp.json({ msg: `'${ req.body.name }' was creted.`, status: true });
};
