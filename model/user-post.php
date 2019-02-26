<?php
include_once "Connection.php";

$id = $_POST["id"];
$addresses = $_POST["addresses"];
try {
$query = "INSERT INTO Users(id, addresses) VALUES ('$id','$addresses')";

$conexion = Connection::conectar();
$conexion->query($query);
$conexion->close();

} catch (Exception $e) {
    echo "Ha ocurrido una excepcion en user-post";
};

echo "Insert Ok";
