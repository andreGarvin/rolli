var level = require('level');

const db = level('rolli_db', { valueEncoding: 'json' });

db.get('db_obj', (err, data) => {
    if (err) {
        console.log(`error: ${ err.message }`);
        return;
    }
    
    console.log( data.db_groups.global );
})
