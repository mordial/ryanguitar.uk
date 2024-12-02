const path = require( 'path' ) 
const HtmlBundlerPlugin = require ( 'html-bundler-webpack-plugin' ) 

module.exports = {
    
    mode: 'production',

    output: {    
        path: path.resolve( __dirname, './static' ),
        publicPath: './'
    },

    plugins: [
        new HtmlBundlerPlugin({
            entry: { 
                   'fretboard/index': './custom_pages/fretboard/index.html', 
                      'chords/index': './custom_pages/chords/index.html',
                  'scale-game/index': './custom_pages/scale-game/index.html',
                'scale-lookup/index': './custom_pages/scale-lookup/index.html'
            },
            js:  { inline: true },
            css: { inline: true }
        })
    ],

    module: {
        rules: [
            { test: /.\.css$/, use: [ 'css-loader' ] }
        ]
    }

}