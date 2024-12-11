import * as scales from '../intervals.json'

let flat  = '♭'
let sharp = '#'

let storeName = 'relative-scale-streak'

let exceptions = [ 'f#', 'c#' ]

let modes = [
    'major', //ionian
    'dorian',
    'phrygian',
    'lydian',
    'mixolydian',
    'minor', //aeolian
    'locrian'
]

let notes = {
    sharps: [ 'a', 'a#', 'b', 'c', 'c#', 'd', 'd#', 'e', 'f', 'f#', 'g', 'g#' ],
    flats:  [ 'a', 'bb', 'b', 'c', 'db', 'd', 'eb', 'e', 'f', 'gb', 'g', 'ab' ]
}

let answer
let streak = 0

window.onload = function() 
{
    if( !localStorage.getItem( storeName ) ){
        localStorage.setItem( storeName, 0 )
    }

    document.getElementById( 'record' ).innerText = 
        'Best streak: ' + localStorage.getItem( storeName ) 

    //Event handler for enter key and button click
    document.getElementById( 'submit' ).onclick = submit
    document.getElementById('input').addEventListener( 'keypress' , e => {
        if (e.key === 'Enter') {
            submit() 
        }
    })
    
    generateQuestion() 
}

function generateQuestion() 
{
    let root = notes.sharps[ Math.floor( Math.random() * notes.sharps.length ) ]

    let intervals = scales[ 'major' ] 
    let scale = [ ] 
    let index = notes.sharps.indexOf( root ) 
    let keySignature = sharp

    for( let x of intervals ) {   
        scale.push( notes.sharps[ ( index % notes.sharps.length ) ] ) 
        index += x
    }

    if( !exceptions.includes( root ) ) {

        for( let x of scale ) {
            if( x.length === 1 ) {
                for( let y of scale ) {
                    if( y.length === 2 && y.startsWith( x ) ) {
                        scale = scale.map(e => {
                            return notes.flats[ 
                                notes.sharps.indexOf( e ) 
                            ]
                        })
                        root = scale[ 0 ]
                        keySignature = flat
                    }
                }
            }
        }

    } else {
        //F# and C# major both include weird notes so we'll just hardcode them
        switch( root ) {
            case 'f#': 
                scale = [ 'f#', 'g#', 'a#', 'b', 'c#', 'd#', 'e#' ]
                break
            case 'c#':
                scale = [ 'c#', 'd#', 'e#', 'f#', 'g#', 'a#', 'b#'] 
                break 
        }
    }

    let mode = Math.floor( Math.random() * modes.length ) 
    let target = mode    

    console.log( scale, mode, length ) 

    //Make sure they're not the same number :)
    while( target === mode ) target = Math.floor( Math.random() * modes.length ) 

    let questionRoot = scale[ mode ]

    //Root length must be 2 to prevent b natural being turned into bb
    if( questionRoot.endsWith( 'b' ) && questionRoot.length === 2 ) {
        //Turn the lowercase b into an actual flat symbol
        questionRoot = questionRoot.substring( 0, 1 ) + flat
    }

    document.getElementById( 'question' ).innerHTML = //Modify this to add styling maybe 
        `What is the relative 
            ${ modes[ target ]} of 
            ${ questionRoot.toUpperCase() } 
            ${ modes[ mode ] }? 
            <span id="keysig"> ${ keySignature } </span>`

    answer = scale[ target ] 
}


function submit() 
{
    let bestStreak = localStorage.getItem( storeName ) 
    let input      = document.getElementById( 'input' ).value.toLowerCase()
    let result     = document.getElementById( 'result' ) 
    let streakText = ''
    
    input = input.replace( flat, 'b' )
    
    if( answer === input || answer === 'b#' && input === 'c' || answer === 'e#' && input === 'f' ) {
        streak += 1
        if( streak > bestStreak ) { 
            localStorage.setItem( storeName, streak )
            document.getElementById( 'record' ).innerText = 'Best streak: ' + streak
        }
        result.innerText = '✔️'
    } else {
        streak = 0
        result.innerText = '❌'
        streakText = `<span id="incorrect"> 
            The answer was ${ 
                answer.endsWith( 'b' ) && answer.length === 2 ? 
                    ( answer.substring( 0, 1 ) + flat ).toUpperCase() : answer.toUpperCase()
            } 
        </span>`
    }


    document.getElementById( 'input' ).value = ''

    if( streak >= 2 ) {

        streakText = streak + ' in a row<br>'

        //if( streak >= 5 ) streakText += ' 🔥'

        for( let x = 0; x < Math.floor( streak / 5 ); x++ ) streakText += '🔥'

    }

    document.getElementById( 'streak' ).innerHTML = streakText

    generateQuestion()
}