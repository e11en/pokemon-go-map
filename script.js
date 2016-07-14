$(document).ready(function() {
    // CLICK EVENT TO OPEN THE MOBILE MENU
    $('#menu-open').click(function(e){
        $('#menu').css('display','block');
        $('#menu-open').css('display','none');
    });

    // CLICK EVENT TO CLOSE THE MOBILE MENU
    $('#menu-close').click(function(e){
        $('#menu').css('display','none');
        $('#menu-open').css('display','block');
    });

    // CLICK EVENT FOR RETURN TO MAIN
    $('.btn-return-main').click(function(){
        $('#add-wrapper').hide();
        $('#add-error').hide();
        $('#add-success').hide();
        $('#main-wrapper').show();
    });

    // CLICK EVENT FOR ADDING A POKEMON
    $('#add').click(function(e){
        sendSighting();
    });

    // CLICK EVENT FOR SHOWING THE ADD PAGE
    $('#btn-add-pokemon').click(function(){
        location.reload(); // TODO: Fix in future, show name etc.
    });

    // CLICK EVENT FOR SHOWING THE ADD PAGE
    $('.btn-add-pokemon').click(function(){
        $('#main-wrapper').hide();
        $('#add-error').hide();
        $('#add-success').hide();
        $('#add-wrapper').show();
    });

    // CLICK EVENT FOR UNDOING THE ADD
    $('#btn-undo-add').click(function(){
        var id = $('#setSighting-id').val();
        if(id > 0){
            $.ajax({
                url: $GLOBALS.URLPHP+"unsetSighting.php",
                type: "POST",
                data: {id : id}
            }).done(function(data) {
                var obj = JSON.parse(data);
                if(obj > 0){
                    location.reload(); // TODO: Handle this a bit better, reload data instead of page
                } else {
                    console.log('error!', obj);
                    // SHOW ERROR
                    $('#add-wrapper').hide();
                    $('#add-error').show();
                }
            });
        }
    });

    $('#filter-pokemon').on('change', function(e){
        var choice = $(this).val();
        initMap();
        if(choice > 0){
            getDataPoints('pokemon&id='+choice);
        } else {
            getDataPoints(choice);
        }
    });

    // SET SELECT VALUES
    setPokemon();

    // SHOW ALL DATA POINTS
    getDataPoints('all');

    // GET RECENT ACTIVITY
    //getRecentActivity();
});


/**
 * Init the map
 */
var map;
var marker;
var locations = [];
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 52.211840, lng: 5.971564},
        zoom: 14,
        disableDefaultUI: true,
        zoomControl: true
    });

    google.maps.event.addListener(map, 'click', function(args) {
        $('#add-latitude').val(args.latLng.lat());
        $('#add-longitude').val(args.latLng.lng());
        placeMarker({lat: args.latLng.lat(), lng: args.latLng.lng()}, null, null, true);
    });

    marker = null;

    // ASK FOR PERMISSION TO USE LOCATION AND USE THAT TO CENTER THE MAP TO
    if (navigator.geolocation) {
        // TODO: Fix getCurrentPosition(); is deprecated on insecure origins, either get an ssl cert or find another way to do this
        navigator.geolocation.getCurrentPosition(function (position) {
            initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            map.setCenter(initialLocation);
        });
    }
}

/**
 * Place a marker on the screen to show where you clicked
 */
function placeMarker(location, type, pokemon, newLocationMarker) {
    if(newLocationMarker){
        if ( marker) {
            marker.setPosition(location);
        } else {
            marker = new google.maps.Marker({
                position: location,
                map: map,
                icon: 'img/markers/main.png'
            });
        }
    } else {
        var icon = type === 1 ? '/img/pokemon/'+pokemon.replace('#', '')+'.png' : type === 2 ? '/img/markers/pokestop.png' : '/img/markers/gym.png';
        if(type === 1){
            icon = new google.maps.MarkerImage(icon,
                new google.maps.Size(50, 50),
                new google.maps.Point(0, 0),
                new google.maps.Point(20, 20));
        }

        var temp = new google.maps.Marker({
            position: location,
            map: map,
            icon: icon
        });
        locations.push(temp);
    }

}

/**
 * Place all the data points on the map
 */
function placeDataPoints(data){
    for(i = 0; i < data.length; i++) {
        // SET VARIABLES
        var type = data[i][2];
        var radius = type === 1 ? 0.02 : type === 2 ? 0.01 : 0.01;

        // CREATE A NEW CIRCLE ON THE MAP
        var circle = new google.maps.Polygon({
            map: map,
            paths: [drawCircle(new google.maps.LatLng(data[i][0],data[i][1]), radius, 1)],
            strokeColor: type === 1 ? "FF0000" : type === 2 ? "#162C57" : "#B3AD28",
            strokeOpacity: 1,
            strokeWeight: type === 1 ? 0 : 2,
            fillColor: type === 1 ? '#FF0000' : type === 3 ? '#EEE60F' : '#283BEE',
            fillOpacity: type === 1 ? 0.35 : 0.7
        });

        placeMarker({lat: data[i][0], lng: data[i][1]}, type, data[i][3]);

        // ADD A CLICK EVENT SO OTHER POKEMONS CAN BE ADDED ON TOP OF IT
        google.maps.event.addListener(circle, 'click', function(args) {
            $('#add-latitude').val(args.latLng.lat());
            $('#add-longitude').val(args.latLng.lng());
            placeMarker({lat: args.latLng.lat(), lng: args.latLng.lng()}, null, null, true);
        });
    }
}

