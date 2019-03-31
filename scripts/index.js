$(document).ready(function () {

    var cartDatatable = null;
    //Duracion del efectito del boton flotante
    $('st-actionContainer').launchBtn({ openDuration: 200, closeDuration: 100 });
    toastr.info("Bienvenido", "Hola");
    getProductData();


    function getUserData() {
        var sessionId = localStorage.data;
        var addressData = null;
        $.ajax({
            async: false,
            cache: false,
            method: "POST",
            url: "../model/user-get.php",
            data: sessionId,
            success: function (data) {
                data = data.replace(/\n/g, '').trim();
                if (data != 'no_data') {
                    addressData = JSON.parse(data);
                }
            },
            error: function () {
                console.log("Error al obtener user-get.php del id: " + sessionId);
            }
        });
        return addressData;
    }

    function postAddresses(phone, userData) {
        request = "id=" + phone + "&data=" + JSON.stringify(userData);
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
        dataSet = toDatatableFormat(dataSet);
        // var total = 0;
        // dataSet.forEach(function (element) {
        //     total = total + element[2];
        // });
        // console.log(total);
        drawCurrentCart(dataSet);
    });

    function toDatatableFormat(dataSet) {
        var datatablesArray = [];
        var array;
        Object.keys(dataSet).forEach(function (key) {
            array = [
                dataSet[key][0],
                dataSet[key][1],
                dataSet[key][2],
                dataSet[key][3],
            ]
            datatablesArray.push(array);
        })
        return datatablesArray;
    }

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
                autoWidth: true,
                searching: false,
                paging: false,
                scrollY: "130px",
                scrollCollapse: true,
                info: false,
                responsive: true,
                columns: [
                    { "title": "", "width": "10%", "orderable": false },
                    { "title": "Art.", "width": "50%" },
                    { "title": "Precio", "width": "30%" },
                    { "title": "Cant.", "width": "10%" }
                ]
            });
        } else {
            cartDatatable.clear().rows.add(dataSet).draw();
        }
    }

    function getProductData() {
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
            $(".decks-container").find(".card-deck:last")
                .append(getCardTemplate(element.name, element.price, element.unit, element.key, element.image));
            if (rowCount == 3) {
                addCardDeckTemplate();
                rowCount = 0;
            }
        });
    }

    $('.product-toggle').on('click', function () {
        var type = $(this).attr('id');
        filterCardsBy(type);
    });

    function filterCardsBy(type) {
        var rowCount = 0;
        resetDecksContainer();
        var data = JSON.parse(localStorage.data);
        data.forEach(function (element) {
            rowCount = rowCount + 1;
            if (element.type == type) {
                $(".decks-container").find(".card-deck:last")
                    .append(getCardTemplate(element.name, element.price, element.unit, element.key, element.image));
                if (rowCount == 3) {
                    addCardDeckTemplate();
                    rowCount = 0;
                }
            }
        });
    }

    function resetDecksContainer() {
        $('.decks-container').html('');
        addCardDeckTemplate();
    }

    function addCardDeckTemplate() {
        //$(' <div class="card-deck mb-3 text-center"> </div>').insertBefore('.deck-footer');
        $('.decks-container').append('<div class="card-deck mb-3 text-center"> </div>');
    }

    function getCardTemplate(name, price, unit, key, image) {
        var card = '<div id="' + key + '" class="card mb-4 shadow-sm">' +
            '<div class="card-header">' +
            '<h4 class="my-0 card-name" name="' + name + '" id="' + key + '">' + name + '</h4>' +
            '</div>' +
            '<div class="card-body">' +
            '<h1 id="' + key + '" price="' + price + '" unit="' + unit + '" class="card-title pricing-card-title">' + price + ' <small class="text-muted">/ ' + unit + '</small></h1>' +
            '<img src="./images/' + image + '" id="item-image">' +
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
        // onerror="javascript:this.src=\'./images/noimage.png\'"
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
        hideShowCart();
        return false;
    });

    function hideShowCart() {
        //Chequeo si tabla del carrito se esta viendo
        if ($('.st-panel').css('display') == 'block') {
            $('.st-button-main').click();
            var millisecondsToWait = 350;
            setTimeout(function () {
                $('.st-button-main').click();
            }, millisecondsToWait);
        }
    }

    $(document).on('click', '.quantity-left-minus', function () {
        var key = $(this).attr('id');
        var quantity = parseInt($('input', '#' + key).val());
        if (quantity > 0) {
            $('input', '#' + key).val(quantity - 1);
            quantity = parseInt($('input', '#' + key).val());
        }
        addOrUpdateToCart(key, quantity);
        hideShowCart();
        return false;
    });

    function getRedCrossIcon(key) {
        //la key es para asignarle el producto a la cruz
        return '<i class="fa fa-times redcross" id="' + key + '" aria-hidden="true"></i>';
    }

    $('#cart').on('click', '.redcross', function () {
        var key = $(this).attr('id');
        removeFromCart(key);
    });

    function removeFromCart(key) {
        console.log("Borrando " + key)
        if (localStorage.cart != undefined) {
            var currentCart = JSON.parse(localStorage.cart);
            delete currentCart[key];
            localStorage.cart = JSON.stringify(currentCart);
            refreshCart(currentCart);
        }
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
            currentCart = {};
            currentCart[key] = itemToBeAdded;
            console.log(JSON.stringify(currentCart.key));
        } else {
            currentCart = JSON.parse(localStorage.cart);
            currentCart[key] = itemToBeAdded;
            console.log(JSON.stringify(currentCart.key));
            if (currentCart[key] == null) {
                //Inserto nuevo
                currentCart[key] = itemToBeAdded;
            } else {
                //Actualizo
                currentCart[key][2] = itemToBeAdded[2];
                currentCart[key][3] = itemToBeAdded[3];
            }
        }
        console.log(currentCart);
        localStorage.cart = JSON.stringify(currentCart);
    }

    function refreshCart(dataSet) {
        dataSet = toDatatableFormat(dataSet);
        drawCurrentCart(dataSet);
    }

    $('.st-panel').on('click', '.order-button', function () {
        console.log("order-button");
        showAddressModal();
        sendOrderMail();
    });

    $('.st-panel').on('click', '.addresses-button', function () {
        showAddressesModal();
    });

    $('#save-address-btn').on('click', function () {
        var phone = $('#user-phone-input').val();
        var neighborhood = $('#user-neighborhood-input').val();
        var address = $('#user-address-input').val();
        var userName = $('#user-name-input').val();
        //Por ahora mantenemos todo en localstorage
        //postAddresses(phone, [{ "neighborhood": neighborhood, "address": address, "user_name": userName, "phone": phone }]);
        localStorage.user_data = JSON.stringify([{ "neighborhood": neighborhood, "address": address, "user_name": userName, "phone": phone }]);
        console.log("Guardado");
    });

    function showAddressesModal() {
        var userData = null;
        if (localStorage.user_data != undefined) {
            userData = JSON.parse(localStorage.user_data);
            //var addressData = getUserData();
        }
        if (userData != null) {
            $('#user-phone-input').val(userData[0].phone);
            $('#user-name-input').val(userData[0].user_name);
            $('[id=user-neighborhood-input] option').filter(function () {
                return ($(this).text() == userData[0].neighborhood);
            }).prop('selected', true);
            $('#user-address-input').val(userData[0].address);
        }
        $('.st-button-main').click();
        $('#addresses-modal').modal();
    }

    function buildOrderData() {
        return JSON.stringify(localStorage.cart);
    }

    function sendOrderMail() {
        $.ajax({
            method: "POST",
            url: "../model/email.php",
            data: "order=" + buildOrderData(),
            success: function (data) {
                console.log(data);
            },
            error: function () {
                toastr.error("Servidor ocupado, intente nuevamente", "Error");
            }
        });
    }

});