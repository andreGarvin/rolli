var db = require('./db.js');


// sending the rolli home page
exports.index = function( req, resp ) {

    // sends a response of the file hosting the chat rooms
    resp.sendFile( `${ __dirname  }/app/index.html` );
};


// creating new groups
exports.Creategroup = function( req, resp ) {
    
    console.log( req.body );
    
    var group_name = req.body.group_name;
    
    var group_obj = {
        group_name: group_name,
        group_db_obj: {
            k: null,
            admins: [ `@${ req.body.name }` ]
        },
        msgs: [],
        attachements: [],
        requests: []
    };
    
    db.create_group_db(group_name, group_obj, (err, data) => {
        if (err) {
            resp.json({
                status: {
                    txt: '',
                    code: 404,
                    bool: false
                },
                err_msg: err.msg
            });
            return;
        }
        
        resp.json({
            status: {
                bool: true,
                code: 200,
                txt: 'OK'
            },
            resp: resp
        });
    });
    
};

exports.search = function(req, resp) {
    
    db.searchGroups(req.params.group_name, (err, data) => {
        if (err) {
            resp.json({
                status: {
                    txt: '',
                    code: 404,
                    bool: false
                },
                err_msg: err.msg
            });
            return;
        }
        
        resp.json({
            status: {
                bool: true,
                code: 200,
                txt: 'OK'
            },
            resp: data
        });
        
    });
    
};


// feedbak route
// exports.GET_feedback = function( req, resp ) {

//   //  sending the feedbak page
//   resp.sendFile(`${ __dirname }/app/feedback.html`)
// };


// exports.POST_feedback = function( req, resp ) {

//     var post_data = req.body;
//     if ( post_data.msg.length !== 0 && post_data.user_name.length !== 0 )
//         reps.json({ status: true, msg: `Thank you for your feedback ${ post_data.user_name }` });

//     resp.json({ status: false, msg: 'ERROR: A error occured trying the send feddback mesage. Please provide a real user name and message.' });
// };