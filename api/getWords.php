<?php
    header("Access-Control-Allow-Origin: *");
    include 'connection.php';
    $db = connection();

    $result  = '';

    try{
        $id = $_GET['id'];
        $sql = "SELECT w.id, w.thai, w.english, w.transliteration FROM words w LEFT join status s on w.id = s.word_id where s.id IS NUll";
        $result = $db ->query($sql)->fetchAll();
    }
    catch(PDOException $ex){
        echo $e->getMessage();
    }

    echo json_encode($result);
?>