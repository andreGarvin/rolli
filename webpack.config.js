var path = require('path');


module.exports =  {
    entry: path.resolve(`${ __dirname }/app/app.js`),
    output: {
        path: path.resolve(`${ __dirname }/dist`),
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                include: path.resolve(`${ __dirname }/app`),
                loader: 'babel-loader',
                query: {
                    presets: [
                        'es2015',
                        'stage-2'
                    ]
                }
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            }
        ]
    }
};
