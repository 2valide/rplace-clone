
// const server = require('http').createServer();
// const next = require('next');
// const app = next({ dev: process.env.NODE_ENV !== 'production' });
// const handle = app.getRequestHandler();
// const io = require('socket.io')(server);

// app.prepare().then(() => {
//     server.on('request', (req, res) => {
//         return handle(req, res);
//     });

//     io.on('connection', socket => {
//         console.log('Client connected');

//         socket.on('update_pixel', data => {
//             // Réémettre les changements de pixel à tous les clients sauf à l'initiateur
//             socket.broadcast.emit('pixel_updated', data);
//         });

//         socket.on('disconnect', () => {
//             console.log('Client disconnected');
//         });
//     });

//     server.listen(3000, () => {
//         console.log('Server running on http://localhost:3000');
//     });
// });

const { createServer } = require('http');
const next = require('next');
const { parse } = require('url');
const { Server } = require("socket.io");

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const server = createServer((req, res) => {
        const parsedUrl = parse(req.url, true);

        // Handle Socket.IO connections manually
        if (parsedUrl.pathname.startsWith('/socket.io')) {
            io.attach(server, {
                handlePreflightRequest: (req, res) => {
                    const headers = {
                        "Access-Control-Allow-Headers": "Content-Type, Authorization",
                        "Access-Control-Allow-Origin": req.headers.origin, //or the specific origin you want to give access to,
                        "Access-Control-Allow-Credentials": true
                    };
                    res.writeHead(200, headers);
                    res.end();
                }
            });
            return;
        }

        // Default Next.js handler
        handle(req, res, parsedUrl);
    });

    const io = new Server(server, {
        // Options if any
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
