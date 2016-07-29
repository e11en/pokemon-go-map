<?php
/**
 * ALL THE PHP FUNCTIONS ARE PRESENT IN THIS DOCUMENT FOR GENERAL USE
 */

include_once('db.php');

// GETTERS
/**
 * Get all pokemon from the database
 * @return array
 */
function getPokemon(){
    try{
        $pdo = getPDO();
        $sql = 'SELECT * FROM pokemon ORDER BY pokedex';
        $result = [];
        foreach ($pdo->query($sql) as $row) {
            $result[] = [$row['id'], $row['pokedex'] . ' ' . $row['name']];
        }

        return $result;
    } catch (Exception $e) {
        return [
            'error!' , $e->getMessage()
        ];
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
            $result[] = [$row['latitude'], $row['longitude'], $row['type'], getPokedexById($row['pokemonId']), $row['voteUp'], $row['voteDown'], date("Y-m-d", $row['createdAt'])];
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

/**
 * Get recent activity
 * @return array
 */
function getRecentActivity(){
    try{
        $pdo = getPDO();
        $sql = 'SELECT * FROM sighting ORDER BY id DESC LIMIT 5';
        $stmt = $pdo->prepare($sql);

        $stmt->execute();
        $rows = $stmt->fetchAll();
        $result = [];
        foreach ($rows as $row) {
            $timeStamp = convertTime($row['createdAt']);
            $result[] = [$row['type'], $row['name'], $timeStamp];
        }

        return $result;
    } catch (Exception $e) {
        return [];
    }
}

/**
 * Convert unix time to a readable sting
 * @param $unixTime
 * @return bool|string
 */
function convertTime($unixTime){
    $now = date("Y-m-d H:i:s");
    $date = date("Y-m-d H:i:s", $unixTime);

    if(justNow($date)) {
        return 'Just now';
    } else if(today($date)){
        return 'Today <p class="small">'.getPartOfDT('H:i', $date).'</p>';
    } else if(yesterday($date)){
        return 'Yesterday';
    }

    return getPartOfDT('Y-m-d', $now);
}

/**
 * Check if the given time is in this minute
 * @param $date
 * @return bool
 */
function justNow($date){
    return date('Y-m-d H:i') === getPartOfDT('Y-m-d H:i', $date);
}

/**
 * Check if date is today
 * @param $date
 * @return bool
 */
function today($date){
    return date('Y-m-d') === getPartOfDT('Y-m-d', $date);
}

/**
 * Check if date is yesterday
 * @param $date
 * @return bool
 */
function yesterday($date){
    $yesterday = date("Y-m-d", time() - 60 * 60 * 24);
    return $yesterday === getPartOfDT('Y-m-d', $date);
}

/**
 * Get part of a date object
 * @param $format
 * @param $dateTime
 * @return bool|string
 */
function getPartOfDT($format, $dateTime){
    return date($format, strtotime($dateTime));
}



// SETTERS

/**
 * Set a sighting using $_POST data
 * @return string
 */
function setSighting(){
    try{
        $pdo = getPDO();
        $stmt = $pdo->prepare("INSERT INTO sighting (pokemonId, type, latitude, longitude, name, updatedAt, createdAt) VALUES (:pokemonId, :type, :latitude, :longitude, :name, :update, :create)");
        $pokemon = intval($_POST['pokemon']);
        $type = intval($_POST['type']);
        $latitude = floatval($_POST['latitude']);
        $longitude = floatval($_POST['longitude']);
        $name = $_POST['name'];
        $time = time();

        $stmt->bindParam(':pokemonId', $pokemon);
        $stmt->bindParam(':type', $type);
        $stmt->bindParam(':latitude', $latitude);
        $stmt->bindParam(':longitude', $longitude);
        $stmt->bindParam(':name', $name);
        $stmt->bindParam(':update', $time);
        $stmt->bindParam(':create', $time);
        $stmt->execute();
        $id = $pdo->lastInsertId();

        return $id;
    } catch (Exception $e) {
        return $e->getMessage();
    }
}

/**
 * Remove a sighting from the database
 * @return int|string
 */
function unsetSighting(){
    try{
        $pdo = getPDO();
        $stmt = $pdo->prepare("DELETE FROM sighting WHERE id=:id");
        $id = intval($_POST['id']);

        $stmt->bindParam(':id', $id);
        $stmt->execute();

        return 1;
    } catch (Exception $e) {
        return $e->getMessage();
    }
}

?>