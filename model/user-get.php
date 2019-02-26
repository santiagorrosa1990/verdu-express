<?php
include_once "Connection.php";

$id = $_POST["id"];

$query = "SELECT addresses FROM Users WHERE id = '$id'";
$conexion = Connection::conectar();
try {
    $resultset = $conexion->query($query);
    if ($resultset->num_rows != 0) {
        while ($row = $resultset->fetch_assoc()) {
            $json = $row["addresses"];
        }
    } else {
        echo '{"address" : "no"}';
    }
} catch (Exception $e) {
    echo "Ha ocurrido una excepcion en user-get";
};

$resultset->free();

$conexion->close();
echo $json;
