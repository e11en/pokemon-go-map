<?php
include_once('../config.php');

/**
 * Get the PDO object.
 * @return Exception|PDO
 */
function getPDO(){
    try{
        $db = new PDO('mysql:host='.$GLOBALS['config']['DBHOST'].';dbname='.$GLOBALS['config']['DBNAME'].'', $GLOBALS['config']['DBUSER'], $GLOBALS['config']['DBPASS']);
        $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $db->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);

        return $db;
    } catch(Exception $e) {
        return $e->getMessage();
    }
}


?>