var path    = require('path');
var webpack = require('webpack');

module.exports = {
    entry: {
        app: './js/index.js'
    },
    output: {
        path: './',
        filename: 'index.js'
    },
    externals: {
        'lodash': '_',
        'rx': 'Rx'
    },
    resolve: {
        root: path.resolve('./js')
    },
    module: {
        loaders: [
            {
                test: /.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    stage: 0
                }
            }
        ]
    }
}
