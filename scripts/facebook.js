window.fbAsyncInit = function () {
    FB.init({
        appId: '345256212743918',
        cookie: true,
        xfbml: true,
        version: 'v3.2'
    });

    FB.getLoginStatus(function (response) {
        if (response.status == "connected") {
            toastr.success('Bienvenido');
            console.log("Sesion iniciada");
        } else {
            $('.facebook-btn').css('visibility', 'visible');
            console.log("Sesion no iniciada");
        }
    });

    FB.AppEvents.logPageView();

};


$('.facebook-btn').on('click', function () {
    FB.login(function (response) {
        console.log("Sesion iniciada");
        $('.facebook-btn').css('visibility', 'hidden');
        // Handle the response object, like in statusChangeCallback() in our demo
        // code.
    });

});



(function (d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) { return; }
    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));


