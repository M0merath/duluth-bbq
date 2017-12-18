		// Create a Google Map variable
		var map;
		// Create an empty array of markers
		var markers = [];
    // Store the Foursqare client ID and secret for future reference
    var client_id = 'SFLIZ3Z0VXO4TXM5C3UUUUETPD4ZZIO5QE1O2LKLHTXLBDUE';
    var client_secret = 'QC4XDEDAHXXEYRLTFEHAMD1APQDQOJLIQZMPTEFGEPFEKYNR';
		// Initialize the map within the div
		function initMap() {
			map = new google.maps.Map(document.getElementById('map'), {
				center: {lat: 33.958681, lng: -84.1363947},
				zoom: 15
			});
			//var myungGaWon = {lat: 33.9598642, lng: -84.1378528};
        	//var marker = new google.maps.Marker({
          	//position: myungGaWon,
          	//map: map,
          	//title: 'First Marker!'
        	//});
		// An array of Korean BBQ restaurants.
			var restaurants = [
          		{title: 'Myung Ga Won', location: {lat: 33.953149, lng: -84.131959}},
          		{title: 'Breakers Korean BBQ', location: {lat: 33.957251, lng: -84.129319}},
          		{title: 'Iron Age Korean Steak House', location: {lat: 33.954270, lng: -84.133812}},
          		{title: 'Song Do BBQ', location: {lat: 33.957229, lng: -84.135552}},
          		{title: 'JM BBQ & Bar', location: {lat: 33.960409, lng: -84.134025}}
        	];


      var largeInfowindow = new google.maps.InfoWindow();
      //var defaultIcon = makeMarkerIcon('0091ff');

      function populateRestaurants (query) {
        // Using Foursquare, place 5 markers matching query.
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
              populateInfoWindow(this, largeInfowindow);
            });
          }
          for (var i = 0; i < results.length; i++) {
            // Create a listing per restaurant, and add it to the sidebar.
            restaurant = markers[i].title;
            restNum = i;
            var newListing = document.createElement("div");
            var listButton = document.createElement("button");
            listButton.setAttribute("onclick", "selectOne(" + restNum + ")");
            var textnode = document.createTextNode(restaurant);
            listButton.appendChild(textnode);
            newListing.appendChild(listButton);
            var sidebar = document.getElementById("sidebar");
            sidebar.insertBefore(newListing, sidebar.childNodes[i]);
            } 
        }); 
      }

     	populateRestaurants('https://api.foursquare.com/v2/venues/search?v=20161016&ll=33.958681%2C%20-84.1363947&radius=2000&query=Korean%20BBQ&limit=5&intent=browse&client_id=SFLIZ3Z0VXO4TXM5C3UUUUETPD4ZZIO5QE1O2LKLHTXLBDUE&client_secret=QC4XDEDAHXXEYRLTFEHAMD1APQDQOJLIQZMPTEFGEPFEKYNR')
      showListings();

     	var contentString = '<div id="content">'+
            '<div id="siteNotice">'+
            '</div>'+
            '<h1 id="firstHeading" class="firstHeading">Uluru</h1>'+
            '<div id="bodyContent">'+
            '<p><b>Uluru</b>, also referred to as <b>Ayers Rock</b>, is a large ' +
            'sandstone rock formation in the southern part of the '+
            'Northern Territory, central Australia. It lies 335&#160;km (208&#160;mi) '+
            'south west of the nearest large town, Alice Springs; 450&#160;km '+
            '(280&#160;mi) by road. Kata Tjuta and Uluru are the two major '+
            'features of the Uluru - Kata Tjuta National Park. Uluru is '+
            'sacred to the Pitjantjatjara and Yankunytjatjara, the '+
            'Aboriginal people of the area. It has many springs, waterholes, '+
            'rock caves and ancient paintings. Uluru is listed as a World '+
            'Heritage Site.</p>'+
            '<p>Attribution: Uluru, <a href="https://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">'+
            'https://en.wikipedia.org/w/index.php?title=Uluru</a> '+
            '(last visited June 22, 2009).</p>'+
            '</div>'+
            '</div>';

      var testwindow = new google.maps.InfoWindow({
        content: contentString
      });

      var testmarker = new google.maps.Marker({
        position: {lat: 33.958681, lng: -84.1363947},
        map: map,
        title: 'Uluru (Ayers Rock)'
      });
      testmarker.addListener('click', function() {
        testwindow.open(map, testmarker);
      });

     	// Sidebar buttons to 'show' and 'hide' markers.
     	document.getElementById('show-listings').addEventListener('click', showListings);
      document.getElementById('hide-listings').addEventListener('click', hideListings);
  	}

		function showListings() {
      var bounds = new google.maps.LatLngBounds();
      // Extend the boundaries of the map for each marker and display the marker
      for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
        bounds.extend(markers[i].position);
      }
      map.fitBounds(bounds);
    }

    // This function will loop through the listings and hide them all.
    function hideListings() {
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }
  }

  function selectOne(selection) {
    google.maps.event.trigger(map, "resize");
			map.panTo(markers[selection].getPosition());
			map.setZoom(16);
    }

      	
    function populateInfoWindow(marker, infowindow) {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
      // Clear the infowindow content to give the streetview time to load.
      infowindow.setContent('');
      infowindow.marker = marker;
      // Make sure the marker property is cleared if the infowindow is closed.
      infowindow.addListener('closeclick', function() {
        infowindow.marker = null;
      });
      // Let Foursquare query this specific venue, for more detailed results.
      function foursquareVenue(id) {
        var foursquareURL = 'https://api.foursquare.com/v2/venues/' + id + '?v=20161016&client_id=' + client_id + '&client_secret=' + client_secret;
        $.getJSON(foursquareURL, function(data) {
          var results = data.response.venue;
          infowindow.setContent('<div>' + results.name + '</div>' + '<div>' + 'Rating: ' + results.rating + '</div>' + '<div>' + 'Price: ' + results.price.tier + '</div>' + '<div>' + '<img src="' + results.bestPhoto.prefix + 'width100' + results.bestPhoto.suffix + '"></div>' + '<div>' + results.location.formattedAddress + '</div>' + '<div>' + results.contact.formattedPhone + '</div>');
        });
      }
      foursquareVenue(marker.foursquareID);
    }
    infowindow.open(map, marker);
  }