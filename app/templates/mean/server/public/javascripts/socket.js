var socket = io.connect('http://nodejs-restoapp.rhcloud.com/');
  socket.on('news', function (data) {
    console.log(data);
    socket.emit('my other event', { my: 'data' });
  });