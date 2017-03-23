const level = require('level'),
    sublevel = require('level-sublevel');

const db = sublevel( level('./rolli_db', { valueEncoding: 'json' }) );

db.get('db_obj', function(err, obj) {
    console.log(obj.db_groups.default_groups);
});