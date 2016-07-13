# Pokemon GO Map
An interactive map for pokemon GO

![screenshot of the app](https://raw.githubusercontent.com/e11en/pokemon-go-map/master/screenshot-1.png)

Still To Do
===
- [ ] Show amount of pokemons when filtering
- [ ] Show amount of pokemons per type in total
- [ ] Nice markers for pokestops and gyms
- [ ] Edit a pokestop or gym
- [ ] Indicate if a pokestop has a lure or not
- [ ] Optimize the loading of the map


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

    // URLS
    'URLHOST' => 'http://example.com'
];

```

JS
====
```
var $GLOBALS = {
    // URLS
    'URLPHP' : 'http://example.com',
    'URLHOST': 'http://example.com'
};


```