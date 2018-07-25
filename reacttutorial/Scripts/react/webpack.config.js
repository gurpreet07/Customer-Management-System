module.exports = {
    context: __dirname,
    entry: {
        customer: './ReactScripts/Customer.js',
        product: './ReactScripts/Product.js',
        sale: './ReactScripts/Sale.js',
        store: './ReactScripts/Store.js',
    },
    watch: true,
    mode: 'development',
    output: {
        path: __dirname + "/dist",
        filename: "[name].bundle.js"
    },
    module : {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets : ['babel-preset-env', 'babel-preset-react']
                    }
                }
            }
        ]
    }
}