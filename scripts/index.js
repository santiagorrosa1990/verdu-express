$(document).ready(function () {

    var cartDatatable = null;
    //Duracion del efectito del boton flotante
    $('st-actionContainer').launchBtn({ openDuration: 200, closeDuration: 100 });

    getData();

    getAddresses("987654321");

    //postAddresses("987654321", [{"neighborhood":"Alberdi", "address":"Costanera 1234"}]);

    function getAddresses(facebookId) {
        var user_Id = "id=" + facebookId;
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

    function postAddresses(facebookId, jsonAddresses) {
        request = "id=" + facebookId + "&addresses=" + JSON.stringify(jsonAddresses);
        $.ajax({
            async: false,
            cache: false,
            method: "POST",
            url: "../model/user-post.php",
            data: request,
            success: function (data) {
                //console.log(data);
            },
            error: function () {
                //console.log("Error al obtener user-get.php");
            }
        });

    }

    $('.support').on('click', function () {
        var userAddress = getAddress();
        toastr.info("Domicilio: " + userAddress);
    });

    //FLOATING BUTTON
    $('.st-button-main').on('click', function () {
        var dataSet = getCartItems();
        var total = 0;
        dataSet.forEach(function (element) {
            total = total + element[2];
        });
        //console.log(total);
        drawCurrentCart(dataSet);
    });

    function getCartItems() {
        if (localStorage.cart != undefined) {
            return JSON.parse(localStorage.cart);
        } else {
            return [];
        }
    }

    function drawCurrentCart(dataSet) {
        if (cartDatatable == null) {
            cartDatatable = $('#cart').DataTable({
                data: dataSet,
                searching: false,
                paging: false,
                info: false,
                responsive: true,
                columns: [
                    { title: "Quitar" },
                    { title: "Articulo" },
                    { title: "Precio" },
                    { title: "Cantidad" }
                ]
            });
        } else {
            cartDatatable.clear().rows.add(dataSet).draw();
        }
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
                localStorage.data = JSON.stringify(data);
                buildCards(data);
            },
            error: function () {
                console.log("Error al cargar el listado");
            }
        });
        return false;
    }

    function buildCards(data) {
        var rowCount = 0;
        data.forEach(function (element) {
            rowCount = rowCount + 1;
            $(".container").find(".card-deck:last")
                .append(getCardTemplate(element.name, element.price, element.unit, element.key));
            if (rowCount == 3) {
                getCardDeckTemplate()
                rowCount = 0;
            }
        });
    }

    function getCardDeckTemplate() {
        $(' <div class="card-deck mb-3 text-center"> </div>').insertBefore('.deck-footer');
    }

    function getCardTemplate(name, price, unit, key) {
        var card = '<div id="' + key + '" class="card mb-4 shadow-sm">' +
            '<div class="card-header">' +
            '<h4 class="my-0 card-name" name="' + name + '" id="' + key + '" font-weight-normal">' + name + '</h4>' +
            '</div>' +
            '<div class="card-body">' +
            '<h1 id="' + key + '" price="' + price + '" unit="' + unit + '" class="card-title pricing-card-title">' + price + ' <small class="text-muted">/ ' + unit + '</small></h1>' +
            '<ul class="list-unstyled mt-3 mb-4">' +
            '<li>10 users included</li>' +
            '<li>2 GB of storage</li>' +
            '<li>Email support</li>' +
            '<li>Help center access</li>' +
            '</ul>' +
            '<div class="counter col-lg-2">' +
            '<div class="input-group">' +
            '<span class="input-group-btn">' +
            '<button type="button" id="' + key + '" class="quantity-left-minus btn btn-outline-dark btn-number"' +
            'data-type="minus" data-field="">' +
            '<i class="fa fa-minus fa-lg" aria-hidden="true"></i>' +
            '</button>' +
            '</span>' +
            '<input type="text" id="' + key + '" name="quantity" class="form-control input-number"' +
            'value="0" min="1" max="100">' +
            '<span class="input-group-btn">' +
            '<button type="button" id="' + key + '" class="quantity-right-plus btn btn-outline-dark btn-number"' +
            ' data-type="plus" data-field="">' +
            '<i class="fa fa-plus fa-lg" aria-hidden="true"></i>' +
            '</button>' +
            '</span>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>'

        return card;
    }

    //////ADD REMOVE BUTTONS///////

    $(document).on('click', '.quantity-right-plus', function (e) {
        var key = $(this).attr('id');
        var quantity = parseInt($('input', '#' + key).val());
        if (quantity < 50) {
            $('input', '#' + key).val(quantity + 1);
            quantity = parseInt($('input', '#' + key).val());
        }
        addOrUpdateToCart(key, quantity);
        return false;
    });

    $(document).on('click', '.quantity-left-minus', function () {
        var key = $(this).attr('id');
        var quantity = parseInt($('input', '#' + key).val());
        if (quantity > 0) {
            $('input', '#' + key).val(quantity - 1);
            quantity = parseInt($('input', '#' + key).val());
        }
        addOrUpdateToCart(key, quantity);
        return false;
    });

    function getRedCrossIcon(key){
        //la key es para asignarle el producto a la cruz
        return '<i class="fa fa-shopping-cart fa-lg cart-item" aria-hidden="true"></i>';
    }

    function addOrUpdateToCart(key, quantity) {
        var currentCart;
        itemToBeAdded = [
            getRedCrossIcon(key),
            $('.card-name', '#' + key).attr('name'),
            $('.pricing-card-title', '#' + key).attr('price'),
            quantity
        ]
        if (localStorage.cart == undefined) {
            currentCart = [];
            currentCart.push = itemToBeAdded;
        } else {
            var present = false;
            currentCart = JSON.parse(localStorage.cart);
            currentCart.forEach(function (element) {
                if (itemToBeAdded[1] === element[1]) {
                    //Si ya existe el item en el carrito, sólo actualizo el precio y la cantidad
                    element[2] = itemToBeAdded[2];
                    element[3] = itemToBeAdded[3];
                    present = true;
                }
            });
            if (!present) {
                currentCart.push(itemToBeAdded);
            }
        }
        console.log(currentCart);
        localStorage.cart = JSON.stringify(currentCart);
    }

});