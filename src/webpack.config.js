const webpack = require('webpack');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const process = require('process');
const path = require('path');

module.exports = (source, dest) => ({
    devtool: 'source-map',
    entry: {
        mount: [
            path.join(source, 'mount.js'),
            path.join(source, 'index.html'),
        ],
    },
    output: {
        path: dest,
        publicPath: './',
        filename: 'mount.js',
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
                use: [
                    'file-loader',
                    {
                        loader: 'posthtml-loader',
                        options: {
                            config: { 
                                path: process.cwd(),
                            },
                        },
                    },
                ],
            },
        ],
    },
    resolve: {
        fallback: {
            path: require.resolve('path-browserify'),
        },
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.css', '.scss', '.sass', '.html', '.vue'],
    },
    plugins: [
        new webpack.ProvidePlugin({
            process: 'process/browser',
        }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: path.join(source, 'index.html'),
        }),
        new VueLoaderPlugin(),
    ],
});
