# Pokemon GO Map
An interactive map for pokemon GO. 
> [pokemon.ellenlangelaar.nl](http://pokemon.ellenlangelaar.nl/).

![screenshot of the app](https://raw.githubusercontent.com/e11en/pokemon-go-map/master/screenshot.png)

Still To Do
===
- [ ] Make map reload instead of reloading page
- [ ] Map stay at the same zoom level and location after adding
- [ ] Show amount of pokemons when filtering
- [ ] Show amount of pokemons per type in total
- [ ] Clean up pokemon images
- [ ] Edit a pokestop or gym
- [ ] Indicate if a pokestop has a lure or not
- [ ] Optimize the loading of the map
- [ ] Translation of frontend

How To Make It Work
===
Create a config.js and config.php file in the root of the site and fill the ```$GLOBALS['config']``` array with the following, you
can also see the config.example.js/php files

PHP
====
```
$GLOBALS['config'] = [
    // DATABASE
    'DBHOST' => 'localhost',
    'DBNAME' => 'database',
    'DBUSER' => 'username',
    'DBPASS' => 'password',
];

```

JS
====
```
var $GLOBALS = {
    'GA_ID': 'GOOGLE ANALYTICS ID'
};


```
