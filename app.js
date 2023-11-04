const express = require("express"),
    app = express()
    http = require("http").createServer(app)
    io = require("socket.io")(http)

const host = '127.0.0.1'
const port = 3000

let clients = []

io.on('connection', (socket) => {
    console.log(`Client with id ${socket.id} connected`)
    clients.push(socket.id)
    socket.emit('message', "I'm server")
    socket.on('message', (message) => console.log('Message: ', message))
    socket.on('disconnect', () => {
        clients.splice(clients.indexOf(socket.id), 1);
        console.log(`Client with id ${socket.id} disconnected`)
    })
})

app.use(express.static(__dirname))

app.get('/', (req, res) => res.render('index'))

// get count activity client
app.get('/clients-count', (req, res) => {
    res.json({
        count: io.clients().server.engine.clientsCount,
    })
})

// send messages to client id
app.post('/client/:id', (req, res) => {
    if (clients.indexOf(req.params.id) !== -1) {
        io.sockets.connected[req.params.id].emit(
            'private message',
            `Message to client with id ${req.params.id}`
        );
        return res.status(200).json({
            message: `Message was sent to client with id ${req.params.id}`,
        });
    }

    else {
        return res
            .status(404)
            .json({ message: 'Client not found' });
    }
})

http.listen(port, host, () => console.log(`Server listens http://${host}:${port}`))