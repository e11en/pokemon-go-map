<?php
include_once('db.php');

if(isset($_POST['id'])){
    echo json_encode(unsetSighting());
}

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





