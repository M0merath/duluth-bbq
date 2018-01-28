// ==== GLOBAL ====

// Store the Foursqare client ID and secret for future reference
var client_id = 'SFLIZ3Z0VXO4TXM5C3UUUUETPD4ZZIO5QE1O2LKLHTXLBDUE';
var client_secret = 'QC4XDEDAHXXEYRLTFEHAMD1APQDQOJLIQZMPTEFGEPFEKYNR';

// Search for Korean BBQ restaurants in Duluth, GA using Foursquare
var initialURL = 'https://api.foursquare.com/v2/venues/search?' + 
'v=20161016&ll=33.958681%2C%20-84.1363947&radius=2000&query=Korean%20BBQ' + 
'&limit=10&intent=browse&client_id=' + client_id + '&client_secret=' + client_secret;

markers = [];

// ==== VIEWMODEL ====

function populateMap() {
	var self = this;
	//this.markers = [];

	this.initMap = function() {
    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 33.958681, lng: -84.1363947},
      zoom: 15
    });
    // Create an infowindow to display when a marker is clicked
  	this.largeInfowindow = new google.maps.InfoWindow();
    populateRestaurants(initialURL, markers, this.largeInfowindow);

  };

  function populateRestaurants(query, markers, infowindow) {
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
        this.marker.addListener('click', self.bounceMarker); 
      }
    }).fail(function() {
      alert('Could not load Foursquare API. Please check your connection and try again.');
    });
  }

  this.bounceMarker = function() {
    // Pan to selected marker and set to bounce twice.
    map.panTo(this.getPosition());
    this.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout((function() { this.setAnimation(null); }).bind(this), 1400);
    self.prepareInfoWindow(this, self.largeInfowindow);
  };

  this.initialAppend = function() {
  	for (var i = 0; i < markers.length; i++) {
  		$(".sidebar").append("markers[i].title");
  	}
  }

  this.initMap();
  this.initialAppend();	
}
