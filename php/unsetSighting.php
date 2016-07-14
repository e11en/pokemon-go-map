<?php
include_once('functions.php');

if(isset($_POST['id'])){
    echo json_encode(unsetSighting());
}

?>





