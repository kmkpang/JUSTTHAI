<?php
    header("Access-Control-Allow-Origin: *");
    include 'connection.php';
    $db = connection();

    $result  = '';

    try{
        $id = $_GET['id'];
        $sql = "SELECT * FROM words where id NOT IN (SELECT s.word_id from status s WHERE s.user_id = $id and s.game_id = 1)";
        $result = $db ->query($sql)->fetchAll();
    }
    catch(PDOException $ex){
        echo $e->getMessage();
    }

    echo json_encode($result);
?>