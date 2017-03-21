// made a similar includes() function cause the server keeps yelling 
// at me syaing its not a function because its a es7 || es6 function
exports.includes = function( array, item ) {
     
    for ( var i in array ) {
         
        if ( array[i] === item ) {
              
            return true;
        }
    }
    
    return false; 
}