<script>
  import { onMount } from "svelte";
  import {
    getJSON,
    getGeo,
    india_colonies,
    african_colonies,
    america_colonies,
    australia_colonies,
    asian_colonies,
    caribbean_colonies,
    groupByColony,
    career,
  } from "./utils.js";
  import * as d3 from "d3";
  import Map from "./lib/Map.svelte";
  import Details from "./lib/Details.svelte";
  import Timeline from "./lib/Timeline.svelte";
  import {
    selectedYearsStore,
    selectedCareerStore,
    selectedDegreeStore,
    selectedGenderStore,
  } from "./years";
  import Home from "./ui/Home.svelte";
  import About from "./ui/About.svelte";
  import Provenance from "./ui/Provenance.svelte";

  // INIT
  onMount(() => {
    // Disable automatic scroll restoration
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    // Scroll to top on page load
    window.scrollTo({ top: 0, behavior: "auto" });
  });

  let width, height, map;
  let mapRef;
  let current_data;
  let current_data_string;
  let selected_country = null;
  let legend_height = 50;
  let legend_width = 200;
  let isOverlayVisible = true; // Controls the visibility of the overlay
  let sections = [
    { id: "all", name: "All" },
    { id: "education", name: "Education" },
    { id: "religion", name: "Religion" },
    { id: "medicine", name: "Medicine" },
    { id: "military", name: "Military" },
  ];

  //load biographical data
  let path = ["./data/birth_colonies.json", "./data/floruit_colonies.json"];
  let birth_data;
  let floruit_data;
  let births_per_colony;
  let floruit_per_colony;

  // remove initial div
  function removeOverlay() {
    isOverlayVisible = false;
  }

  getJSON(path).then((json) => {
    birth_data = json[0];
    floruit_data = json[1];

    //add colonies field to bio location data
    let birth_colony_division = birth_data.map((item) => {
      if (india_colonies.includes(item.birth_location.country)) {
        item.birth_location.colony = "India";
      } else if (america_colonies.includes(item.birth_location.country)) {
        item.birth_location.colony = "America";
      } else if (australia_colonies.includes(item.birth_location.country)) {
        item.birth_location.colony = "Australia";
      } else if (caribbean_colonies.includes(item.birth_location.country)) {
        item.birth_location.colony = "Caribbean";
      } else if (asian_colonies.includes(item.birth_location.country)) {
        item.birth_location.colony = "Asia";
      } else if (african_colonies.includes(item.birth_location.country)) {
        item.birth_location.colony = "Africa";
      }
      return item;
    });

    births_per_colony = d3.groups(
      birth_colony_division,
      (d) => d.birth_location.colony,
    );

    floruit_data.forEach(function (person) {
      // If floruit is not an array, convert it into one
      if (!Array.isArray(person.floruit)) {
        person.floruit = [person.floruit];
      }
    });

    //add colonies field to bio location data
    floruit_data.forEach((person) => {
      if (person.floruit && Array.isArray(person.floruit)) {
        person.floruit.forEach((floruitItem) => {
          const country = floruitItem.location?.country;

          if (caribbean_colonies.includes(country)) {
            floruitItem.location.colony = "Caribbean";
          } else if (america_colonies.includes(country)) {
            floruitItem.location.colony = "America";
          } else if (india_colonies.includes(country)) {
            floruitItem.location.colony = "India";
          } else if (african_colonies.includes(country)) {
            floruitItem.location.colony = "Africa";
          } else if (australia_colonies.includes(country)) {
            floruitItem.location.colony = "Australia";
          } else if (asian_colonies.includes(country)) {
            floruitItem.location.colony = "Asia";
          }
        });
      }
    });

    floruit_per_colony = groupByColony(floruit_data);
    current_data = birth_data;
    current_data_string = "birth";
  });

  //load geojson countries
  let countries_json;
  let shipping_json;
  let colonies_1680;
  let colonies_1750;
  let colonies_1820;
  let colonies_1885;
  const json_paths = [
    "./data/colony_divisions.json",
    "./data/shipping_routes.json",
    "./data/colonies_1680.json",
    "./data/colonies_1750.json",
    "./data/colonies_1820.json",
    "./data/colonies_1885.json",
  ];
  getGeo(json_paths).then((geo) => {
    countries_json = geo[0];
    shipping_json = geo[1];
    colonies_1680 = geo[2];
    colonies_1750 = geo[3];
    colonies_1820 = geo[4];
    colonies_1885 = geo[5];
  });

  function handlePolygonClick(event) {
    selected_country = event.detail;
    let new_data;

    if (current_data_string == "birth") {
      new_data = births_per_colony.find(
        (item) => item[0] === selected_country,
      )?.[1];
    } else if (current_data_string == "floruit") {
      new_data = floruit_per_colony.find(
        (item) => item[0] === selected_country,
      )?.[1];
    }

    if (new_data !== current_data) {
      // Only update if value changes
      current_data = new_data;
    }
  }

  function handleClose() {
    //reset data on details close
    if (current_data_string == "birth") {
      current_data = birth_data;
    } else if (current_data_string == "floruit") {
      current_data = floruit_data;
    }
    selected_country = null;
    selectedCareerStore.set([]);
    selectedYearsStore.set([]);
    selectedDegreeStore.set([]);
    mapRef.flyToInitialPosition();
  }

  //set variables based on selection (birth or floruit)
  function change_data(selected_data) {
    if (selected_data == "birth") {
      d3.select("#header").text("Student Births in the Colonies (1700-1897)");
      d3.select("#floruit").style("background-color", "gray");
      d3.select("#birth").style("background-color", "white");
      current_data = birth_data;
      current_data_string = selected_data;
    } else if (selected_data == "floruit") {
      d3.select("#header").text("Student Careers in the Colonies (1700-1897)");
      d3.select("#floruit").style("background-color", "white");
      d3.select("#birth").style("background-color", "gray");
      current_data = floruit_data;
      current_data_string = selected_data;
    }
  }
