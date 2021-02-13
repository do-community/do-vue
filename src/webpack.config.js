const webpack = require('webpack');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const process = require('process');
const path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const fs = require('fs').promises;

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
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
            },
            {
                test: /\.ya?ml$/,
                use: 'yaml-loader',
                type: 'json',
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
            fs: require.resolve('browserify-fs'),
            buffer: require.resolve('buffer/'),
            util: require.resolve('util/'),
            stream: require.resolve('stream-browserify'),
            events: require.resolve('events/'),
            constants: require.resolve('constants-browserify'),
        },
        extensions: ['.js', '.jsx', '.json', '.ts', '.tsx', '.css', '.scss', '.sass', '.html', '.vue', '.yml', '.yaml'],
    },
    plugins: [
        new webpack.ProvidePlugin({
            process: 'process/browser.js',
            Buffer: ['buffer', 'Buffer'],
        }),
        new BundleAnalyzerPlugin({analyzerMode: 'static', openAnalyzer: false}),
        new VueLoaderPlugin(),
        new MiniCssExtractPlugin({filename: 'style.css'}),
        {
            apply: compiler => compiler.hooks.afterEmit.tapPromise('HTMLPatchingPlugin', async () => {
                try {
                    await fs.unlink(path.join(dest, '__index_tmp.js'));
                } catch (_) {
                    // Exit on deletion errors. This is the build step that involves the temp JS file.
                    return;
                }
                for (const fname of await fs.readdir(dest)) {
                    if (fname.endsWith('.html')) {
                        await fs.rename(path.join(dest, fname), path.join(dest, 'index.html'));
                        return;
                    }
                }
                throw new Error('no HTML found');
            }),
        },
    ],
});
