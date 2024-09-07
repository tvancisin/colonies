<script>
    import { onMount, createEventDispatcher } from "svelte";
    import mapboxgl from "mapbox-gl";
  
    const dispatch = createEventDispatcher();
  
    let height;
    let current_zoom = 2.5;
    let clicked_country;
    export let map;
    export let countries_json;
    export let shipping_json;
    export let births_per_colony;
    let hoveredPolygonId = null;
  
    // make an array of colonies for filtering
    const countryNames = births_per_colony
      .filter((item) => item[0] !== undefined) // Ignore undefined values
      .map((item) => item[0]); // Extract the country names
  
    countryNames.push("Britain");
  
    function adjustMapForWindowSize() {
      let centerCoordinates = map.getCenter();
      if (window.innerWidth <= 768) {
        current_zoom = 1.4;
        map.flyTo({
          center: [centerCoordinates.lng, centerCoordinates.lat],
          zoom: 1.4,
        });
      } else if (window.innerWidth <= 1000) {
        current_zoom = 2.2;
        map.flyTo({
          center: [centerCoordinates.lng, centerCoordinates.lat],
          zoom: 2.2,
        });
      } else {
        current_zoom = 2.5;
        map.flyTo({
          center: [centerCoordinates.lng, centerCoordinates.lat],
          zoom: 2.5,
        });
      }
    }
  
    $: if (countries_json && shipping_json && countryNames && map) {
      // Ensure this block runs only after the map has fully loaded
      map.on("load", () => {
        // Check if the source already exists
        if (!map.getSource("countries")) {
          map.addSource("shipping", {
            type: "geojson",
            data: shipping_json,
            generateId: true, // Ensures all features have unique IDs
          });
  
          map.addLayer({
            id: "shipline",
            type: "line",
            source: "shipping",
            // layout: {
            //   "line-join": "round",
            //   "line-cap": "round",
            // },
            paint: {
              "line-color": "#888",
              "line-opacity": 0.5,
              "line-width": [
                "match",
                ["get", "ADMIN"], // Get the ADMIN property
                "India",
                4, // If ADMIN is 'Country A', width is 4
                "Australia",
                1, // If ADMIN is 'Country B', width is 6
                "Asia",
                1, // If ADMIN is 'Country C', width is 8
                "Africa",
                4, // If ADMIN is 'Country B', width is 6
                "Caribbean",
                2, // If ADMIN is 'Country B', width is 6
                "America",
                2, // If ADMIN is 'Country B', width is 6
                1, // Default width if ADMIN doesn't match
              ],
              "line-dasharray": [0, 4, 3],
            },
          });
  
          // start the animation
          // animateDashArray(0);
  
          // Add the source if it doesn't already exist
          map.addSource("countries", {
            type: "geojson",
            data: countries_json,
            generateId: true, // Ensures all features have unique IDs
          });
  
          // Add the layer with the filtered countries
          map.addLayer({
            id: "countries_fill",
            type: "fill",
            source: "countries",
            paint: {
              "fill-color": "#171109", //color of moon Iapedus charcoal black
            },
            filter: ["in", ["get", "ADMIN"], ["literal", countryNames]],
          });
  
          map.addLayer({
            id: "countries_outline",
            type: "line",
            source: "countries",
            layout: {},
            paint: {
              "line-color": "black",
              "line-width": [
                "case",
                ["boolean", ["feature-state", "hover"], false],
                1,
                0,
              ],
            },
          });
  
          //interactivity for no fatalities
          map.on("mousemove", "countries_fill", (e) => {
            map.getCanvas().style.cursor = "pointer";
            if (e.features.length > 0) {
              if (hoveredPolygonId !== null) {
                map.setFeatureState(
                  { source: "countries", id: hoveredPolygonId },
                  { hover: false },
                );
              }
              hoveredPolygonId = e.features[0].id;
              map.setFeatureState(
                { source: "countries", id: hoveredPolygonId },
                { hover: true },
              );
            }
          });
  
          // When the mouse leaves the state-fill layer, update the feature state of the
          // previously hovered feature.
          map.on("mouseleave", "countries_fill", () => {
            map.getCanvas().style.cursor = "";
            if (hoveredPolygonId !== null) {
              map.setFeatureState(
                { source: "countries", id: hoveredPolygonId },
                { hover: false },
              );
            }
            hoveredPolygonId = null;
          });
  
          map.on("click", "countries_fill", (e) => {
            clicked_country = e.features[0].properties.ADMIN;
            zoomToCountry(clicked_country);
            drawLocations(clicked_country);
            dispatch("polygonClick", clicked_country);
          });
  
          adjustMapForWindowSize();
          window.addEventListener("resize", adjustMapForWindowSize);
  
          var dashLength = 3;
          var gapLength = 1;
  
          // We divide the animation up into 40 steps to make careful use of the finite space in
          // LineAtlas
          var steps = 60;
          // A # of steps proportional to the dashLength are devoted to manipulating the dash
          var dashSteps = (steps * dashLength) / (gapLength + dashLength);
          // A # of steps proportional to the gapLength are devoted to manipulating the gap
          var gapSteps = steps - dashSteps;
  
          // The current step #
          var step = 0;
  
          setInterval(function () {
            step = step + 1;
            if (step >= steps) step = 0;
  
            var t, a, b, c, d;
            if (step < dashSteps) {
              t = step / dashSteps;
              a = (1 - t) * dashLength;
              b = gapLength;
              c = t * dashLength;
              d = 0;
            } else {
              t = (step - dashSteps) / gapSteps;
              a = 0;
              b = (1 - t) * gapLength;
              c = dashLength;
              d = t * gapLength;
            }
  
            map.setPaintProperty("shipline", "line-dasharray", [a, b, c, d]);
          }, 25);
        } else {
          // If the source exists, update the data and filter
          map.getSource("countries").setData(mygeojson);
          map.setFilter("countries-layer", [
            "in",
            ["get", "ADMIN"],
            ["literal", countryNames],
          ]);
        }
        dispatch("mapLoaded");
      });
    }
  
    function drawLocations(country) {
      let filteredCountry = births_per_colony.filter(
        (item) => item[0] == country,
      );
  
      //constructing geojson
      let local_conflict_geojson = [];
      filteredCountry[0][1].forEach(function (d) {
        let to_push = {
          type: "Feature",
          properties: {
            id: d.id,
            forename: d.forename,
            surname: d.surname,
          },
          geometry: {
            type: "Point",
            coordinates: [d.birth_location.longitude, d.birth_location.latitude],
          },
        };
        local_conflict_geojson.push(to_push);
      });
  
      const geojson_data = {
        type: "FeatureCollection",
        features: local_conflict_geojson,
      };
  
      map.addSource("locations", {
        type: "geojson",
        data: geojson_data,
        generateId: true, //This ensures that all features have unique IDs
      });
      //circles for agreements
      map.addLayer({
        id: "population",
        type: "circle",
        source: "locations",
        paint: {
          "circle-opacity": 0.8,
          "circle-stroke-width": 1.5,
          "circle-radius": 4,
          "circle-color": "yellow",
        },
      });
    }
  
    function zoomToCountry(clicked_colony) {
      if (clicked_colony == "America") {
        map.flyTo({ center: [-88, 39], zoom: 4 });
      } else if (clicked_colony == "Caribbean") {
        map.flyTo({ center: [-62, 18], zoom: 4 });
      } else if (clicked_colony == "Australia") {
        map.flyTo({ center: [147, -33], zoom: 4 });
      } else if (clicked_colony == "India") {
        map.flyTo({ center: [88, 22], zoom: 4 });
      } else if (clicked_colony == "Africa") {
        map.flyTo({ center: [25, -23], zoom: 4 });
      } else if (clicked_colony == "Asia") {
        map.flyTo({ center: [118, 6], zoom: 4 });
      }
    }
  
    onMount(() => {
      window.scrollTo(0, 0);
  
      mapboxgl.accessToken =
        "pk.eyJ1IjoidG9tYXN2YW5jaXNpbiIsImEiOiJjajF6M3VieDQwMDB2MzNxbXlpc3BzaW02In0.ZgGNabXd7yu15BHiN62GCQ";
  
      // Initialize the Mapbox map
      map = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/tomasvancisin/cm0i5fpy4004b01qodg9g2awr",
        center: [50, 22],
        zoom: 2.5,
        maxZoom: 5,
      });
    });
  
    $: if (map && countryNames && map.getSource("countries")) {
      // Ensure the map and source are loaded before updating the filter
      map.setFilter("countries-layer", [
        "in",
        ["get", "ADMIN"],
        ["literal", countryNames],
      ]);
    }
  
    function flyToInitialPosition() {
      map.flyTo({ center: [50, 22], zoom: current_zoom });
    }
  
    export { flyToInitialPosition };
  </script>
  
  <div class="map-container" bind:clientHeight={height}>
    <div id="map" bind:this={map}></div>
  </div>
  
  <style>
    .map-container {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
    }
  
    #map {
      width: 100%;
      height: 100%;
    }
  
    div {
      position: absolute;
      top: 0;
      bottom: 0;
      width: 100%;
    }
  </style>
  