</script>

<main bind:clientWidth={width}>
  <Home />
  <About />
  <Provenance />
  <!-- visualization -->
  <div
    id="vis"
    bind:clientWidth={width}
    style="height: calc(var(--vh, 1vh) * 100);"
  >
    {#if countries_json && shipping_json && current_data && births_per_colony && floruit_per_colony}
      <Map
        {current_data}
        {current_data_string}
        {shipping_json}
        {colonies_1680}
        {colonies_1750}
        {colonies_1820}
        {colonies_1885}
        {selected_country}
        bind:this={mapRef}
        bind:map
        on:polygonClick={handlePolygonClick}
      />
      <div id="buttons">
        <button
          id="birth"
          on:click={() => {
            change_data("birth");
          }}>Birth</button
        >
        <button
          id="floruit"
          on:click={() => {
            change_data("floruit");
          }}
        >
          Career
        </button>
      </div>
      <div id="time_description">Students Entering University</div>
      <!-- Navigation Menu -->
      <Timeline {current_data} {selected_country} />
      <Details
        {current_data}
        {births_per_colony}
        {floruit_per_colony}
        {selected_country}
        {current_data_string}
        on:close={handleClose}
      />
    {/if}
    {#if isOverlayVisible}
      <div class="overlay">
        <button class="remove-overlay" on:click={removeOverlay}
          >Click to Explore</button
        >
      </div>
    {/if}
  </div>
</main>

<style>
  .overlay {
    position: absolute;
    left: 0;
    bottom: 0px;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.3);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100;
  }

  .remove-overlay {
    color: black;
    width: 150px;
    height: 150px;
    border-radius: 50%;
    border: none;
    background-color: rgba(255, 255, 255, 0.8);
    font-family: "Montserrat", sans-serif;
    font-size: 20px;
    font-optical-sizing: auto;
    font-weight: 400;
    font-style: normal;
  }

  .remove-overlay:hover {
    cursor: pointer;
    background-color: red;
    color: white;
  }

  main {
    position: relative;
    align-items: center;
    font-family: "Montserrat", sans-serif;
    font-optical-sizing: auto;
    font-weight: 300;
    font-style: normal;
  }

  #time_description {
    border-radius: 2px;
    position: absolute;
    color: white;
    left: 45px;
    bottom: 110px;
    font-weight: 400;
    font-size: 14px;
    padding: 5px;
  }

  #buttons {
    position: absolute;
    top: 10px;
    left: 5px;
    padding: 0px;
    margin: 0px;
    transition: top 0.3s ease;
  }

  #birth,
  #floruit {
    border: none;
    border-radius: 2px;
    color: black;
    padding: 5px 0px;
    width: 75px;
    text-align: center;
    font-family: "Montserrat", sans-serif;
    font-weight: 450;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 0px;
    transition: box-shadow 0.2s ease-in-out; /* Smooth transition */
    cursor: pointer;
  }

  /* Button background colors */
  #birth {
    background-color: white;
  }

  #floruit {
    background-color: gray;
  }
</style>
