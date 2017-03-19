$(() => {
    $('#user').on('keypress', e => {
        if (e.which === 13) {
            const name = $('#user').val();
            if (name.length <= 3) {
                window.location = '/' + name;
            } else {
                $('#error').show();
            }
            return false;
        }
        return true;
    });
});
