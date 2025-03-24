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
    let hoveredPolygonIdFatal = null;
    let hoveredClusterId = null;
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
        // map.removeLayer("population");
        // map.removeSource("locations");
        // map.off("click", "population");
        // map.off("mousemove", "population");
        // map.off("mouseleave", "population");
        drawLocations(
            data,
            current_data_string,
            "redrawing if current_data changes",
        );
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
        drawLocations(filtered_country, current_data_string, "year filter");
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
        drawLocations(fin_career, current_data_string, "career filter");
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
        drawLocations(fin_degree, current_data_string, "degree filter");
    } else if (selectedDegree.length == 0 && selected_country !== null) {
        // drawLocations(def_data, current_data_string);
        // data = def_data;
        // console.log("degree filter log");
    }

    // $: if (
    //     selectedCareer.length == 0 &&
    //     selectedDegree.length == 0 &&
    //     selectedCollege.length == 0 &&
    //     selected_country !== null
    // ) {
    //     drawLocations(def_data, current_data_string, "all filters are zero");
    //     data = def_data;
    // }

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
        drawLocations(fin_college, current_data_string, "college filter");
    } else if (selectedCollege.length == 0 && selected_country !== null) {
        // drawLocations(def_data, current_data_string);
        // data = def_data;
        // console.log("college filter log");
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

    $: before1869 = [];
    $: after1869 = [];

    function divideByYear(data, threshold = 1869) {
        before1869 = [];
        after1869 = [];

        data.forEach((person) => {
            let year = null;
            // Check study.colleges
            if (person.study?.colleges?.length > 0) {
                year = parseInt(person.study.colleges[0].from, 10);
            }
            // If no valid year in colleges, check study.degrees
            else if (person.study?.degrees?.length > 0) {
                year = parseInt(person.study.degrees[0].date, 10);
            }

            // Categorize the person based on the extracted year
            if (year) {
                if (year > threshold) {
                    after1869.push(person);
                } else {
                    before1869.push(person);
                }
            } else {
                // If no year is found, optionally handle it (e.g., log it or put it in a separate array)
                console.warn("No valid year found for:", person);
            }
        });
    }

    $: divideByYear(filteredData);

    // Conditional grouping based on current_data_string
    $: filtered_grouped_colonies_before1869 =
        current_data_string === "birth"
            ? d3.groups(before1869, (d) => d.birth_location.colony)
            : d3.groups(
                  flattenFloruit(before1869),
                  (d) => d.floruit.location.colony,
              );

    $: filtered_grouped_colonies_after1869 =
        current_data_string === "birth"
            ? d3.groups(after1869, (d) => d.birth_location.colony)
            : d3.groups(
                  flattenFloruit(after1869),
                  (d) => d.floruit.location.colony,
              );

    //// COLONIES GEOJSON FOR DIFFERENT PERIODS
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

    // mapbox expresssion for width changes
    $: filtered_width_before1869 = width_generator(
        filtered_grouped_colonies_before1869,
    );
    $: filtered_width_after1869 = width_generator(
        filtered_grouped_colonies_after1869,
    );
    $: width_mapbox_expression_before1869 = getWidthExpression(
        filtered_width_before1869,
    );
    $: width_mapbox_expression_after1869 = getWidthExpression(
        filtered_width_after1869,
    );
    $: countryNames = filtered_width_before1869
        .filter((item) => item[0] !== undefined) // Ignore undefined values
        .map((item) => item[0]); // Extract the country names

    // change line width
    $: if (map && countryNames && map.getSource("countries")) {
        countryNames.push("Britain");
        map.setPaintProperty(
            "shipline_before1869",
            "line-width",
            width_mapbox_expression_before1869,
        );
        map.setPaintProperty(
            "shipline_after1869",
            "line-width",
            width_mapbox_expression_after1869,
        );
    }
    // shipping lines in 1869
    // $: if (map && selectedYears[1] > 1869 && map.getSource("shipping")) {
    //     map.getSource("shipping").setData(suez);
    // } else if (map && selectedYears[1] <= 1869 && map.getSource("shipping")) {
    //     map.getSource("shipping").setData(shipping_json);
    // }

    //// ZOOM ADJUSTMENT
    function adjustMapForWindowSize() {
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

    //// INIT
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
                            "#F17822",
                            "#33d3ff",
                        ],
                        "fill-opacity": [
                            "match",
                            ["get", "ADMIN"],
                            "Britain",
                            0.8,
                            0.4,
                        ],
                        // "fill-opacity": 0.4,
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
                map.addSource("shipping_after1869", {
                    type: "geojson",
                    data: suez,
                    generateId: true, // Ensures all features have unique IDs
                });
                map.addSource("shipping_before1869", {
                    type: "geojson",
                    data: shipping_json,
                    generateId: true, // Ensures all features have unique IDs
                });

                map.addLayer({
                    id: "shipline_after1869",
                    type: "line",
                    source: "shipping_after1869",
                    paint: {
                        "line-color": "white",
                        "line-width": [
                            "match",
                            ["get", "ADMIN"],
                            "India",
                            0.271,
                            "Australia",
                            0.2,
                            "Asia",
                            0.042,
                            "Africa",
                            0.614,
                            "Caribbean",
                            0.114,
                            "America",
                            0.328,
                            0,
                        ],
                        // "line-dasharray": [3, 0.5],
                    },
                });

                map.addLayer({
                    id: "shipline_before1869",
                    type: "line",
                    source: "shipping_before1869",
                    paint: {
                        "line-color": "white",
                        "line-width": [
                            "match",
                            ["get", "ADMIN"],
                            "India",
                            0.642,
                            "Australia",
                            0.042,
                            "Asia",
                            0.014,
                            "Africa",
                            0.057,
                            "Caribbean",
                            0.271,
                            "America",
                            0.385,
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
                        "line-color": "white",
                        "line-width": [
                            "case",
                            ["boolean", ["feature-state", "hover"], false],
                            0.5,
                            0,
                        ],
                    },
                    filter: ["in", ["get", "ADMIN"], ["literal", countryNames]],
                });

                // highlight polygon on hover
                map.on("mousemove", "countries_fill", (e) => {
                    if (hoveredClusterId !== null) return; // Prevent highlighting when over a cluster

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

                // clicking events and checking if circle was clicked
                map.on("click", (e) => {
                    // Check if a circle was clicked
                    let circleFeatures = map.queryRenderedFeatures(e.point, {
                        layers: ["clusters"],
                    });

                    if (circleFeatures.length > 0) {
                        e.originalEvent.stopPropagation();
                        return;
                    }

                    // Otherwise, handle the polygon click event
                    let polygonFeatures = map.queryRenderedFeatures(e.point, {
                        layers: ["countries_fill"],
                    });

                    if (polygonFeatures.length > 0) {
                        let clicked_country =
                            polygonFeatures[0].properties.ADMIN;
                        if (clicked_country !== "Britain") {
                            zoomToCountry(clicked_country);
                            dispatch("polygonClick", clicked_country);
                        }
                    }
                });

                // draw individual locations
                drawLocations(data, current_data_string, "initial draw");

                // animateShipping();
                window.addEventListener("resize", adjustMapForWindowSize);
                adjustMapForWindowSize();
            }

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
                            floruitEntry.location.original_name ||
                            floruitEntry.location.official_name; // Group by colony

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

    let fatal_popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
    });

    // Function to create HTML content from an array of people
    function createPopupContent(peopleArray) {
        return `
                <p style="margin: 2px"> ${peopleArray}</p>
        `;
    }
    function handleMouseMove(e) {
        let city = e.features[0].properties.id;

        let popupContent = `<div style="color: black; font-family:Montserrat; font-weight:500;">
                ${createPopupContent(city)}</div>`;

        map.getCanvas().style.cursor = "pointer";
        if (e.features.length > 0) {
            if (hoveredPolygonIdFatal !== null) {
                map.setFeatureState(
                    { source: "locations", id: hoveredPolygonIdFatal },
                    { hover: false },
                );
            }
            hoveredPolygonIdFatal = e.features[0].id;
            map.setFeatureState(
                { source: "locations", id: hoveredPolygonIdFatal },
                { hover: true },
            );

            fatal_popup.setLngLat(e.lngLat).setHTML(popupContent).addTo(map);
        }
    }

    let populationClickListenerAdded = false;

    //DRAW INDIVIDUAL LOCATIONS WHEN COLONY CLICKED
    function drawLocations(data, which, reason) {
        console.log("🔄 drawLocations called", reason);

        let local_conflict_geojson = [];
        if (which == "birth") {
            let group_by_location = d3.groups(data, (d) => {
                return (
                    d.birth_location.original_name ||
                    d.birth_location.official_name
                );
            });
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
                cluster: true, // Enable clustering
                clusterMaxZoom: 14, // Clusters disappear after zoom level 14
                clusterRadius: 50, // Controls how close points must be to form a cluster
                clusterProperties: {
                    total_people: ["+", ["get", "no_of_ppl"]], // Sum 'no_of_ppl' in each cluster
                },
            });

            map.addLayer({
                id: "clusters",
                type: "circle",
                source: "locations",
                filter: ["has", "point_count"], // Show only clusters
                paint: {
                    "circle-color": "white",
                    "circle-radius": [
                        "step",
                        ["get", "total_people"],
                        10,
                        10,
                        15,
                        50,
                        25,
                        100,
                        35,
                    ],
                    "circle-opacity": 0.8,
                    "circle-stroke-width": [
                        "case",
                        ["boolean", ["feature-state", "hover"], false],
                        3, // Stroke width when hovered
                        0.5, // Default stroke width
                    ],
                    "circle-stroke-color": "#FFD700", // Highlight color (gold)
                },
            });

            map.addLayer({
                id: "cluster-count",
                type: "symbol",
                source: "locations",
                filter: ["has", "point_count"],
                layout: {
                    "text-field": "{total_people}", // Show the sum of 'no_of_ppl' instead of the number of points
                    "text-font": ["Open Sans Bold"],
                    "text-size": 12,
                },
            });

            map.addLayer({
                id: "unclustered-point",
                type: "circle",
                source: "locations",
                filter: ["!", ["has", "point_count"]], // Show only non-clustered points
                paint: {
                    "circle-color": "white",
                    "circle-radius": [
                        "interpolate",
                        ["linear"],
                        ["get", "no_of_ppl"],
                        1,
                        3, // 3px radius for 1 person
                        10,
                        10,
                    ],
                    "circle-stroke-width": 1,
                    "circle-stroke-color": "gray",
                },
            });

            map.on("click", "clusters", function (e) {
                const features = map.queryRenderedFeatures(e.point, {
                    layers: ["clusters"],
                });
                if (!features.length) return;

                const clusterId = features[0].properties.cluster_id;

                // Get all points inside the clicked cluster
                map.getSource("locations").getClusterLeaves(
                    clusterId,
                    100,
                    0,
                    function (err, leaves) {
                        if (err) {
                            console.error(
                                "Error retrieving cluster leaves:",
                                err,
                            );
                            return;
                        }

                        // Extract, parse, and flatten all people_array values
                        const allPeople = leaves
                            .map((leaf) => leaf.properties.people_array) // Extract people_array (each entry is an array)
                            .flat(); // Flatten into a single array
                        // pass the array to App.svelte
                        dispatch("clusterClick", allPeople);
                    },
                );
            });

            // Highlight cluster on hover
            map.on("mousemove", "clusters", (e) => {
                map.getCanvas().style.cursor = "pointer";

                // Remove polygon highlight when hovering over a cluster
                if (hoveredPolygonId !== null) {
                    map.setFeatureState(
                        { source: "countries", id: hoveredPolygonId },
                        { hover: false },
                    );
                    hoveredPolygonId = null; // Reset
                }

                // Highlight the cluster
                if (hoveredClusterId !== null) {
                    map.setFeatureState(
                        { source: "locations", id: hoveredClusterId },
                        { hover: false },
                    );
                }

                hoveredClusterId = e.features[0].id;

                map.setFeatureState(
                    { source: "locations", id: hoveredClusterId },
                    { hover: true },
                );
            });

            // Remove highlight when mouse leaves
            map.on("mouseleave", "clusters", () => {
                map.getCanvas().style.cursor = "";

                if (hoveredClusterId !== null) {
                    map.setFeatureState(
                        { source: "locations", id: hoveredClusterId },
                        { hover: false },
                    );
                }
                hoveredClusterId = null;
            });

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

            // // Only add click listener ONCE
            // if (!populationClickListenerAdded) {
            //     populationClickListenerAdded = true;
            //     console.log("✅ Attaching population click event listener...");

            //     map.on("click", "population", (e) => {
            //         e.originalEvent.stopPropagation();
            //         let city = e.features[0].properties.id;
            //         dispatch("cityClick", city);
            //     });
            // }
        }
    }

    //ZOOM IN TO CLICKED COLONY
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
    :global(.mapboxgl-popup-content) {
        padding: 5px;
    }
</style>
