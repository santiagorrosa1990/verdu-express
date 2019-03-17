<?php
    $admin_email = "santiagorrosa2@gmail.com";       
    //$email = $_REQUEST['email'];
    $email_exp = '/^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/'; 
    // if(!preg_match($email_exp,$email)) {           
    //   return 'La dirección de correo proporcionada no es válida.';           
    // }
    //$subject = 'Consulta de '.$_REQUEST['nombre'];      
    $comment = $_REQUEST['order'];      
    // $comment = $_REQUEST['mensaje']."\r\n".'Telefono: '.$_REQUEST['telefono']
    // ."\r\n".'Email: '.$_REQUEST['email'];
    //send email
    mail($admin_email, "Subject", $comment, "From:" . "verdu-express@verdu-express.com");
    //Email response
    echo "Gracias por contactarnos! <br> En breve nos comunicaremos";
