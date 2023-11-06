const WebSocket = require('ws')
const server = new WebSocket.Server({ port: 8080 })
let array = []
var enc = new TextDecoder("utf-8")

server.on('connection', function connection(ws) {
  console.log('Client connected!')

  ws.on('message', function (message) {
    var arr = new Uint8Array(message)
    array.push("Имя: "+enc.decode(arr))
    console.log(array)
    ws.send(JSON.stringify(array).replace(",", "").replace("'", ""))
  })
})