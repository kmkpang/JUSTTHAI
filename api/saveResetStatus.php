<?php
    header("Access-Control-Allow-Origin: *");
    include 'connection.php';
    $db = connection();
    $result  = '';

    try{
        $user_id = $_POST['user_id'];
        $sql = "DELETE FROM status WHERE user_id = $user_id";
        $result = $db->query($sql);
    }
    catch(PDOException $ex){
        echo $e->getMessage();
    }

    echo json_decode('{status : success}');
?>