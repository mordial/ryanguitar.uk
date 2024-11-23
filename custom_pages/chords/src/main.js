/*
    the root note (e.g. C♯)
    the chord quality (e.g. minor or lowercase m, or the symbols o or + for diminished and augmented chords)
    whether the chord is a triad, seventh chord, or an extended chord (e.g. Δ7)
    any altered notes (e.g. sharp five, or ♯5)
    any added tones (e.g. add2)
    the bass note if it is not the root (e.g. a slash chord)
*/

window.onload = function(){

    parseChord( 'A#maj7#5(11,13)' )

} 

function parseChord( chord ) {

    //Remove whitespace, convert all to lower case, split characters into an array
    let chars = chord.toLowerCase().replace( /\s/g, '' ).split( '' ) 

    let naturals  = 'abcdefg'.split( '' ) 
    let intervals = []
    let state = 1, root, char 

    try {

        while( chars.length ) {

            char = chars.shift()

            //Expecting the root note. 
            if( state === 1 ) {
                if( !naturals.includes( char ) ) throw new Error( 'Invalid root note' ) 
                root = char 
                if( chars[ 0 ] === 'b' || chars[ 0 ] === '#' ) root += chars.shift() 
            }


        }

    } catch( e ) {

        //Display the error to the user 

    }

}

function generateVoicings(){
    /*
        take the notes and find as many voicings of the chord as possible across the fretboard
    */
} 