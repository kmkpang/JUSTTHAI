<?php
    header("Access-Control-Allow-Origin: *");
    function connection(){
        $hostName = 'localhost';
        $dbUserName = 'id17413431_kmkpang';
        $dbPassword = 'KMKp@ng205929';
        $databaseName = 'id17413431_justthai';
        // KMKp@ng205929
    
        try{
            $dbHandler = new PDO('mysql:host='. $hostName . ';dbname='. $databaseName, $dbUserName, $dbPassword);
    
            return $dbHandler;
        }
        catch(PDOException $ex){
            echo $e->getMessage();
        }
    }
?>