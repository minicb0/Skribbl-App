const socket = io('http://localhost:5000', { transports: ['websocket'] });

// chat
const messageInput = document.getElementById('messageInput');
const messageContainer = document.getElementById("messageContainer")
const sendContainer = document.getElementById('sendContainer');
const currentuser = document.getElementById('currentuser');
const currentteam = document.getElementById('currentteam');
const scroll = document.getElementById('chatAll');

socket.on('chat-message', data => {
    scroll.scrollTop + scroll.clientHeight === scroll.scrollHeight;

    const element = `<li style="background-color: #8bf2f7; color: #048187; width: 70%; float: left; margin: 3px;"> <strong>Opponent: </strong> ${data.message}</li> `
    messageContainer.insertAdjacentHTML('beforeend', element)

    scrollToBottom();
})

sendContainer.addEventListener('submit', (event) => {
    event.preventDefault();

    const message = messageInput.value
    if (message != '') {
        scroll.scrollTop + scroll.clientHeight === scroll.scrollHeight;

        const element = `<li style="background-color: #77f77f; color: #03a80e; width: 70%; float: right; margin: 3px;"> <strong>You: </strong> ${message}</li> `
        messageContainer.insertAdjacentHTML('beforeend', element)
        socket.emit('send-chat-message', message)

        scrollToBottom();

        messageInput.value = ''
    }
})

document.addEventListener('keyup', (event) => {
    if (event.keyCode == 13) {
        event.preventDefault();

        const message = messageInput.value
        if (message != '') {
            scroll.scrollTop + scroll.clientHeight === scroll.scrollHeight;

            const element = `<li style="background-color: #77f77f; color: #03a80e; width: 70%; float: right; margin: 3px;"> <strong>You: </strong> ${message}</li> `
            messageContainer.insertAdjacentHTML('beforeend', element)
            socket.emit('send-chat-message', message)

            scrollToBottom();

            messageInput.value = ''
        }
    }
})

function scrollToBottom() {
    scroll.scrollTop = scroll.scrollHeight;
}
scrollToBottom();

// canvas
const canvas = document.getElementById("canvas");
ctx = canvas.getContext('2d');
canvas.width = innerWidth/1.5;
canvas.height = 450;

// declaring variables
var color = document.getElementById('color')

// variables
var painting = false;

function startPosition() {
    painting = true;
}

function finishedPosition() {
    painting = false;
}

canvas.addEventListener('mousedown', () => {
    startPosition();
})

canvas.addEventListener('mouseup', () => {
    finishedPosition();
    ctx.beginPath();
})

canvas.addEventListener('mousemove', (e) => {
    if (painting == false) {
        return;
    } else {
        x = e.offsetX
        y = e.offsetY
        // console.log(x)
        ctx.lineWidth = 2;
        ctx.strokeStyle = color.value
        ctx.lineTo(x, y)
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y)

        var position = {
            x: x,
            y: y,
            color: color.value
        }
        // console.log(position)
        socket.emit('canvas', position)
    }
})

socket.on('canvas-draw', data => {
    // console.log(data.position)
    ctx.lineWidth = 2;
    ctx.strokeStyle = data.position.color
    ctx.lineTo(data.position.x, data.position.y)
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(data.position.x, data.position.y)
})

// resize browser
addEventListener('resize', () => {
    canvas.width = innerWidth / 1.5;
    canvas.height = 450;
});