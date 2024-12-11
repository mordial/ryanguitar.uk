import { draw, clicked } from './canvas'
import loadPreset from './presets'

let maxFrets = 35
let flat  = '♭'

export const notes = {
    sharps: [ 'a', 'a#', 'b', 'c', 'c#', 'd', 'd#', 'e', 'f', 'f#', 'g', 'g#' ],
    flats:  [ 'a', 'bb', 'b', 'c', 'db', 'd', 'eb', 'e', 'f', 'gb', 'g', 'ab' ]
}

let data = {
    startFret: undefined, 
      endFret: undefined, 
  accidentals: undefined, 
      strings: []
}

window.onload = function() 
{
    checkUrlParams() 
    registerEventListeners() 
}


function checkUrlParams() 
{
    let urlParams = new URLSearchParams( window.location.search )

    if( urlParams.get( 'tuning' ) ) 
        document.getElementById( 'tuning-input' ).value = urlParams.get( 'tuning' )
            .toUpperCase()
            .split( ',' )
            .reverse()
            .join( ',' ) 
        
    if( urlParams.get( 'startFret' ) )
        document.getElementById( 'frets-input' ).value = 
            urlParams.get( 'startFret' ) + '-' + urlParams.get( 'endFret' ) 

    document.accidentalsForm.accidentals.value = urlParams.get( 'accidentals' ) 

    if( urlParams.get( 'scale' ) )  {
        document.getElementById( 'scale-input').value = urlParams.get( 'scale' ) || '' 
        gatherParameters( true )
    } else {
        gatherParameters( false ) 
    }

}



function setUrlParams( data ) 
{
    let url = new URL( window.location.href )
    let params = [ 'startFret', 'endFret', 'accidentals', 'tuning', 'scale' ]

    for( let x of params ) {
        if( data[ x ] !== '' ) { 
            if( x === 'tuning' ) {
                url.searchParams.set( x, data[ x ].join( ',' ) )
            }
            else { 
                url.searchParams.set( x, data[ x ] )
            }
        } else {
            url.searchParams.delete( x ) 
        }
    }

    history.replaceState(null, document.title, url )
}



function registerEventListeners() 
{
    [ ...document.getElementsByTagName( 'input' ) ].forEach( 
        input => {
            input.onchange = gatherParameters
        }
    )

    document.getElementById( 'fretboard' ).onclick = function( event ) 
    { 
        clicked( event, data, false ) 
    }

    document.getElementById( 'fretboard' ).addEventListener( 'contextmenu', 
        function( event ) 
        {
            event.preventDefault() 
            clicked( event, data, true ) 
        }, 
        false
    )

    window.addEventListener( 'resize', gatherParameters )

    document.getElementById( 'clear'    ).onclick = clearFretboard
    document.getElementById( 'download' ).onclick = downloadFretboard
}


export function gatherParameters( preset )
{
    let inputs = {
              frets: document.getElementById( 'frets-input' ),
             tuning: document.getElementById( 'tuning-input' ),
              scale: document.getElementById( 'scale-input'),
        accidentals: document.querySelector( 'input[name="accidentals"]:checked' )
    }

    data.scale = inputs.scale.value 

    data.tuning = inputs.tuning.value
        .replace( /\s/g, '' )
        .trim()
        .toLowerCase() 
        .split( ',' )
        .reverse() 

    let frets = inputs.frets.value
        .replace( /\s/g, '' ) 
        .split( '-' )

    data.startFret = parseInt( frets[ 0 ] )
    data.endFret   = parseInt( frets[ 1 ] )

    if( isNaN( data.startFret ) || isNaN( data.endFret ) ) 
    {
        data.startFret = 0
        data.endFret   = 24
    }

    data.startFret = data.startFret >= data.endFret ? 0 : data.startFret
    data.endFret   = data.endFret > maxFrets ? maxFrets : data.endFret 

    inputs.frets.value = data.startFret + '-' + data.endFret

    data.accidentals = inputs.accidentals.value 

    data.tuning = data.tuning.filter( x => x !== '' && notes[ data.accidentals ].includes( x ) )

    console.log( data.tuning ) 

    if( data.tuning.length < 2 ) 
        return alert( 'At least 2 strings required' ) 
    if( data.tuning.join( '' ).includes( 'b' ) && data.tuning.join( '' ).includes( '#' ) ) 
        return alert( 'Invalid tuning' )

    setUrlParams( data ) 

    if( !checkAccidentals() ) { /* Invalid tuning */ }   

    buildStrings( preset ) 
}


function buildStrings( preset ) 
{
    for( let x in data.tuning ) 
    {
        if( !data.strings[ x ] ) data.strings[ x ] = { selected: [] } 
        data.strings[ x ].pitch = data.tuning[ x ]    
    }
    for( let x = Object.keys( data.strings ).length; x >= 0; x-- ) 
    {
        if( x >= data.tuning.length ) {
            data.strings.splice( x, 1 )
            continue
        }
        for( let y in data.strings[ x ].selected ) {
            if( data.strings[ x ].selected[ y ].fret > data.endFret ||
                data.strings[ x ].selected[ y ].fret < data.startFret 
            ) {
                data.strings[ x ].selected.splice( y, 1 ) 
            }
        }
    }
    if( preset ) loadPreset( data )
    draw( data ) 
}


function checkAccidentals()
{
    for( let x of data.tuning ) 
        if( !notes[ data.accidentals ].includes( x ) ) return false 
    return true 
}


function clearFretboard() 
{
    for( let x of data.strings ) x.selected = [] 
    document.getElementById( 'scale-input' ).value = ''
    gatherParameters( false ) 
}


function downloadFretboard() 
{
    let link = document.createElement('a')
    link.download = 'fretboard.png'
    link.href = document.getElementById( 'fretboard' ).toDataURL()
    link.click()
}