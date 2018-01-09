// =========== GLOBAL ===========

// Create a Google Map variable
var map;
// Create an empty array of markers
//var markers = [];

// Store the Foursqare client ID and secret for future reference
var client_id = 'SFLIZ3Z0VXO4TXM5C3UUUUETPD4ZZIO5QE1O2LKLHTXLBDUE';
var client_secret = 'QC4XDEDAHXXEYRLTFEHAMD1APQDQOJLIQZMPTEFGEPFEKYNR';

// Search for Korean BBQ restaurants in Duluth, GA using Foursquare
var initialURL = 'https://api.foursquare.com/v2/venues/search?' + 
'v=20161016&ll=33.958681%2C%20-84.1363947&radius=2000&query=Korean%20BBQ' + 
'&limit=10&intent=browse&client_id=' + client_id + '&client_secret=' + client_secret

// ========= VIEWMODEL ===========
function viewModel() {
  var self = this;

  this.searchEntry = ko.observable("");
  this.markers = [];
  // Initialize the map within the div
  this.initMap = function() {
    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 33.958681, lng: -84.1363947},
      zoom: 15
    });
    // Create an infowindow to display when a marker is clicked
  	this.largeInfowindow = new google.maps.InfoWindow();
    populateRestaurants(initialURL, this.markers);
  }

  this.searchFilter = ko.computed(function() {
    console.log('searchFilter has been called: ' + this.searchEntry());
    var result = [];
    for (var i = 0; i < this.markers.length; i++) {
      var marker = this.markers[i];
      if (marker.title.toLowerCase().includes(this.searchEntry().toLowerCase())) {
        result.push(marker);
        this.markers[i].setVisible(true);
      } else {
        this.markers[i].setVisible(false);
      }
    }
    console.log(result);
    return result;
  }, this);

  function populateRestaurants(query, markers) {
  // Using Foursquare, place 10 markers matching query.
    $.getJSON(query, function(data) {
      var results = data.response.venues;
      for (var i = 0; i < results.length; i++) {
        var result = results[i];
        var position = result.location;
        var title = result.name;
        var foursquareID = result.id;
        this.marker = new google.maps.Marker({
          position: position,
          title: title,
          animation: google.maps.Animation.DROP,
          id: i,
          foursquareID: foursquareID
        });
        this.marker.setMap(map);
        markers.push(this.marker);
        this.marker.addListener('click', function() {
          view.prepareInfoWindow(this, largeInfowindow);
        });
      }
    });
  }
  function showListings(restaurants) {
    var bounds = new google.maps.LatLngBounds();
    // Extend the boundaries of the map for each marker and display the marker
    for (var i = 0; i < restaurants.length; i++) {
      if (restaurants[i].title.toLowerCase().includes(searchEntry().toLowerCase())) {
        restaurants[i].setMap(map);
        restaurants[i].setVisible(true);
        bounds.extend(restaurants[i].position);
        console.log(restaurants[i].title.toLowerCase());
      }
    }
    map.fitBounds(bounds);
  }
  this.initMap();
}


// Let's get started by initializing our viewmodel using Knockout
function getStarted() {
  ko.applyBindings(new viewModel());
  //viewModel();
}