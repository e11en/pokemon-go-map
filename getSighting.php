<?php
include_once('db.php');

if(isset($_GET['type'])){
    if($_GET['type'] === 'pokemon'){
        // Return all pokemon as JSON
        echo json_encode(getSightings());
    }
}

/**
 * Get sightings from the database
 * @return array
 */
function getSightings(){
    try{
        $pdo = getPDO();
        $sql = 'SELECT * FROM sighting';
        $result = [];
        foreach ($pdo->query($sql) as $row) {
            $result[] = [$row['latitude'], $row['longitude'], $row['type']];
        }

        return $result;
    } catch (Exception $e) {
        return [];
    }
}


?>





