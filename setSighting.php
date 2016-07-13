<?php
include_once('db.php');

if(isset($_POST['pokemon']) && isset($_POST['type']) && isset($_POST['latitude']) && isset($_POST['longitude']) && isset($_POST['name'])){
    echo json_encode(setSighting());
}

function setSighting(){
    try{
        $pdo = getPDO();
        $stmt = $pdo->prepare("INSERT INTO sighting (pokemonId, type, latitude, longitude, name) VALUES (:pokemonId, :type, :latitude, :longitude, :name)");
        $pokemon = intval($_POST['pokemon']);
        $type = intval($_POST['type']);
        $latitude = floatval($_POST['latitude']);
        $longitude = floatval($_POST['longitude']);
        $name = $_POST['name'];

        $stmt->bindParam(':pokemonId', $pokemon);
        $stmt->bindParam(':type', $type);
        $stmt->bindParam(':latitude', $latitude);
        $stmt->bindParam(':longitude', $longitude);
        $stmt->bindParam(':name', $name);
        $stmt->execute();

        return 1;
    } catch (Exception $e) {
        return $e->getMessage();
    }
}

?>





