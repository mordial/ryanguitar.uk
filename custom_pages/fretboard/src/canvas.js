import { gatherParameters, notes } from "./main"
import loadPreset from "./presets"

export const colours = {
    noteBorder: 'white',
      noteText: 'white', 
          grid: '#717171', 
    rightClick: '#ff6347',
     leftClick: '#717171' 
}
let stringGap, fretGap, canvas, ctx, fretCount, stringCount
let fretboard = {}
let offset = {
    top: 30,
 bottom: 50,
   left: 35,
  right: 20 
}

export function draw( data ) 
{
    setValues( data ) 

    ctx.clearRect( 0, 0, canvas.width, canvas.height)
    ctx.beginPath()
    ctx.lineWidth = 2
    ctx.strokeStyle = colours.grid

    ctx.rect(
        offset.left,
        offset.top,
        fretboard.width,
        fretboard.height 
    ) 


    for( let x = 0; x < stringCount + 1; x++ ) 
    {
        ctx.strokeStyle = colours.grid 
        ctx.moveTo( offset.left,                   offset.top + ( x * stringGap ) ) 
        ctx.lineTo( offset.left + fretboard.width, offset.top + ( x * stringGap ))

        ctx.fillStyle = colours.leftClick
        ctx.font = "17px literata"
        ctx.textAlign = "center"
        ctx.fillText( 
            data.strings[ x ].pitch.toUpperCase(),
            10, 
            offset.top + ( x * stringGap ) + 6,
        )
    }
    
    for( let x = 0; x < fretCount; x++ ) 
    {
        ctx.fillStyle = colours.grid
        ctx.moveTo( offset.left + ( x * fretGap ), offset.top )
        ctx.lineTo( offset.left + ( x * fretGap ), offset.top + fretboard.height ) 

        ctx.fillStyle = colours.leftClick
        ctx.font = "17px literata"
        ctx.textAlign = "center"
        ctx.fillText( 
            x + data.startFret,
            offset.left + ( x * fretGap ) + fretGap / 2, 
            offset.top + fretboard.height + 40 
        )
    }

    ctx.stroke()

    for( let x in data.strings ) 
    { 
        for( let y in data.strings[ x ].selected ) 
        {
            let selected = data.strings[ x ].selected[ y ]

            ctx.beginPath() 

            let radius = ( fretGap * 0.7 ) / 2 
            if( radius > 20 ) radius = 20

            ctx.strokeStyle = colours.noteBorder
            ctx.lineWidth = 1  

            ctx.arc( 
                offset.left + ( ( selected.fret - data.startFret ) * fretGap ) + ( fretGap / 2 ), 
                offset.top + ( x * stringGap ),
                radius, 0, 2 * Math.PI
            )

            ctx.fillStyle = selected.colour 

            ctx.fill() 
            ctx.stroke()
            ctx.beginPath()

            ctx.fillStyle = colours.noteText
            ctx.font = `${ fretGap / 5 }px literata`
            ctx.textAlign = "center"

            let rootOffset = notes[ data.accidentals ].indexOf( data.strings[ x ].pitch )

            let note = notes[ data.accidentals ][ ( rootOffset + selected.fret ) % 12 ] 
            note = note.charAt( 0 ).toUpperCase() + note.slice( 1 )

            ctx.fillText( note, 
                offset.left + ( ( selected.fret - data.startFret ) * fretGap ) + ( fretGap / 2 ), 
                offset.top + ( x * stringGap ) + ( fretGap / 13 )
            ) 

            ctx.stroke() 
        }
    }
}



export function clicked( event, data, rightClick )
{
    let x = event.offsetX - offset.left 
    let y = event.offsetY - offset.top + ( stringGap / 2 ) 

    if( x < 0 ) x = 0 
    if( y < 0 ) y = 0 
 
    x = Math.floor( x / fretGap ) + data.startFret
    y = Math.floor( y / stringGap ) 

    if( y > stringCount ) y = stringCount 
    
    let fretAlreadySelected = false

    for( let f in data.strings[ y ].selected ) 
    {
        let selected = data.strings[ y ].selected[ f ]

        if( selected.fret === x ) 
        {
            if( selected.colour === colours.rightClick && !rightClick ) 
            {
                selected.colour = colours.leftClick
            } 
            else if ( selected.colour === colours.leftClick && rightClick ) 
            {
                selected.colour = colours.rightClick
            } 
            else 
            {
                data.strings[ y ].selected.splice( f, 1 ) 
            }
            fretAlreadySelected = true 
        }
    }
    if( !fretAlreadySelected ) 
    {
        data.strings[ y ].selected.push( { 
            fret: x, 
            colour: rightClick ? colours.rightClick : colours.leftClick 
        })
    }
    gatherParameters() 
}



function setValues( data ) 
{
    canvas = document.getElementById( 'fretboard' ) 
    ctx    = canvas.getContext( '2d' ) 

    fretCount   = data.endFret - data.startFret + 1
    stringCount = data.strings.length - 1

    canvas.style.height = ( data.strings.length * 8 ) + '%'

    if( fretCount <= 20 ) 
    {
        canvas.style.width = ( fretCount * 100 ) + 'px'
    } else 
    {
        canvas.style.width = "95%" 
    }

    let dimensions = canvas.getBoundingClientRect() 

    canvas.height = Math.floor( dimensions.height )
    canvas.width  = Math.floor( dimensions.width  )  

    fretboard = {
        height: canvas.height - offset.top - offset.bottom,
         width: canvas.width - offset.left - offset.right,
    }

    stringGap = fretboard.height / stringCount   
    fretGap   = fretboard.width  / fretCount
}