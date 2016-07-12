<?php

include_once('db.php');

if(isset($_POST['pokemon']) && isset($_POST['area']) && isset($_POST['latitude']) && isset($_POST['longitude']) && isset($_POST['name'])){
    try{
        $pdo = getPDO();
        $stmt = $pdo->prepare("INSERT INTO sighting (pokemonId, area, latitude, longitude, name) VALUES (:pokemonId, :area, :latitude, :longitude, :name)");
        $stmt->bindParam(':pokemonId', intval($_POST['pokemon']));
        $stmt->bindParam(':area', intval($_POST['area']));
        $stmt->bindParam(':latitude', floatval($_POST['latitude']));
        $stmt->bindParam(':longitude', floatval($_POST['longitude']));
        $stmt->bindParam(':name', $_POST['name']);
        $stmt->execute();
        echo json_encode('success');
    } catch (Exception $e) {
        echo json_encode($e->getMessage());
    }
}

?>





