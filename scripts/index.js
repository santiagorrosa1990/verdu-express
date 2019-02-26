$(document).ready(function () {

    
    var cartDatatable = null;
    //Duracion del efectito del boton flotante
    $('st-actionContainer').launchBtn({ openDuration: 200, closeDuration: 100 });

    getData();

    getAddresses("987654321");

    //postAddresses("987654321", [{"neighborhood":"Alberdi", "address":"Costanera 1234"}]);

    function getAddresses(facebookId){
        var user_Id = "id="+facebookId;
        $.ajax({
            async: false, 
            cache: false,
            method: "POST",
            url: "../model/user-get.php",
            data: user_Id,
            success: function (data) {
                console.log(JSON.parse(data));
            },
            error: function () {
                console.log("Error al obtener user-get.php");
            }
        });

    }

    function postAddresses(facebookId, jsonAddresses){
        request = "id="+facebookId+"&addresses="+JSON.stringify(jsonAddresses);
        $.ajax({
            async: false, 
            cache: false,
            method: "POST",
            url: "../model/user-post.php",
            data: request,
            success: function (data) {
                console.log(data);
            },
            error: function () {
                console.log("Error al obtener user-get.php");
            }
        });

    }

    $('.support').on('click', function () {
        var userAddress = getAddress();
        toastr.info("Domicilio: " + userAddress);
    });

    $('.st-button-main').on('click', function () {
        console.log("Boton flotante clickeado");
        //getCartItems();
        var dataSet = [
            ["Banana", "$55", 2],
            ["Pomelo Rosado", "70", 2],
            ["Maracuyá", "62", 2],
            ["Cañamo", "50", 2]
        ]
        var total = 0;
        dataSet.forEach(function (element) {
            total = total + element[2];
        });
        console.log(total);
        drawCurrentCart(dataSet);
    });

    function drawCurrentCart(dataSet) {
        $('#cart').DataTable({
            data: dataSet,
            searching: false,
            paging: false,
            info: false,
            responsive: true, //Importa datatables responsive
            columns: [
                { title: "Articulo" },
                { title: "Precio" },
                { title: "Cantidad" }
            ]
        });
    }

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