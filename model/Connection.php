<?php 
class Connection {    
    static $mysqli;
    static $conexion;
    static $resultset;
    public static function conectar(){     
        
        $user = "id2833154_santiagorrosa";
        $pass = "Tato1432";
        $server = "localhost";
        $db = "id2833154_priotti";
        
        //Comentario
    
        self::$mysqli = new mysqli($server, $user, $pass, $db);
        if (self::$mysqli->connect_errno) {            
            echo "Erro de conexion a la base de datos";       
            
        }
        return self::$mysqli;
    } 
    public static function get($query){
        //Nuevo metodo que reemplaza a "conectar()"
        self::$conexion = self::conectar();
        self::$resultset = self::$conexion->query($query);         
        if( self::$resultset->num_rows < 1){                     
            return false;
        } 
        //$resultset->free();          
        //$conexion->close();               
        return self::$resultset;
    }
    public static function set($query){
        self::$conexion = self::conectar();
        self::$conexion->query($query);        
        self::$conexion->close();               
    }
    public static function cerrar(){
        self::$resultset->free(); 
        self::$conexion->close();
    }
    
} 
?> 


