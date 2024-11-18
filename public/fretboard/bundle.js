/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/canvas.js":
/*!***********************!*\
  !*** ./src/canvas.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   clicked: () => (/* binding */ clicked),
/* harmony export */   colours: () => (/* binding */ colours),
/* harmony export */   draw: () => (/* binding */ draw)
/* harmony export */ });
/* harmony import */ var _main__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./main */ "./src/main.js");
/* harmony import */ var _presets__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./presets */ "./src/presets.js");



const colours = {
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

function draw( data ) 
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
        ctx.font = "17px Poppins"
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
        ctx.font = "17px Poppins"
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
            ctx.font = `${ fretGap / 5 }px Poppins`
            ctx.textAlign = "center"

            let rootOffset = _main__WEBPACK_IMPORTED_MODULE_0__.notes[ data.accidentals ].indexOf( data.strings[ x ].pitch )

            let note = _main__WEBPACK_IMPORTED_MODULE_0__.notes[ data.accidentals ][ ( rootOffset + selected.fret ) % 12 ] 
            note = note.charAt( 0 ).toUpperCase() + note.slice( 1 )

            ctx.fillText( note, 
                offset.left + ( ( selected.fret - data.startFret ) * fretGap ) + ( fretGap / 2 ), 
                offset.top + ( x * stringGap ) + ( fretGap / 13 )
            ) 

            ctx.stroke() 
        }
    }
}



function clicked( event, data, rightClick )
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
    (0,_main__WEBPACK_IMPORTED_MODULE_0__.gatherParameters)()
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
        canvas.style.width = ( fretCount * 80 ) + 'px'
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

/***/ }),

/***/ "./src/main.js":
/*!*********************!*\
  !*** ./src/main.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   gatherParameters: () => (/* binding */ gatherParameters),
/* harmony export */   notes: () => (/* binding */ notes)
/* harmony export */ });
/* harmony import */ var _canvas__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./canvas */ "./src/canvas.js");
/* harmony import */ var _presets__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./presets */ "./src/presets.js");



let maxFrets = 35

const notes = {
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
    registerEventListeners() 
    gatherParameters() 
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
        ;(0,_canvas__WEBPACK_IMPORTED_MODULE_0__.clicked)( event, data, false  ) 
    }

    document.getElementById( 'fretboard' ).addEventListener('contextmenu', 
        function( event ) 
        {
            event.preventDefault() 
            ;(0,_canvas__WEBPACK_IMPORTED_MODULE_0__.clicked)( event, data, true ) 
        }, 
        false
    )

    window.addEventListener( 'resize', gatherParameters )

    document.getElementById( 'clear'    ).onclick = clearFretboard
    document.getElementById( 'download' ).onclick = downloadFretboard
}


function gatherParameters( preset )
{
    let inputs = {
              frets: document.getElementById( 'frets-input' ),
             tuning: document.getElementById( 'tuning-input' ),
        accidentals: document.querySelector( 'input[name="accidentals"]:checked' )
    }

    data.tuning = inputs.tuning.value
        .replace( /\s/g, '' )
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
    if( preset ) (0,_presets__WEBPACK_IMPORTED_MODULE_1__["default"])( data )
    ;(0,_canvas__WEBPACK_IMPORTED_MODULE_0__.draw)( data ) 
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
    gatherParameters( false ) 
}


function downloadFretboard() 
{
    let link = document.createElement('a')
    link.download = 'fretboard.png'
    link.href = document.getElementById( 'fretboard' ).toDataURL()
    link.click()
}

/***/ }),

/***/ "./src/presets.js":
/*!************************!*\
  !*** ./src/presets.js ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

var _docs_presets_json__WEBPACK_IMPORTED_MODULE_2___namespace_cache;
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ loadPreset)
/* harmony export */ });
/* harmony import */ var _main__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./main */ "./src/main.js");
/* harmony import */ var _canvas__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./canvas */ "./src/canvas.js");
/* harmony import */ var _docs_presets_json__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../docs/presets.json */ "./docs/presets.json");
 

 


