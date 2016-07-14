<?php
include_once('db.php');
include_once('functions.php');

if(isset($_GET['type'])){
    if($_GET['type'] === 'pokemon'){
        // Return all pokemon as JSON
        echo json_encode(getPokemon());
    }
}

?>