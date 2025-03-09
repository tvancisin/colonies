<script>
    import { onMount, createEventDispatcher } from "svelte";
    import mapboxgl from "mapbox-gl";
    import * as d3 from "d3";
    import {
        year_filter,
        getWidthExpression,
        width_generator,
        career,
        degree,
        college,
    } from "../utils";
    import {
        selectedYearsStore,
        selectedGenderStore,
        selectedCareerStore,
        selectedDegreeStore,
        selectedCollegeStore,
    } from "../years";
    const dispatch = createEventDispatcher();

    export let current_data; // data from App.svelte
    export let current_data_string;
    export let map;
    export let shipping_json;
    export let suez;
    export let colonies_1680;
    export let colonies_1750;
    export let colonies_1820;
    export let colonies_1885;
    export let selected_country;

    let height;
    let def_data;
    let data;
    let clicked_country;
    let countryNames;
    let hoveredPolygonId = null;
    let selectedYears = [1700, 1900];
    let selectedCareer;
    let selectedDegree;
    let selectedCollege;

    //catch new selected years
    const unsubscribe = selectedYearsStore.subscribe((value) => {
        selectedYears = value;
    });
    //catch new selected career
    const career_unsubscribe = selectedCareerStore.subscribe((value) => {
        selectedCareer = value;
    });

    //catch new selected degree
    const degree_unsubscribe = selectedDegreeStore.subscribe((value) => {
        selectedDegree = value;
    });

    //catch new selected college
    const college_unsubscribe = selectedCollegeStore.subscribe((value) => {
        selectedCollege = value;
    });

    // redrawing locations if current_data changes [used on exit also]
    $: if (data && map && map.getSource("locations")) {
        map.removeLayer("population");
        map.removeSource("locations");
        drawLocations(data, current_data_string);
    }

    // assign current_data to default and data
    $: if (current_data) {
        data = current_data;
        def_data = current_data;
    }

    //// YEAR FILTER
    // redraw locations based on years
    $: if (selectedYears.length != 0) {
        // filter to country
        let filtered_country = year_filter(
            data,
            selectedYears[0],
            selectedYears[1],
        );
        // update map locations
        drawLocations(filtered_country, current_data_string);
    }

    //// CAREER FILTER
    $: if (selectedCareer.length != 0) {
        // career groups
        let career_groups = career(data);

        // only selected career
        let fin_career = career_groups[selectedCareer].filter(
            (item, index, self) =>
                index === self.findIndex((t) => t.id === item.id),
        );

        // update data
        data = fin_career;

        // update map locations
        drawLocations(fin_career, current_data_string);
    } else if (selectedCareer.length == 0 && selected_country !== null) {
        // drawLocations(def_data, current_data_string);
        // data = def_data;
        // console.log("career filter log");
    }

    //// DEGREE FILTER
    $: if (selectedDegree.length != 0) {
        // degree groups
        let degree_groups = degree(data);

        // only selected degree
        let fin_degree = degree_groups[selectedDegree].filter(
            (item, index, self) =>
                index === self.findIndex((t) => t.id === item.id),
        );

        // update data
        data = fin_degree;

        // update map locations
        drawLocations(fin_degree, current_data_string);
    } else if (selectedDegree.length == 0 && selected_country !== null) {
        // drawLocations(def_data, current_data_string);
        // data = def_data;
        // console.log("degree filter log");
    }

    $: if (
        selectedCareer.length == 0 &&
        selectedDegree.length == 0 &&
        selectedCollege.length == 0 &&
        selected_country !== null
    ) {
        drawLocations(def_data, current_data_string);
        data = def_data;
    }

    //// COLLEGE FILTER
    $: if (selectedCollege.length != 0) {
        // college groups
        let college_groups = college(data);

        // only selected college
        let fin_college = college_groups[selectedCollege].filter(
            (item, index, self) =>
                index === self.findIndex((t) => t.id === item.id),
        );

        // update data
        data = fin_college;

        // update map locations
        drawLocations(fin_college, current_data_string);
    } else if (selectedCollege.length == 0 && selected_country !== null) {
        // drawLocations(def_data, current_data_string);
        // data = def_data;
        // console.log("college filter log");
    }

    $: console.log(data, selected_country, selectedCollege.length);

    //// SHIPPING LINES
    // restrict to the selected years
    $: filteredData =
        selectedYears && selectedYears.length > 0
            ? year_filter(data, selectedYears[0], selectedYears[1])
            : data; // Use original data if no years are selected

    // Function to flatten floruit objects and associate them with their person
    function flattenFloruit(filteredData) {
        return filteredData.flatMap((person) =>
            person.floruit.map((floruitItem) => ({
                ...person,
                floruit: floruitItem, // Only include the current floruit item
            })),
        );
    }

    // Conditional grouping based on current_data_string
    $: filtered_grouped_colonies =
        current_data_string === "birth"
            ? d3.groups(filteredData, (d) => d.birth_location.colony)
            : d3.groups(
                  flattenFloruit(filteredData),
                  (d) => d.floruit.location.colony,
              );

    // mapbox expresssion for width changes
    $: filtered_width = width_generator(filtered_grouped_colonies);
    $: width_mapbox_expression = getWidthExpression(filtered_width);
    $: countryNames = filtered_width
        .filter((item) => item[0] !== undefined) // Ignore undefined values
        .map((item) => item[0]); // Extract the country names

    // change line width
    $: if (map && countryNames && map.getSource("countries")) {
        countryNames.push("Britain");
        map.setPaintProperty("shipline", "line-width", width_mapbox_expression);
    }

    //// CHANGE COLONIES GEOJSON FOR DIFFERENT PERIODS
    $: if (selectedYears[1] < 1750) {
        map.getSource("countries").setData(colonies_1680);
    } else if (
        selectedYears[1] >= 1750 &&
        selectedYears[1] < 1820 &&
        map.getSource("countries")
    ) {
        map.getSource("countries").setData(colonies_1750);
    } else if (
        selectedYears[1] >= 1820 &&
        selectedYears[1] < 1885 &&
        map.getSource("countries")
    ) {
        map.getSource("countries").setData(colonies_1820);
    } else if (map && selectedYears[1] >= 1885 && map.getSource("countries")) {
        map.getSource("countries").setData(colonies_1885);
    }


    $: if (map && selectedYears[1] > 1869 && map.getSource("shipping")) {
        map.getSource("shipping").setData(suez);
    } else if (map && selectedYears[1] <= 1869 && map.getSource("shipping")) {
        map.getSource("shipping").setData(shipping_json);
    }

    //// ZOOM ADJUSTMENT
    function adjustMapForWindowSize() {
        // console.log(map);

        if (window.innerWidth <= 1000) {
            map.flyTo({
                center: [20, 0],
                zoom: 0.8,
            });
        } else if (window.innerWidth <= 1200) {
            map.flyTo({
                center: [20, 0],
                zoom: 0.9,
            });
        } else if (window.innerWidth >= 1200) {
            map.flyTo({
                center: [20, 0],
                zoom: 1,
            });
        }
    }

    let imageURL = new URL("/uni_logo.png", import.meta.url).href;

    //// INIT FUNCTION
    onMount(() => {
        mapboxgl.accessToken =
            "pk.eyJ1IjoidG9tYXN2YW5jaXNpbiIsImEiOiJjbTN1OXUzODUwZTEwMnFxdHd5NzA3cmNuIn0.vz2M0cTMfPvLAQ-wKMKbQA";

        // Initialize the Mapbox map
        map = new mapboxgl.Map({
            attributionControl: false,
            container: "map",
            style: "mapbox://styles/tomasvancisin/cm63qqxy1004j01s7bp770wpf",
            maxZoom: 8,
            projection: "naturalEarth",
            logoPosition: "top-right",
        });

        const el = document.createElement("div");
        const width = 100;
        const height = 30;
        el.className = "marker";
        el.style.backgroundImage = `url(${imageURL})`;
        el.style.width = `${width}px`;
        el.style.height = `${height}px`;
        el.style.backgroundSize = "100%";

        // Create a default Marker, colored black, rotated 45 degrees.
        new mapboxgl.Marker(el, {
            offset: [width / 3, 0],
        })
            .setLngLat([-2.7967, 56.3398])
            .addTo(map);
    });

    //// DRAW POLYGONS, SHIPPPING LINES, INDIVIDUAL LOCATIONS
    $: if (colonies_1885 && shipping_json && suez && countryNames && map) {
        // Ensure this block runs only after the map has fully loaded
        map.on("load", () => {
            // Check if the source already exists
            if (!map.getSource("countries")) {
                //// COUNTRY POLYGONS
                map.addSource("countries", {
                    type: "geojson",
                    data: colonies_1885,
                    generateId: true, // Ensures all features have unique IDs
                });

                map.addLayer({
                    id: "countries_fill",
                    type: "fill",
                    source: "countries",
                    paint: {
                        "fill-color": [
                            "match",
                            ["get", "ADMIN"],
                            "Britain",
                            "gray",
                            "gray",
                        ],
                        "fill-opacity": 0.7,
                    },
                    filter: ["in", ["get", "ADMIN"], ["literal", countryNames]],
                });

                // HISTORICAL LAYER
                map.addSource("portland", {
                    type: "raster",
                    url: "mapbox://tomasvancisin.30mip8ve",
                });

                map.addLayer({
                    id: "portland",
                    source: "portland",
                    type: "raster",
                    layout: {
                        visibility: "none", // Set the initial visibility explicitly
                    },
                });

                //// SHIPPING LINES
                map.addSource("shipping", {
                    type: "geojson",
                    data: suez,
                    generateId: true, // Ensures all features have unique IDs
                });

                map.addLayer({
                    id: "shipline",
                    type: "line",
                    source: "shipping",
                    paint: {
                        "line-color": "white",
                        "line-width": [
                            "match",
                            ["get", "ADMIN"],
                            "India",
                            3.65,
                            "Australia",
                            0.97,
                            "Asia",
                            0.22,
                            "Africa",
                            2.68,
                            "Caribbean",
                            1.54,
                            "America",
                            2.8,
                            0,
                        ],
                        // "line-dasharray": [3, 0.5],
                    },
                });

                countryNames.push("Britain");

                map.addLayer({
                    id: "countries_outline",
                    type: "line",
                    source: "countries",
                    layout: {},
                    paint: {
                        "line-color": "#a6a6a6",
                        "line-width": [
                            "case",
                            ["boolean", ["feature-state", "hover"], false],
                            1,
                            0,
                        ],
                    },
                    filter: ["in", ["get", "ADMIN"], ["literal", countryNames]],
                });

                // highlight polygon on hover
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

                // remove highlight on leave
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

                // draw individual locations
                drawLocations(data, current_data_string);

                // clicking events
                map.on("click", "countries_fill", (e) => {
                    clicked_country = e.features[0].properties.ADMIN;
                    if (clicked_country != "Britain") {
                        zoomToCountry(clicked_country);
                        dispatch("polygonClick", clicked_country);
                    }
                });

                // animateShipping();
                window.addEventListener("resize", adjustMapForWindowSize);
                adjustMapForWindowSize();
            }

            //
            dispatch("mapLoaded");
        });
    }

    function groupByColony(data) {
        const groupedByColony = {};

        data.forEach((item) => {
            if (item.floruit) {
                item.floruit.forEach((floruitEntry) => {
                    // Only proceed if floruitEntry.location.colony exists
                    if (floruitEntry.location.colony) {
                        const colony =
                            floruitEntry.location.official_name ||
                            floruitEntry.location.original_name; // Group by colony

                        const latitude = floruitEntry.location.latitude;
                        const longitude = floruitEntry.location.longitude;

                        // Initialize the colony group if it doesn't exist
                        if (!groupedByColony[colony]) {
                            groupedByColony[colony] = {
                                items: [],
                                ids: new Set(),
                                coordinates: null, // Add coordinates field, initially null
                            };
                        }

                        // Only add the item if it hasn't been added already
                        if (!groupedByColony[colony].ids.has(item.id)) {
                            groupedByColony[colony].items.push(item);
                            groupedByColony[colony].ids.add(item.id); // Mark the item as added
                        }

                        // Add the coordinates if they haven't been added yet
                        if (!groupedByColony[colony].coordinates) {
                            groupedByColony[colony].coordinates = [
                                latitude,
                                longitude,
                            ];
                        }
                    }
                });
            }
        });

        // Prepare the output structure, including the coordinates
        const outputArray = Object.keys(groupedByColony).map((colony) => {
            return [
                colony,
                groupedByColony[colony].items,
                groupedByColony[colony].coordinates,
            ];
        });

        return outputArray;
    }

    //DRAW INDIVIDUAL LOCATIONS WHEN COLONY CLICKED
    function drawLocations(data, which) {
        // console.log(data, which);
        let local_conflict_geojson = [];
        if (which == "birth") {
            let group_by_location = d3.groups(data, (d) => {
                return (
                    d.birth_location.official_name ||
                    d.birth_location.original_name
                );
            });
            group_by_location.forEach(function (d) {
                let to_push = {
                    type: "Feature",
                    properties: {
                        id: d[0],
                        people_array: JSON.stringify(d[1]),
                        no_of_ppl: d[1].length,
                    },
                    geometry: {
                        type: "Point",
                        coordinates: [
                            d[1][0].birth_location.longitude,
                            d[1][0].birth_location.latitude,
                        ],
                    },
                };
                local_conflict_geojson.push(to_push);
            });
        } else if (which == "floruit") {
            let group_by_location = groupByColony(data);
            group_by_location.forEach(function (d) {
                let to_push = {
                    type: "Feature",
                    properties: {
                        id: d[0],
                        people_array: d[1],
                        no_of_ppl: d[1].length,
                    },
                    geometry: {
                        type: "Point",
                        coordinates: [d[2][1], d[2][0]],
                    },
                };
                local_conflict_geojson.push(to_push);
            });
        }

        const geojson_data = {
            type: "FeatureCollection",
            features: local_conflict_geojson,
        };

        // If source exists, update it
        if (map.getSource("locations")) {
            map.getSource("locations").setData(geojson_data);
        } else {
            // If source doesn't exist, add it and the layer
            map.addSource("locations", {
                type: "geojson",
                data: geojson_data,
                generateId: true, // Ensures that all features have unique IDs
            });

            // Add the circle layer
            map.addLayer({
                id: "population",
                type: "circle",
                source: "locations",
                paint: {
                    "circle-opacity": 0.5,
                    "circle-radius": [
                        "interpolate",
                        ["linear"],
                        ["get", "no_of_ppl"],
                        1,
                        2, // Radius for 1 person
                        10,
                        10, // Radius for 10 people (adjust as needed)
                    ],
                    "circle-color": "black",
                    "circle-stroke-color": "white",
                    "circle-stroke-width": 1,
                },
            });
        }

        // let fatal_popup = new mapboxgl.Popup({
        //     closeButton: false,
        //     closeOnClick: false,
        // });

        // // Function to create HTML content from an array of people
        // function createPopupContent(peopleArray) {
        //     return peopleArray
        //         .map((person) => {
        //             // Destructure with defaults for missing values
        //             const {
        //                 forename = "Unknown",
        //                 surname = "Unknown",
        //                 birth_date = "Unknown",
        //                 death_date = "Unknown",
        //             } = person;

        //             return `
        //     <div style="margin-bottom:10px; line-height: 0.5">
        //         <p> ${forename} ${surname}</p>
        //     </div>
        // `;
        //         })
        //         .join(""); // Join each person's HTML into a single string
        // }

        // function handleMouseMove(e) {
        //     let peopleArray = JSON.parse(
        //         e.features[0].properties.people_array,
        //     );

        //     let popupContent = `<div style="color:black; font-family:Montserrat; font-weight:500;">
        //         ${createPopupContent(peopleArray)}</div>`;

        //     // let forename = e.features[0].properties.forename;
        //     // let surname = e.features[0].properties.surname;
        //     // let birth = e.features[0].properties.birth;

        //     map.getCanvas().style.cursor = "pointer";
        //     if (e.features.length > 0) {
        //         if (hoveredPolygonIdFatal !== null) {
        //             map.setFeatureState(
        //                 { source: "locations", id: hoveredPolygonIdFatal },
        //                 { hover: false },
        //             );
        //         }
        //         hoveredPolygonIdFatal = e.features[0].id;
        //         map.setFeatureState(
        //             { source: "locations", id: hoveredPolygonIdFatal },
        //             { hover: true },
        //         );

        //         fatal_popup
        //             .setLngLat(e.lngLat)
        //             .setHTML(popupContent)
        //             .addTo(map);
        //     }
        // }

        // map.on("mousemove", "population", handleMouseMove);

        // // When the mouse leaves the state-fill layer, update the feature state of the
        // // previously hovered feature.
        // map.on("mouseleave", `population`, () => {
        //     map.getCanvas().style.cursor = "";
        //     if (hoveredPolygonIdFatal !== null) {
        //         map.setFeatureState(
        //             { source: "locations", id: hoveredPolygonIdFatal },
        //             { hover: false },
        //         );
        //     }
        //     hoveredPolygonIdFatal = null;
        //     fatal_popup.remove();
        // });
    }

    //ZOOM IN TO CLICKED COUNTRY
    function zoomToCountry(clicked_colony) {
        if (clicked_colony == "America") {
            map.flyTo({ center: [-90, 50], zoom: 3 });
        } else if (clicked_colony == "Caribbean") {
            map.flyTo({ center: [-70, 10], zoom: 3 });
        } else if (clicked_colony == "Australia") {
            map.flyTo({ center: [135, -31], zoom: 3 });
        } else if (clicked_colony == "India") {
            map.flyTo({ center: [75, 20], zoom: 3 });
        } else if (clicked_colony == "Africa") {
            map.flyTo({ center: [30, -30], zoom: 3 });
        } else if (clicked_colony == "Asia") {
            map.flyTo({ center: [110, 6], zoom: 3 });
        }
    }

    //RESET DEFAULT ZOOM AND FLY TO INITIAL COORDINATES
    function flyToInitialPosition() {
        map.flyTo({ center: [20, 0], zoom: 1.2 });
    }

    export { flyToInitialPosition };

    // switch between historical layers
    function toggleLayer(checkbox) {
        const visibility = map.getLayoutProperty("portland", "visibility");

        if (checkbox.checked) {
            // Show the layer
            if (visibility === "none") {
                map.setLayoutProperty("portland", "visibility", "visible");
            }
        } else {
            // Hide the layer
            if (visibility === "visible" || !visibility) {
                map.setLayoutProperty("portland", "visibility", "none");
            }
        }
    }
