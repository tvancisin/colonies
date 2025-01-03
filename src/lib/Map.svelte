<script>
    import { onMount, createEventDispatcher } from "svelte";
    import mapboxgl from "mapbox-gl";
    import * as d3 from "d3";
    import {
        year_filter,
        getWidthExpression,
        width_generator,
        career,
    } from "../utils";
    import {
        selectedYearsStore,
        selectedGenderStore,
        selectedCareerStore,
    } from "../years";
    const dispatch = createEventDispatcher();

    export let current_data; // data from App.svelte
    export let current_data_string;
    export let map;
    export let shipping_json;
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
    let isOverlayVisible = true; // Controls the visibility of the overlay
    //catch new selected years
    const unsubscribe = selectedYearsStore.subscribe((value) => {
        selectedYears = value;
    });
    //catch new selected career
    const career_unsubscribe = selectedCareerStore.subscribe((value) => {
        selectedCareer = value;
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
    $: if (selectedCareer.length != 0 && selected_country !== null) {
        // construct career groups based on clicked country
        let career_groups = career(data);
        // only get people with selected career
        let fin_career = career_groups[selectedCareer].filter(
            (item, index, self) =>
                index === self.findIndex((t) => t.id === item.id),
        );

        // work only with this data when career selected
        data = fin_career

        // update map locations
        drawLocations(fin_career, current_data_string);
    } else if (selectedCareer.length == 0 && selected_country !== null) {
        drawLocations(def_data, current_data_string);
        data = def_data;
    }

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

    //// ZOOM ADJUSTMENT
    function adjustMapForWindowSize() {
        if (window.innerWidth <= 768) {
            map.flyTo({
                center: [13, 10],
                zoom: 1.3,
            });
        } else if (window.innerWidth <= 1300 || window.innerHeight <= 720) {
            map.flyTo({
                center: [13, 10],
                zoom: 1.5,
            });
        } else {
            map.flyTo({
                center: [13, 10],
                zoom: 2,
            });
        }
    }

    // remove initial div
    function removeOverlay() {
        isOverlayVisible = false;
    }

    //// INIT FUNCTION
    onMount(() => {
        mapboxgl.accessToken =
            "pk.eyJ1IjoidG9tYXN2YW5jaXNpbiIsImEiOiJjbTN1OXUzODUwZTEwMnFxdHd5NzA3cmNuIn0.vz2M0cTMfPvLAQ-wKMKbQA";

        // Initialize the Mapbox map
        map = new mapboxgl.Map({
            attributionControl: false,
            container: "map",
            style: "mapbox://styles/tomasvancisin/cm0i5fpy4004b01qodg9g2awr",
            center: [13, 10],
            zoom: 2,
            maxZoom: 8,
            minZoom: 1.3,
            projection: "naturalEarth",
            logoPosition: "top-right",
        });
    });

    //// DRAW POLYGONS, SHIPPPING LINES, INDIVIDUAL LOCATIONS
    $: if (colonies_1885 && shipping_json && countryNames && map) {
        // Ensure this block runs only after the map has fully loaded
        map.on("load", () => {
            // Check if the source already exists
            if (!map.getSource("countries")) {
                //// SHIPPING LINES
                map.addSource("shipping", {
                    type: "geojson",
                    data: shipping_json,
                    generateId: true, // Ensures all features have unique IDs
                });

                map.addLayer({
                    id: "shipline",
                    type: "line",
                    source: "shipping",
                    paint: {
                        "line-color": "black",
                        "line-opacity": 0.7,
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
                        "fill-opacity": 0.5,
                    },
                    filter: ["in", ["get", "ADMIN"], ["literal", countryNames]],
                });

                countryNames.push("Britain");

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
                adjustMapForWindowSize();
                window.addEventListener("resize", adjustMapForWindowSize);
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
            map.flyTo({ center: [-70, 50], zoom: 3 });
        } else if (clicked_colony == "Caribbean") {
            map.flyTo({ center: [-55, 10], zoom: 3 });
        } else if (clicked_colony == "Australia") {
            map.flyTo({ center: [153, -31], zoom: 3 });
        } else if (clicked_colony == "India") {
            map.flyTo({ center: [98, 20], zoom: 3 });
        } else if (clicked_colony == "Africa") {
            map.flyTo({ center: [40, -30], zoom: 3 });
        } else if (clicked_colony == "Asia") {
            map.flyTo({ center: [118, 6], zoom: 3 });
        }
    }

    //RESET DEFAULT ZOOM AND FLY TO INITIAL COORDINATES
    function flyToInitialPosition() {
        map.flyTo({ center: [13, 10], zoom: 1.5 });
    }

    export { flyToInitialPosition };
</script>

<div class="map-container" bind:clientHeight={height}>
    <div id="map" bind:this={map}></div>
    {#if isOverlayVisible}
        <div class="overlay">
            <button class="remove-overlay" on:click={removeOverlay}
                >Click to Explore</button
            >
        </div>
    {/if}
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

    .overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.3);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 100;
    }

    .remove-overlay {
        color: white;
        width: 150px;
        height: 150px;
        border-radius: 50%;
        border: none;
        background-color: rgba(0, 0, 0, 0.76);
        font-family: "Montserrat", sans-serif;
        font-size: 20px;
        font-optical-sizing: auto;
        font-weight: 400;
        font-style: normal;
    }

    .remove-overlay:hover {
        cursor: pointer;
        background-color: #003645;
    }
</style>