function loadPreset( data )
{
    let input = document.getElementById( 'scale-input' ).value, root, scale 

    if( !input ) return 

    try {
        let words = input.split( ' ' )

        words = words.map( word => word.toLowerCase().replace( /\s/g, '' ) )

        words = words.filter( word => word.trim() != '' )

        root = words[ 0 ] 

        words.splice( 0, 1 ) 

        scale = words.join( ' ' ) 

    } catch ( e ) { 
        console.log( e ) 
        return 
    }

    if( !_main__WEBPACK_IMPORTED_MODULE_0__.notes[ data.accidentals ].includes( root ) ) 
    {
        alert( 'Incorrect accidentals entered' )
        return 
    }
    if( Object.keys( /*#__PURE__*/ (_docs_presets_json__WEBPACK_IMPORTED_MODULE_2___namespace_cache || (_docs_presets_json__WEBPACK_IMPORTED_MODULE_2___namespace_cache = __webpack_require__.t(_docs_presets_json__WEBPACK_IMPORTED_MODULE_2__, 2))) ).includes( scale ) ) 
    {
        solveFrets( data, root, /*#__PURE__*/ (_docs_presets_json__WEBPACK_IMPORTED_MODULE_2___namespace_cache || (_docs_presets_json__WEBPACK_IMPORTED_MODULE_2___namespace_cache = __webpack_require__.t(_docs_presets_json__WEBPACK_IMPORTED_MODULE_2__, 2)))[ scale ] ) 
    } 
    else {
        alert( 'Scale not found' ) 
    }
}


function solveFrets( data, root, intervals ) 
{
    let index = _main__WEBPACK_IMPORTED_MODULE_0__.notes[ data.accidentals ].indexOf( root )

    let scaleTones = [] 

    for( let x of intervals ) {
        scaleTones.push( _main__WEBPACK_IMPORTED_MODULE_0__.notes[ data.accidentals ][ index % 12 ] ) 
        index += x  
    }

    for( let x of data.strings ) x.selected = [] 

    for( let x in data.strings ) {

        index = _main__WEBPACK_IMPORTED_MODULE_0__.notes[ data.accidentals ].indexOf( data.strings[ x ].pitch )

        for( let y = data.startFret; y <= data.endFret; y++ ) {

            let note = _main__WEBPACK_IMPORTED_MODULE_0__.notes[ data.accidentals ][ ( y + index ) % 12 ] 

            if( scaleTones.includes( note ) ) {

                data.strings[ x ].selected.push({
                    fret: y, colour: note === root ? _canvas__WEBPACK_IMPORTED_MODULE_1__.colours.rightClick : _canvas__WEBPACK_IMPORTED_MODULE_1__.colours.leftClick 
                })
            } 

        } 
    }

}

/***/ }),

/***/ "./docs/presets.json":
/*!***************************!*\
  !*** ./docs/presets.json ***!
  \***************************/
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"major":[2,2,1,2,2,2,1],"minor":[2,1,2,2,1,2,2],"ionian":[2,2,1,2,2,2,1],"dorian":[2,1,2,2,2,1,2],"phrygian":[1,2,2,2,1,2,2],"lydian":[2,2,2,1,2,2,1],"mixolydian":[2,2,1,2,2,1,2],"aeolian":[2,1,2,2,1,2,2],"locrian":[1,2,2,1,2,2,2],"harmonic minor":[2,1,2,2,1,3,1],"melodic minor":[2,1,2,2,2,2,1],"minor pentatonic":[3,2,2,3,2],"major pentatonic":[2,2,3,2,3],"blues":[3,2,1,1,3,2]}');

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/create fake namespace object */
/******/ 	(() => {
/******/ 		var getProto = Object.getPrototypeOf ? (obj) => (Object.getPrototypeOf(obj)) : (obj) => (obj.__proto__);
/******/ 		var leafPrototypes;
/******/ 		// create a fake namespace object
/******/ 		// mode & 1: value is a module id, require it
/******/ 		// mode & 2: merge all properties of value into the ns
/******/ 		// mode & 4: return value when already ns object
/******/ 		// mode & 16: return value when it's Promise-like
/******/ 		// mode & 8|1: behave like require
/******/ 		__webpack_require__.t = function(value, mode) {
/******/ 			if(mode & 1) value = this(value);
/******/ 			if(mode & 8) return value;
/******/ 			if(typeof value === 'object' && value) {
/******/ 				if((mode & 4) && value.__esModule) return value;
/******/ 				if((mode & 16) && typeof value.then === 'function') return value;
/******/ 			}
/******/ 			var ns = Object.create(null);
/******/ 			__webpack_require__.r(ns);
/******/ 			var def = {};
/******/ 			leafPrototypes = leafPrototypes || [null, getProto({}), getProto([]), getProto(getProto)];
/******/ 			for(var current = mode & 2 && value; typeof current == 'object' && !~leafPrototypes.indexOf(current); current = getProto(current)) {
/******/ 				Object.getOwnPropertyNames(current).forEach((key) => (def[key] = () => (value[key])));
/******/ 			}
/******/ 			def['default'] = () => (value);
/******/ 			__webpack_require__.d(ns, def);
/******/ 			return ns;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/main.js");
/******/ 	
/******/ })()
;
//# sourceMappingURL=bundle.js.map