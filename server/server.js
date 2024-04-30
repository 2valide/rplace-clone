
const server = require('http').createServer();
const next = require('next');
const app = next({ dev: process.env.NODE_ENV !== 'production' });
const handle = app.getRequestHandler();
const io = require('socket.io')(server);

app.prepare().then(() => {
    server.on('request', (req, res) => {
        return handle(req, res);
    });

    io.on('connection', socket => {
        console.log('Client connected');

        socket.on('update_pixel', data => {
            // Réémettre les changements de pixel à tous les clients sauf à l'initiateur
            socket.broadcast.emit('pixel_updated', data);
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });
    });

    server.listen(3000, () => {
        console.log('Server running on http://localhost:3000');
    });
});
