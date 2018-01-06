// =========== GLOBAL ===========

// Create a Google Map variable
var map;
// Create an empty array of markers
var markers = [];

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

  this.searchEntry = ko.observable('');
	populateRestaurants(initialURL);

  this.searchFilter = ko.computed(function() {
    var result = [];
    for (var i = 0; i < markers.length; i++) {
      var marker = markers[i];
      if (marker.title.toLowerCase().includes(searchEntry().toLowerCase())) {
        result.push(marker);
        this.markers[i].setVisible(true);
      } else {
        this.markers[i].setVisible(false);
      }
    }
    console.log(result);
    return result;
  }, this);

  // Initialize the map within the div
  this.initMap = function() {
    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 33.958681, lng: -84.1363947},
      zoom: 15
    });
    console.log("initMap has been called");
    // Create an infowindow to display when a marker is clicked
  	this.largeInfowindow = new google.maps.InfoWindow();
  }
  this.initMap();
}

function populateRestaurants(query) {
  // Using Foursquare, place 10 markers matching query.
  $.getJSON(query, function(data) {
    var results = data.response.venues;
    for (var i = 0; i < results.length; i++) {
      var result = results[i];
      var position = result.location;
      var title = result.name;
      var foursquareID = result.id;
      var marker = new google.maps.Marker({
        position: position,
        title: title,
        animation: google.maps.Animation.DROP,
        id: i,
        foursquareID: foursquareID
      });
      markers.push(marker);
      marker.addListener('click', function() {
        view.prepareInfoWindow(this, largeInfowindow);
      });
    }
          //view.populateSidebar(markers);
  });
}

// Let's get started by initializing our viewmodel using Knockout
function getStarted() {
  ko.applyBindings(new viewModel());
  //viewModel();
}