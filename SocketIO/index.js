const express = require('express');
const socketio = require('socket.io');

const app = express();

let server = app.listen(4000, function(){
    console.log('listning on port 4000');
});

app.use(express.static('public'));

const io = socketio(server);

io.on('connection', function(socket){
    console.log('new connection was made ID = ', socket.id);
    socket.on('message', function(data){
        io.sockets.emit('message', {
            msg: data.msg
        });
    })
});
