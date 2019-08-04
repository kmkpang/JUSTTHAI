<?php
    header("Access-Control-Allow-Origin: *");
    function connection(){
        $hostName = 'localhost';
        $dbUserName = 'id10331729_justthai';
        $dbPassword = 'P@ng220439';
        $databaseName = 'id10331729_justthai';
    
        try{
            $dbHandler = new PDO('mysql:host='. $hostName . ';dbname='. $databaseName, $dbUserName, $dbPassword);
    
            return $dbHandler;
        }
        catch(PDOException $ex){
            echo $e->getMessage();
        }
    }
?>