/**
 * Get all the data points
 */
function getDataPoints(type) {
    var dataPoints = [];
    $.ajax({
        url: $GLOBALS.URLPHP+"getSighting.php?type="+type,
        context: document.body
    }).done(function(data) {
        var obj = JSON.parse(data);
        $.each(obj, function(k, v) {
            var s = [parseFloat(v[0]),parseFloat(v[1]), parseInt(v[2]), v[3]];
            dataPoints.push(s);
        });
        placeDataPoints(dataPoints);
    });
}

/**
 * Draw the actual circle area
 */
function drawCircle(point, radius, dir) {
    var d2r = Math.PI / 180;   // degrees to radians
    var r2d = 180 / Math.PI;   // radians to degrees
    var earthsradius = 3963; // 3963 is the radius of the earth in miles

    var points = 32;

    // find the raidus in lat/lon
    var rlat = (radius / earthsradius) * r2d;
    var rlng = rlat / Math.cos(point.lat() * d2r);

    var extp = [];
    if (dir==1) {
        var start=0;
        var end=points+1; // one extra here makes sure we connect the path
    } else {
        var start=points+1;
        var end=0;
    }
    for (var i=start; (dir==1 ? i < end : i > end); i=i+dir)
    {
        var theta = Math.PI * (i / (points/2));
        ey = point.lng() + (rlng * Math.cos(theta)); // center a + radius x * cos(theta)
        ex = point.lat() + (rlat * Math.sin(theta)); // center b + radius y * sin(theta)
        extp.push(new google.maps.LatLng(ex, ey));
    }
    return extp;
}

/**
 * Set the pokemon select box options
 * */
function setPokemon() {
    $.ajax({
        url: $GLOBALS.URLPHP+"getSelectValues.php?type=pokemon",
        context: document.body
    }).done(function(data) {
        var obj = JSON.parse(data);
        $.each(obj, function(k, v) {
            $('#add-pokemon').append($("<option></option>").attr("value",v[0]).text(v[1]));
            $('#filter-pokemon').append($("<option></option>").attr("value",v[0]).text(v[1]));
        });
    });
}

/**
 * Save a sighting to the database
 */
function sendSighting(){
    var pokemon = $('#add-pokemon').val();
    var type = 1;
    var latitude = $('#add-latitude').val();
    var longitude = $('#add-longitude').val();
    var name = $('#add-name').val();

    if(pokemon === 'pokestop'){
        type = 2;
        pokemon = 0;
    } else if(pokemon === 'gym'){
        type = 3;
        pokemon = 0;
    }

    // VALIDATE THE INPUTS
    var valid = true;
    if(pokemon === null){
        $('#add-pokemon').parent().addClass('has-error');
        valid = false;
    } else {
        $('#add-pokemon').parent().removeClass('has-error');
    }
    if(latitude.replace(/\s/g, "").length <= 0){
        $('#add-latitude').parent().addClass('has-error');
        valid = false;
    } else {
        $('#add-latitude').parent().removeClass('has-error');
    }
    if(longitude.replace(/\s/g, "").length <= 0){
        $('#add-longitude').parent().addClass('has-error');
        valid = false;
    } else {
        $('#add-longitude').parent().removeClass('has-error');
    }
    if(name.replace(/\s/g, "").length <= 0){
        name = 'Anonymous';
    }

    // SEND VALID DATA TO DB
    if(valid){
        $.ajax({
            method: 'POST',
            url: $GLOBALS.URLPHP+"setSighting.php",
            data: {
                pokemon: pokemon,
                type: type,
                latitude: latitude,
                longitude: longitude,
                name: name
            }
        }).done(function(data) {
            var obj = JSON.parse(data);
            if(obj > 0){
                $('#setSighting-id').val(obj);

                // SHOW SUCCESS
                $('#add-wrapper').hide();
                $('#add-success').show();

                // CLEAR OUT THE INPUTS
                $('#add-pokemon').val(null);
                $('#add-type').val(null);
                $('#add-latitude').val('');
                $('#add-longitude').val('');

                // EXCEPT FOR NAME IF IT'S NOT ANONYMOUS
                $('#add-name').val() === 'Anonymous' ? $('#add-name').val('') : null; // for future use?

                initMap();
                getDataPoints('all');
                //location.reload(); // TODO: Handle this a bit better, reload data instead of page
            } else {
                console.log('error!', obj);
                // SHOW ERROR
                $('#add-wrapper').hide();
                $('#add-error').show();
            }
        });
    }
}

/**
 * Get recent activity
 */
function getRecentActivity() {
    $.ajax({
        method: 'POST',
        url: $GLOBALS.URLPHP+"getRecentActivity.php"
    }).done(function(data) {
        var obj = JSON.parse(data);
        $.each(obj, function(k, v) {
            console.log(v);
            var type = v[0] === 1 ? 'Pokemon' : v[0] === 2 ? 'Pokestop' : 'Gym';
            $('#recent-activity').append('<tr><td>'+v[1]+'</td><td>'+type+'</td><td>'+v[2]+'</td></tr>');
        });
    });
}