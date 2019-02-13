$(document).ready(function () {

    getData();

    function getData() {
        $.ajax({
            method: "POST",
            url: "./model/logic.php",
            success: function (data) {
                console.log(data);
            },
            error: function () {
                console.log("Error ajax logic.php");
            }
        });
        return false;
    }


});