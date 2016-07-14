<?php
include_once('db.php');

if(isset($_GET['type'])){
    if($_GET['type'] === 'all'){
        // Return all pokemon as JSON
        echo json_encode(getSightings());
    } else if($_GET['type'] === 'pokestop'){
        // Return only pokestops
        echo json_encode(getSightings(2));
    } else if($_GET['type'] === 'gym'){
        // Return only gyms
        echo json_encode(getSightings(3));
    } else if(isset($_GET['id'])){
        echo json_encode(getSightings(null, intval($_GET['id'])));
    }
}

/**
 * Get sightings from the database
 * @param null $type
 * @param null $id
 * @return array
 */
function getSightings($type = null, $id = null){
    try{
        $pdo = getPDO();
        $sql = 'SELECT * FROM sighting';
        if($type !== null) {
            $sql .= ' WHERE type=:type';
        }
        if($id !== null){
            $sql .= ' WHERE pokemonId=:id';
        }
        $stmt = $pdo->prepare($sql);

        if($type !== null) {
            $stmt->bindParam(':type', $type);
        }
        if($id !== null){
            $stmt->bindParam(':id', $id);
        }

        $stmt->execute();
        $rows = $stmt->fetchAll();
        $result = [];
        foreach ($rows as $row) {
            $result[] = [$row['latitude'], $row['longitude'], $row['type'], getPokedexById($row['pokemonId'])];
        }

        return $result;
    } catch (Exception $e) {
        return [];
    }
}

/**
 * Get Pokedex by Pokemon Id
 * @param $id
 * @return int
 */
function getPokedexById($id){
    try{
        $pdo = getPDO();
        $sql = 'SELECT pokedex FROM pokemon WHERE id = :id LIMIT 1';
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':id', $id);
        $stmt->execute();

        return $stmt->fetch()[0];
    } catch (Exception $e) {
        return 0;
    }
}


?>





