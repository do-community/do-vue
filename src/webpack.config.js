const webpack = require('webpack');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const process = require('process');
const path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = (source, dest) => ({
    devtool: 'source-map',
    entry: {
        'mount.js': path.join(source, 'mount.js'),
        '__index_tmp.js': path.join(source, 'index.html'),
    },
    output: {
        path: dest,
        publicPath: './',
        filename: '[name]',
    },
    optimization: {
        minimize: true,
        minimizer: [
            '...',
            new CssMinimizerPlugin(),
        ],
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
                use: [MiniCssExtractPlugin.loader, 'style-loader', 'css-loader', 'sass-loader'],
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'style-loader', 'css-loader'],
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
        new BundleAnalyzerPlugin({analyzerMode: 'static'}),
        new VueLoaderPlugin(),
        new MiniCssExtractPlugin({filename: "style.css"}),
    ],
});
