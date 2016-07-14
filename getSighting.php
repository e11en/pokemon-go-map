<?php
include_once('db.php');
include_once('functions.php');

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

?>





