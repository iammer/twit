$(() => {
    const socket = io('/',() => socket.emit('ready'));

    function displayMessage(msg) {
        $('<div>').text(`${msg.time} -- ${msg.from} -- ${msg.msg}`)
            .addClass('message')
            .appendTo($('#messages'));
    }

    socket.on('message', displayMessage);
    socket.on('initial', msgs => msgs.forEach(displayMessage));

    $('#sendMessage').on('click', () => {
        const text = $('#newMessage').val();
        const name = window.location.pathname.substr(1);
        if (text.length <= 11) {
            $('#error').hide();
            socket.emit('message', { from: name, msg: text });
            $('#newMessage').val('');
        } else {
            $('#error').show();
        }
    });
});
