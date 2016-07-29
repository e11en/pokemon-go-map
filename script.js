// GLOBALS
var infoWindows = [];
var map;
var marker;
var locations = [];

$(document).ready(function() {
    // CLICK EVENT FOR THE EDITING OF THE NAMES OF POKESTOPS AND GYMS
    $('body').on('click', '.editable-name', function() {
        editNameSighting(this);
    });

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
                url: "php/unsetSighting.php",
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
});


/**
 * Init the map
 */
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
        placeMarker({location:{lat: args.latLng.lat(), lng: args.latLng.lng()}}, true);
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
function placeMarker(data, newLocationMarker) {
    if(newLocationMarker){
        closeAllInfoWindows();
        if ( marker) {
            marker.setPosition(data.location);
        } else {
            marker = new google.maps.Marker({
                position: data.location,
                map: map,
                icon: 'img/markers/main.png'
            });
        }
    } else {
        var icon = data.type === 1 ? '/img/pokemon/'+data.pokemon['pokedex'].replace('#', '')+'.png' : data.type === 2 ? '/img/markers/pokestop.png' : '/img/markers/gym.png';
        if(data.type === 1){
            icon = new google.maps.MarkerImage(icon,
                new google.maps.Size(50, 50),
                new google.maps.Point(0, 0),
                new google.maps.Point(20, 20));
        }

        var temp = new google.maps.Marker({
            position: data.location,
            map: map,
            icon: icon
        });
        locations.push(temp);

        infoWindowForMarker(temp, data);
    }
}

/**
 * Make sure all the info windows are closed
 */
function closeAllInfoWindows(){
    for(i = 0; i < infoWindows.length; i++){
        infoWindows[i].close();
    }
}

function infoWindowForMarker(marker, data){
    var contentHeading = "";
    if(data.pokemon['pokedex'] == undefined){
        var value =  data.name === null ? 'No name' : data.name;
        contentHeading = '<div class="editable-name">'+
                            '<span>' + value + '</span>'+
                            '<i class="fa fa-pencil" aria-hidden="true"></i>'+
                         '</div>';
    } else
        contentHeading = data.pokemon['pokedex']+" "+data.pokemon['name'];
    var contentString = '<div id="content" class="infoWindow">'+
        '<div id="siteNotice">'+
        '</div>'+
        '<h1 id="firstHeading" class="firstHeading">'+contentHeading+'</h1>'+
        '<div id="bodyContent">'+
            '<p>Added on '+data.createdAt+' by '+data.creator+'</p>'+
            '<div class="pull-left">' +
                '<button class="btn btn-success"><i class="fa fa-thumbs-up" aria-hidden="true"></i></button>'+
                '<h3>'+data.votes.up+'</h3>'+
            '</div><div class="pull-right">'+
                '<button class="btn btn-danger"><i class="fa fa-thumbs-down" aria-hidden="true"></i></button>'+
                '<h3>'+data.votes.down+'</h3>'+
            '</div>' +
        '</div>'+
    '</div>';

    var infowindow = new google.maps.InfoWindow({
        content: contentString
    });
    infoWindows.push(infowindow);

    marker.addListener('click', function() {
        closeAllInfoWindows();
        infowindow.open(map, marker);
    });
}

/**
 * Place all the data points on the map
 */
function placeDataPoints(data){
    for(i = 0; i < data.length; i++) {
        // SET VARIABLES
        var type = data[i].type;
        var radius = type === 1 ? 0.02 : type === 2 ? 0.01 : 0.01;

        // CREATE A NEW CIRCLE ON THE MAP
        var circle = new google.maps.Polygon({
            map: map,
            paths: [drawCircle(new google.maps.LatLng(data[i].location), radius, 1)],
            strokeColor: type === 1 ? "FF0000" : type === 2 ? "#162C57" : "#B3AD28",
            strokeOpacity: 1,
            strokeWeight: type === 1 ? 0 : 2,
            fillColor: type === 1 ? '#FF0000' : type === 3 ? '#EEE60F' : '#283BEE',
            fillOpacity: type === 1 ? 0.35 : 0.7
        });

        placeMarker(data[i]);

        // ADD A CLICK EVENT SO OTHER POKEMONS CAN BE ADDED ON TOP OF IT
        google.maps.event.addListener(circle, 'click', function(args) {
            $('#add-latitude').val(args.latLng.lat());
            $('#add-longitude').val(args.latLng.lng());
            placeMarker({location:{lat: args.latLng.lat(), lng: args.latLng.lng()}}, true);
        });
    }
}

/**
 * Get all the data points
 */
function getDataPoints(type) {
    var dataPoints = [];
    $.ajax({
        url: "php/getSighting.php?type="+type,
        context: document.body
    }).done(function(data) {
        var obj = JSON.parse(data);
        $.each(obj, function(k, v) {
            var o = {location: {lat: parseFloat(v[0]), lng: parseFloat(v[1])}, type: parseInt(v[2]), name: v[8], pokemon: v[3], votes: {up:v[4],down:v[5]}, createdAt: v[6], creator: v[7]};
            dataPoints.push(o);
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
        url: "php/getSelectValues.php?type=pokemon",
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
    var creator = $('#add-creator').val();

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
    if(creator.replace(/\s/g, "").length <= 0){
        creator = 'Anonymous';
    }

    // SEND VALID DATA TO DB
    if(valid){
        $.ajax({
            method: 'POST',
            url: "php/setSighting.php",
            data: {
                pokemon: pokemon,
                type: type,
                latitude: latitude,
                longitude: longitude,
                creator: creator
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
                $('#add-creator').val() === 'Anonymous' ? $('#add-creator').val('') : null; // for future use?

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

function editNameSighting(element) {
    // show a popup with an input

    // if save, then save the new value to the db
    // else, close the popup

    // reload that specific info window
}