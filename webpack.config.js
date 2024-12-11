const path = require( 'path' ) 
const HtmlBundlerPlugin = require( 'html-bundler-webpack-plugin' ) 

module.exports = {
    
    mode: 'production',
    output: {    
        path: path.resolve( __dirname, './static' ),
        publicPath: './'
    },
    plugins: [
        new HtmlBundlerPlugin({
            entry: { 
                   'resources/index': './custom_pages/resources/index.html',
                   'fretboard/index': './custom_pages/fretboard/index.html', 
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