$(document).ready(function () {

    /////Cosas que se lanzan automaticamente al cargar la pagina

    //Duracion del efectito del boton flotante
    $('st-actionContainer').launchBtn({ openDuration: 200, closeDuration: 100 });

    getData();

    var dataSet = [
        ["Banana", "$55,20", "2"],
        ["Pomelo Rosado", "70,00", "2"],
        ["Maracuyá", "62,00", "1"]
    ]

    $('.cart').DataTable({
        data: dataSet,
        searching: false,
        paging: false,
        info: false,
        responsive: true,
        columns: [
            { title: "Articulo" },
            { title: "Precio" },
            { title: "Cantidad" }
        ]
    });

    /////////////////

    $('.support').on('click', function () {
        var userAddress = getAddress();
        toastr.info("Domicilio: " + userAddress);
    });

    $('.st-button-main').on('click', function () {
        console.log("Boton flotante clickeado");
        $('#current-cart').html(localStorage.cart);
    });


    function getAddress() {
        var userAddress;
        $.ajax({
            async: false, //Ver de usar un wait
            cache: false,
            method: "GET",
            url: "./data/users.json",
            dataType: "json",
            success: function (data) {
                FB.getLoginStatus(function (response) {
                    if (response.status == "connected") {
                        var id = response.authResponse.userID;
                        userAddress = data[id].address;
                    } else {
                        console.log("No hay dirección");
                        userAddress = "No cargada";
                    }
                });
            },
            error: function () {
                console.log("Error al cargar el listado");
            }
        });
        return userAddress;
    }

    function getData() {
        $.ajax({
            cache: false,
            method: "GET",
            url: "./data/items.json",
            success: function (data) {
                buildCards(data);
            },
            error: function () {
                console.log("Error al cargar el listado");
            }
        });
        return false;
    }

    function buildCards(data) {
        var count = 0;
        data.forEach(function (element) {
            $(".container").find(".card-deck:last").append(getCardTemplate(element.name, element.price, element.unit));
            count = count + 1;
            if (count == 3) {
                getCardDeckTemplate()
                count = 0;
            }
        });
    }

    function getCardDeckTemplate() {
        $(' <div class="card-deck mb-3 text-center"> </div>').insertBefore('.deck-footer');
    }

    function getCardTemplate(name, price, unit) {
        var card = '<div class="card mb-4 shadow-sm">' +
            '<div class="card-header">' +
            '<h4 class="my-0 font-weight-normal">' + name + '</h4>' +
            '</div>' +
            '<div class="card-body">' +
            '<h1 class="card-title pricing-card-title">' + price + ' <small class="text-muted">/ ' + unit + '</small></h1>' +
            '<ul class="list-unstyled mt-3 mb-4">' +
            '<li>10 users included</li>' +
            '<li>2 GB of storage</li>' +
            '<li>Email support</li>' +
            '<li>Help center access</li>' +
            '</ul>' +
            '<button type="button" class="btn btn-lg btn-block btn-outline-primary">Sign up for free</button>' +
            '</div>' +
            '</div>'

        return card;
    }
});