$(function () {

    function initMap() {


        var pyrmont = {lat: -7.759816, lng: 110.408814};
        map = new google.maps.Map(document.getElementById('map'), {
          center: pyrmont,
          zoom: 17
        });

        // var location = new google.maps.LatLng(-7.759816, 110.408814);

        // var mapCanvas = document.getElementById('map');
        // Create the places service.
        var service = new google.maps.places.PlacesService(map);
        var getNextPage = null;
        var moreButton = document.getElementById('more');
        moreButton.onclick = function() {
          moreButton.disabled = true;
          if (getNextPage) getNextPage();
        };

        // Perform a nearby search.
        service.nearbySearch(
            {location: pyrmont, radius: 500, type: ['sport']},
            function(results, status, pagination) {
              if (status !== 'OK') return;

              createMarkers(results);
              moreButton.disabled = !pagination.hasNextPage;
              getNextPage = pagination.hasNextPage && function() {
                pagination.nextPage();
              };
            });
      }

      function createMarkers(places) {
        var bounds = new google.maps.LatLngBounds();
        var placesList = document.getElementById('places');

        for (var i = 0, place; place = places[i]; i++) {
          var image = {
            url: place.icon,
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(25, 25)
          };

          var marker = new google.maps.Marker({
            map: map,
            icon: image,
            title: place.name,
            position: place.geometry.location
          });

          var li = document.createElement('li');
          li.textContent = place.name;
          placesList.appendChild(li);

          bounds.extend(place.geometry.location);
        }
        map.fitBounds(bounds);
      }
});