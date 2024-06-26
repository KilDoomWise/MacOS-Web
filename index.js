// Load necessary modules
var cors_proxy = require('cors-anywhere');

// Define host and port
var host = process.env.HOST || '0.0.0.0';
var port = process.env.PORT || 8080;

// Create CORS Anywhere server with options
cors_proxy.createServer({
    originWhitelist: [], // Allow all origins
    requireHeader: [], // Remove header requirements
    removeHeaders: ['cookie', 'cookie2'], // Remove cookies to avoid leakage
    corsMaxAge: 1728000,
    setHeaders: {
        'X-Frame-Options': 'ALLOWALL' // Set to 'ALLOWALL' to attempt bypassing
    },
}).listen(port, host, function() {
    console.log('Running CORS Anywhere on ' + host + ':' + port);
});
