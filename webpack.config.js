import fs from 'fs'
import path from 'path' 
import HtmlBundlerPlugin from 'html-bundler-webpack-plugin'

let custom = {} 

/**
 * Each .html file in the ./custom directory is packaged and moved to the ./static 
 * folder. Hugo treats these as custom URL paths. Imported JS and CSS is inlined. 
 */
fs.readdirSync( path.resolve( './custom' ) ).forEach( file => {
    if( file.endsWith( '.html' ) ) {
        custom[ file.split( '.' )[ 0 ] + '/index' ] = './custom/' + file 
    }
})

export default {
    mode: 'production',
    output: {    
        path: path.resolve( './static' ),
        publicPath: './'
    },
    plugins: [
        new HtmlBundlerPlugin({
            entry: custom,
            js:  { inline: true },
            css: { inline: true }
        })
    ],
    module: { rules: [{ test: /.\.css$/, use: [ 'css-loader' ] }] }
}