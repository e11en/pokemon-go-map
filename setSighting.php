<?php
include_once('db.php');
include_once('functions.php');

if(isset($_POST['pokemon']) && isset($_POST['type']) && isset($_POST['latitude']) && isset($_POST['longitude']) && isset($_POST['name'])){
    echo json_encode(setSighting());
}

?>





