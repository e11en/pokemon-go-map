<?php

include_once('db.php');

if(isset($_GET['type'])){
    if($_GET['type'] === 'pokemon'){
        // Return all pokemon as JSON
        echo json_encode(getPokemon());
    }
}

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

?>