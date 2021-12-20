const chatForm = document.getElementById('chat-form')
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const usersList = document.getElementById('users');

//username and room id
const {username,room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

const socket = io();
console.log(room);
socket.emit('joinRoom',{username,room});

socket.on('roomUsers',({room,users}) => {
    outputRoomName(room);
    outputUsers(users);
    console.log(room,users);
})

socket.on('message', message => {
    console.log(message);
    outputMessage(message);

    //scrolling
    chatMessages.scrollTop = chatMessages.scrollHeight;
})

chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    //obtaining message
    const msg = e.target.msg.value;

    //sending message to server
    socket.emit('chatMessage',msg);

    //clear input
    e.target.msg.value='';
    e.target.msg.focus();
});

const outputMessage = (message) => {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
						<p class="text">
							${message.text}
						</p>`
    document.querySelector('.chat-messages').appendChild(div);
}

function outputRoomName(room){
    roomName.innerHTML = room;
}

function outputUsers(users){
    usersList.innerHTML = `
        ${users.map(user => `<li>${user.username}</li>`).join('')}
    `
}

document.getElementById('leave-btn').addEventListener('click', () => {
  const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
  if (leaveRoom) {
    window.location = '../index.html';
  } else {
  }
});
