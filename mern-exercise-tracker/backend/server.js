const http = require('http');
const app = require('./app');

const normalizePort = val => {
    const port = parseInt(val, 10);
    
    if(isNaN(port))
        return val;
    
    if (port >= 0)
        return port;

    return false;
}

const port = normalizePort(process.env.PORT || 5000);

app.set('port', port);

const normalizeAddress = address => {
    const bind = typeof address === 'string' ? 'bind ' + address : 'port ' + port;
    return bind;
}

const server = http.createServer(app);

const handleError = error => {
    if (error.syscall() !== 'listen')
        throw error;

    const bind = normalizeAddress(server.address());

    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires higher privilege');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

server.on('error', handleError);
server.on('listening', () => {
    const bind = normalizeAddress(server.address());
    console.log('Listening on ' + bind);
});

server.listen(port);