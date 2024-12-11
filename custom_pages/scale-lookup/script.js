import * as intervals from '../intervals.json'
import * as modeDescription from './modes.json'

let flat  = '♭'
let sharp = '#'

let notes = {
    sharps: [ 'a', 'a#', 'b', 'c', 'c#', 'd', 'd#', 'e', 'f', 'f#', 'g', 'g#' ],
    flats:  [ 'a', 'bb', 'b', 'c', 'db', 'd', 'eb', 'e', 'f', 'gb', 'g', 'ab' ]
}

let scales = [
    'major',
    'dorian',
    'phrygian',
    'lydian',
    'mixolydian',
    'minor',
    'locrian'
]

window.onload = function() 
{
    document.getElementById( 'submit' ).onclick = submit
    document.getElementById( 'scale' ).addEventListener( 'keypress' , e => {
            if (e.key === 'Enter') submit() 
        }
    )
}

function submit() 
{
    let input = document.getElementById( 'scale' ).value.toLowerCase().trim()
    let parts = input.split( ' ' ) 

    //Scale input can only be two words long 
    if( parts.length !== 2 ) return error( 'Invalid scale' ) 

    let root  = parts[ 0 ] 
    let scale = parts[ 1 ] 

    //Automatically convert input to major/minor
    if( scale === 'aeolian' ) scale = 'minor'
    if( scale === 'ionian'  ) scale = 'major' 

    if(
        !notes.sharps.includes( root ) && !notes.flats.includes( root )
        || !scales.includes( scale ) 
    ) {
        //The root or scale name was wrong!!
        return error( 'Invalid scale' ) 
    }

    findRelativeMajor( scale, root ) 
}


function findRelativeMajor( scale, root ) 
{
    let modePosition = scales.indexOf( scale ) 
    let accidentals  = notes.sharps.includes( root ) ? 'sharps' : 'flats' 
    let rootPosition = notes[ accidentals ].indexOf( root ) 
    let noteCount    = notes[ accidentals ].length

    let intervalSize = 0
    for( let x = 0; x < modePosition; x++ ) intervalSize += intervals.major[ x ] 
    let noteIndex = ( noteCount + ( rootPosition - intervalSize ) ) % noteCount
    let majorNotes = [] 
    
    for( let x = 0; x < intervals.major.length; x ++ ) {
        majorNotes.push(
            notes[ accidentals ][ noteIndex % noteCount ]
        )
        noteIndex += intervals.major[ x ] 
    }

    displayInfo( majorNotes, scale ) 
}


function displayInfo( majorNotes, mode ) 
{
    let outputElem = document.getElementById( 'output' ) 
    outputElem.innerHTML = ""

    outputElem.innerHTML += `<div id="modeInfo">${modeDescription[ mode ]}</div>`

    for( let x in majorNotes ) {

        let href = `${ encodeURIComponent( majorNotes[ x ] ) }+${ scales[ x ] }` 

        console.log( href ) 

        //Root length must be 2 to prevent b natural being turned into bb
        if( majorNotes[ x ].endsWith( 'b' ) && majorNotes[ x ].length === 2 ) {
            //Turn the lowercase b into an actual flat symbol
            majorNotes[ x ] = majorNotes[ x ].substring( 0, 1 ) + flat
        }

        outputElem.innerHTML += `<a id="mode" href="/fretboard/?scale=${ href }">
            <span id="root">${ majorNotes[ x ].toUpperCase() }</span> ${ scales[ x ]}
        </a>`
    }

}


function error( message ) 
{
    console.log( message ) 
    /**
     * Log a little message somewhere for the user letting them know they 
     * dun goofed
     */ 
}