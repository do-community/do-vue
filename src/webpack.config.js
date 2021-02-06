const webpack = require('webpack');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const process = require('process');

module.exports = {
    devtool: 'source-map',
    output: {
        publicPath: './',
    },
    module: {
        rules: [
            {
                test: /\.svg$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                    },
                    {
                        loader: 'react-svg-loader',
                        options: {
                            jsx: true,
                        },
                    },
                ],
            },
            {
                test: /\.jsx?$/,
                use: {
                    loader: 'babel-loader',
                },
            },
            {
                test: /\.tsx?$/,
                use: {
                    loader: 'ts-loader',
                },
            },
            {
                test: /\.s[ac]ss$/,
                use: ['style-loader', 'css-loader', 'sass-loader'],
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
            },
            {
                test: /\.html$/,
                loader: 'posthtml-loader',
                options: {
                    config: {
                        path: process.cwd(),
                    },
                },
            },
        ],
    },
    resolve: {
        fallback: {
            path: require.resolve('path-browserify'),
        },
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.css', '.scss', '.sass ', '.html', '.vue'],
    },
    plugins: [
        new webpack.ProvidePlugin({
            process: 'process/browser',
        }),
        new VueLoaderPlugin(),
    ],
};