</script>

<div class="map-container" bind:clientHeight={height}>
    <div id="map" bind:this={map}></div>
    <div class="toggle-container">
        <label class="toggle-switch">
            <input
                type="checkbox"
                id="toggle-layer"
                on:change={(e) => toggleLayer(e.target)}
            />
            <span class="slider"></span>
        </label>
        <p class="toggle-text">Historical Layer</p>
    </div>
</div>

<style>
    .map-container {
        position: relative;
        width: calc(100% - 500px);
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        bottom: -3px;
    }

    @media (max-width: 768px) {
        .map-container {
            width: 100%;
            height: 50%;
        }
    }

    #map {
        width: 100%;
        height: 100%;
    }

    .toggle-container {
        display: flex;
        position: absolute;
        top: 40px;
        right: 10px;
        flex-direction: column;
        align-items: center;
        gap: 10px; /* Space between the toggle and the text */
        font-family: Arial, sans-serif;
        text-align: center;
    }

    .toggle-switch {
        position: relative;
        display: inline-block;
        width: 50px;
        height: 25px;
    }

    .toggle-switch input {
        opacity: 0;
        width: 0;
        height: 0;
    }

    .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #7d7d7d;
        transition: 0.4s;
        border-radius: 25px;
    }

    .slider:before {
        position: absolute;
        content: "";
        height: 21px;
        width: 21px;
        left: 2px;
        bottom: 2px;
        background-color: white;
        transition: 0.4s;
        border-radius: 50%;
    }

    input:checked + .slider {
        background-color: #2196f3;
    }

    input:checked + .slider:before {
        transform: translateX(25px);
    }

    .toggle-text {
        margin: 0;
        font-size: 12px;
        font-family: "Montserrat";
        font-weight: 400;
        color: #ffffff;
    }
</style>
