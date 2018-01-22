// =========== GLOBAL ===========

// Create a Google Map variable
var map;
// Create an empty array of markers
//var markers = [];
//var sidebarToggle = false;
// Store the Foursqare client ID and secret for future reference
var client_id = 'SFLIZ3Z0VXO4TXM5C3UUUUETPD4ZZIO5QE1O2LKLHTXLBDUE';
var client_secret = 'QC4XDEDAHXXEYRLTFEHAMD1APQDQOJLIQZMPTEFGEPFEKYNR';

// Search for Korean BBQ restaurants in Duluth, GA using Foursquare
var initialURL = 'https://api.foursquare.com/v2/venues/search?' + 
'v=20161016&ll=33.958681%2C%20-84.1363947&radius=2000&query=Korean%20BBQ' + 
'&limit=10&intent=browse&client_id=' + client_id + '&client_secret=' + client_secret;

// ========= VIEWMODEL ===========
function viewModel() {
  var self = this;
  this.sidebarToggle = ko.observable(false);
  this.searchEntry = ko.observable(null);
  this.markers = [];
  // Initialize the map within the div
  this.initMap = function() {
    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 33.958681, lng: -84.1363947},
      zoom: 15
    });
    // Create an infowindow to display when a marker is clicked
  	this.largeInfowindow = new google.maps.InfoWindow();
    populateRestaurants(initialURL, this.markers, this.largeInfowindow);

  };

  this.searchFilter = ko.computed(function() {
    this.searchEntry();
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
    return result;
  }, this);

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

  this.prepareInfoWindow = function(marker, infowindow) {
      // Check to make sure the infowindow is not already opened on this marker.
      if (infowindow.marker != marker) {
        // Clear the infowindow content to give the Foursquare API time to load.
        infowindow.setContent('');
        infowindow.marker = marker;
        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick', function() {
            infowindow.marker = null;
        });
        console.log(marker.foursquareID);
        console.log(infowindow);
        console.log(marker);
        foursquareVenue(marker.foursquareID, infowindow, marker);
    }
  };

  this.bounceMarker = function() {
    // Pan to selected marker and set to bounce twice.
    map.panTo(this.getPosition());
    this.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout((function() { this.setAnimation(null); }).bind(this), 1400);
    self.prepareInfoWindow(this, self.largeInfowindow);
  };

  sidebarShrink = function() {
    this.sidebarToggle = !this.sidebarToggle;
    console.log('this.sidebarToggle = ' + this.sidebarToggle);
    if (this.sidebarToggle = true) {
      document.getElementById("options-box").style.width = "40px";
    } else {
      document.getElementById("options-box").style.width = "340px";
    }
  }

  sidebarExpand = function() {
    document.getElementById("options-box").style.width = "340px";
    //document.getElementById("options-box").style.display = "block";
  }

  function foursquareVenue(id, infowindow, marker) {
      var foursquareURL = 'https://api.foursquare.com/v2/venues/' + id + 
      '?v=20161016&client_id=' + client_id + '&client_secret=' + client_secret;
      $.getJSON(foursquareURL, function(data) {
        var results = data.response.venue;
        // Is there a listed phone number for this venue?
        var phoneContact = '';
        if (results.contact.formattedPhone !== undefined) {
          phoneContact = results.contact.formattedPhone;
        } else {
          phoneContact = 'none listed';
        }
        // Is there a rating for this venue?
        var venueRating = '';
        if (results.rating !== undefined) {
          venueRating = results.rating;
        } else {
          venueRating = 'n/a';
        }
        infowindow.setContent(
          '<div>' + 
          '<div style="width: 105px; float: left; display: inline-block;">' + 
          '<span>' + '<img src="' + results.bestPhoto.prefix + 'width100' + results.bestPhoto.suffix + '"></span>' + 
          '</div>' + 
          '<div style="width: 200px; float: left; display: inline-block">' + 
          '<span>' + '<strong>' + results.name + '</strong></span><br>' + 
          '<span>' + '<strong>Rating: </strong>' + venueRating + '</span>' + '&emsp;' +  
          '<span>' + '<strong>Price: </strong>' + results.price.tier + '</span><br>' + 
          '<span>' + '<strong>Address: </strong><br>' + results.location.formattedAddress + '</span><br>' + 
          '<span>' + '<strong>Phone: </strong>' + phoneContact + '</span>' + 
          '</div>' + 
          '</div>');
      }).fail(function() {
        alert('Could not load the Foursquare API. Please check your connection and try again.');
      });
      infowindow.open(map, marker);
    }

  this.initMap();
}



// Get started by initializing our viewmodel using Knockout
function getStarted() {
  ko.applyBindings(new viewModel());
  //viewModel();
}