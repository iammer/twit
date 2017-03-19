$(() => {
    const socket = io();

    function formatDate(d) {
        return new Date(d).toLocaleString();
    }

    function displayMessage(msg) {
        $('<div>').addClass('message')
            .append($('<div>').addClass('date').text(formatDate(msg.time)))
            .append($('<div>').addClass('name').text(msg.from))
            .append($('<div>').addClass('message-text').text(msg.msg))
            .prependTo($('#messages'));
    }

    function sendMessage() {
        const text = $('#newMessage').val();
        const name = window.location.pathname.substr(1);
        if (text.length <= 11) {
            $('#error').hide();
            socket.emit('message', { from: name, msg: text });
            $('#newMessage').val('');
        } else {
            $('#error').show();
        }
    }

    socket.on('message', displayMessage);

    $('#sendMessage').on('click', sendMessage);
    $('#newMessage').on('keypress', e => {
        if (e.which === 13) {
            sendMessage();
            return false;
        }
        return true;
    });

    $.getJSON('/messages', msgs => msgs.forEach(displayMessage));
});
