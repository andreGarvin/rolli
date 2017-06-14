function map(arr, callback) {
    
    var newArray = [];
    for ( var i in arr ) {
        
        newArray.push( callback( arr[i] ) );
    }
    
    return newArray;
}

function includes( arr, item ) {
    
    for ( var i in arr ) {
        
        if ( arr[i] === item ) {
            
            return true;
        }
    }
    
    return false;
}

function filter( arr, callback ) {
    
    var newArray = [];
    for ( var i in arr ) {
        
        if ( callback( arr[i] ) ) {
            
            newArray.push( arr[i] );
        }
    }
    
    return newArray;
}

function ObjectValues( obj ) {
    
    var values = [];
    for ( var v in obj ) {
        
        values.push( obj[v] );
    }
    
    return values;
}

function hash() {

    var hash_id = '__';
    var alph = ['y', 'o', 'z', 'a', 'p', 'b', 'q', 'c', 'r', 'd', 's',
        'e', 't', 'f', 'u', 'g', 'v', 'h', 'w', 'i', 'x', 'j', 'k', 'l', 'm', 'n'];
    var nums = [];

    for ( var i = 0; i < 10; i++ ) {

         nums.push( i );
    }

    while ( hash_id.length !== 14 ) {

          hash_id += alph[ Math.floor( Math.random()  * alph.length ) ];
          hash_id += nums[ Math.floor( Math.random()  * nums.length ) ];
          hash_id += alph[ Math.floor( Math.random()  * alph.length ) ].toUpperCase();
    }

    return hash_id;
}


export default {
    ObjectValues: ObjectValues,
    includes: includes,
    filter: filter,
    hash: hash,
    map: map
}