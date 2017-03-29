var db = require('./db.js');


// sending the rolli home page
exports.index = function( req, resp ) {

    // sends a response of the file hosting the chat rooms
    resp.sendFile(`${ __dirname  }/app/index.html`);
};

// console.log( Object.keys( db_obj.db_groups ) );
// creating new groups
exports.Creategroup = function( req, resp ) {
    
    var group_name = req.body.group_name;
    
    
    var group_obj = {
        group_name: group_name,
        group_db_obj: {
            k: null,
            admins: [ `@${ req.body.name }` ]
        },
        msgs: [],
        members: [],
        attachments: [],
        requests: []
    };
    
    db.create_group_db(group_obj, (err, db_obj) => {
        if (err) {
            console.log( err );
            resp.json({
                status: {
                    txt: '',
                    code: 404,
                    bool: false
                },
                type: err.type,
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
            new_group: db_obj.resp
        });
        
    });
    
};

exports.search = function(req, resp) {
    
    // the query sent my the user
    // const query_obj = req.body;
    
    db.search_db({ db_name: req.params.group_name, action: 'group' }, (err, db_resp) => {
        if (err) {
            
            return resp.json({
                status: {
                    txt: '',
                    code: 404,
                    bool: false
                },
                type: err.type,
                err_msg: err.msg
            });
        
        }
    
        resp.json({
            status: {
                bool: true,
                code: 200,
                txt: 'OK'
            },
            type: db_resp.type,
            groups: db_resp.data
        });
    });
    
};