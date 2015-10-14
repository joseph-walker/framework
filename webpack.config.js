var path    = require('path');
var webpack = require('webpack');

module.exports = {
    entry: {
        app: './js/main.js'
    },
    output: {
        path: './build',
        publicPath: "/build/",
        filename: 'bundle.js'
    },
    externals: {
        'lodash': '_',
        'react': 'React',
        'react-dom': 'ReactDOM',
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
