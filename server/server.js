const express = require('express');
const http = require('http');
const next = require('next');
const socketIo = require('socket.io');

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const server = express();
    const httpServer = http.createServer(server);
    const io = socketIo(httpServer);

    io.on('connection', socket => {
        console.log('A user connected');

        socket.on('disconnect', () => {
            console.log('User disconnected');
        });
    });

    server.all('*', (req, res) => {
        return handle(req, res);
    });

    httpServer.listen(port, (err) => {
        if (err) throw err;
        console.log(`> Ready on http://localhost:${port}`);
    });
});
