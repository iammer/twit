$(() => {
    $('#login').on('click', () => {
        const name = $('#user').val();
        if (name <= 3) {
            window.location = '/' + name;
        } else {
            $('#error').show();
        }
    });
});
