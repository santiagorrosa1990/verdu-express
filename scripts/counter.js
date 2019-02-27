$(document).ready(function () {

    var quantity = 0;
    $('.quantity-right-plus').on('click', function (e) {



        e.preventDefault();
        var key = $(this).attr('id');
        console.log(JSON.stringify(key));
        var quantity = parseInt($('input', '#' + key).val());

        quantity = $('input', '#' + key).val(quantity + 1);

        return false;
    });

    $('.quantity-left-minus').on('click', function (e) {



        e.preventDefault();
        var key = $(this).attr('id');
        console.log(JSON.stringify(key));
        var quantity = parseInt($('input', '#' + key).val());

        quantity = $('input', '#' + key).val(quantity - 1);
        return false;

    });
});