<?php
    header("Access-Control-Allow-Origin: *");
    include 'connection.php';
    $db = connection();

    $result  = '';

    try{
        $user_id = $_POST['user_id'];
        $words_id = $_POST['words_id'];
        $sql = "INSERT INTO status (word_id, user_id)
                VALUES ($words_id,$user_id)";
        $result = $db->query($sql);
    }
    catch(PDOException $ex){
        echo $e->getMessage();
    }

    echo json_decode('{status : success}');
?>