import links from './links.json'

window.onload = function() 
{
    let parent = document.getElementById( 'container' )

    for( let x in links) {

        let div = document.createElement( 'div' )
        div.id = 'item' 

        let innerHTML = `
            <a href="${x}" id="title">${ links[ x ].title }</a>
            <div id="description">${ links[ x ].description }</div>
        `
        div.innerHTML = innerHTML

        parent.appendChild( div )
    }
}