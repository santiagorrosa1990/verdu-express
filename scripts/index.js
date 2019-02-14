$(document).ready(function () {

    getData();

    function getData() {
        $.ajax({
            method: "GET",
            url: "./scripts/data.json",
            success: function (data) {
                buildCards(data);
            },
            error: function () {
                console.log("Error ajax logic.php");
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