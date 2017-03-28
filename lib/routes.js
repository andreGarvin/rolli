var db = require('./db.js');


// sending the rolli home page
exports.index = function( req, resp ) {

    // sends a response of the file hosting the chat rooms
    resp.sendFile(`${ __dirname  }/app/index.html`);
};


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
            type: data.type,
            groups: data.resp
        });
        
    });
    
};
