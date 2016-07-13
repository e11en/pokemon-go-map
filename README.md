# Pokemon GO Map
An interactive map for pokemon GO

Still To Do
===
- [ ] Create filtering of different Pokemon species
- [ ] Filtering for pokestops and gyms
- [ ] Nice markers for pokestops and gyms
- [ ] Edit a pokestop or gym
- [ ] Indicate if a pokestop has a lure or not
- [ ] Optimize the loading of the map


How To Make It Work
===
Create a db.php file in the root of the site and make a function that returns a PDO object. 
A SQL file with the structure is also added.
```
function getPDO(){
    try{
        $db = new PDO('mysql:host=localhost;dbname=DBNAME', 'USERNAME', 'PASSWORD');
        $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $db->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);

        return $db;
    } catch(Exception $e) {
        return $e->getMessage();
    }
}
```

