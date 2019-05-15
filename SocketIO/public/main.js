let socket = io.connect('http://localhost:4000');

const messages = document.getElementById('messages');
const newmessage = document.getElementById('new-message');

socket.on('message', function(data){
    messages.innerHTML=data.msg;
});

function typing(){
    socket.emit('message', {
        msg: newmessage.value
    });
}