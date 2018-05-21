// Utility functions
module.exports = {
    // Format HTTP response
    handleResponse: (cb, code, body) => cb(null, {
        statusCode: code,
        headers: {
            'Access-Control-Allow-Credentials': true,
            'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
            statusCode: code,
            result: body,
        }),
    }),
};
