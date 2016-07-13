<?php
include_once('config.php');

// Needed to work on the live server
header('Access-Control-Allow-Origin: http://pokemon.ellenlangelaar.nl');


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