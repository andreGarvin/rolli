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
    // not_empty: not_empty,
    hash: hash
}
