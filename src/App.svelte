<script>
  import { onMount } from "svelte";
  import {
    getCSV,
    getJSON,
    getGeo,
    india_colonies,
    african_colonies,
    america_colonies,
    australia_colonies,
    asian_colonies,
    caribbean_colonies,
    groupByColony,
    groupByCity,
  } from "./utils.js";
  import * as d3 from "d3";
  import Map from "./lib/Map.svelte";
  import Details from "./lib/Details.svelte";
  import Timeline from "./lib/Timeline.svelte";
  import {
    selectedYearsStore,
    selectedCareerStore,
    selectedDegreeStore,
    selectedCollegeStore,
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

  let width, map;
  let mapRef;
  let default_data;
  let current_data;
  let current_data_string;
  let selected_country = null;
  let isOverlayVisible = true; // Controls the visibility of the overlay
  let selected_gender = "all";

  //load biographical data
  let path = ["./data/birth_colonies.json", "./data/floruit_colonies.json"];
  let csv_path = ["./data/ids.csv"];
  let birth_data;
  let floruit_data;
  let births_per_colony;
  let births_per_city;
  let floruit_per_colony;
  let floruit_per_city;
  let birth_male;
  let birth_female;
  let floruit_male;
  let floruit_female;

  // remove initial div
  function removeOverlay() {
    isOverlayVisible = false;
  }

  Promise.all([getJSON(path), getCSV(csv_path)]).then(([json, csv]) => {
    let ids = csv[0];
    birth_data = json[0];
    floruit_data = json[1];

    let mapByOld = Object.fromEntries(ids.map((d) => [d.old, d.new]));
    // Then, enrich the people array
    birth_data.forEach((person) => {
      if (mapByOld[person.id]) {
        person.new_id = mapByOld[person.id];
      }
    });

    floruit_data.forEach((person) => {
      if (mapByOld[person.id]) {
        person.new_id = mapByOld[person.id];
      }
    });

    let birth_gender = d3.groups(birth_data, (d) => d.gender === "M");
    birth_male = birth_gender[0][1];
    birth_female = birth_gender[1][1];

    let floruit_gender = d3.groups(floruit_data, (d) => d.gender === "M");
    floruit_male = floruit_gender[0][1];
    floruit_female = floruit_gender[1][1];

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
      } else if (item.birth_location.original_name == "West Indies") {
        item.birth_location.colony = "Caribbean";
      } else if (item.birth_location.original_name == "East Indies") {
        item.birth_location.colony = "Asia";
      }

      return item;
    });

    births_per_colony = d3.groups(
      birth_colony_division,
      (d) => d.birth_location.colony,
    );

    births_per_city = d3.groups(
      birth_colony_division,
      (d) => d.birth_location.original_name,
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
          } else if (floruitItem.location.original_name == "West Indies") {
            floruitItem.location.colony = "Caribbean";
          } else if (floruitItem.location.original_name == "East Indies") {
            floruitItem.location.colony = "Asia";
          }
        });
      }
    });

    //add colonies field to bio location data
    floruit_data.map((item) => {
      const loc = item.birth_location;

      if (loc) {
        if (india_colonies.includes(loc.country)) {
          loc.colony = "India";
        } else if (america_colonies.includes(loc.country)) {
          loc.colony = "America";
        } else if (australia_colonies.includes(loc.country)) {
          loc.colony = "Australia";
        } else if (caribbean_colonies.includes(loc.country)) {
          loc.colony = "Caribbean";
        } else if (asian_colonies.includes(loc.country)) {
          loc.colony = "Asia";
        } else if (african_colonies.includes(loc.country)) {
          loc.colony = "Africa";
        } else if (loc.original_name === "West Indies") {
          loc.colony = "Caribbean";
        } else if (loc.original_name === "East Indies") {
          loc.colony = "Asia";
        }
      }

      return item;
    });

    floruit_per_colony = groupByColony(floruit_data);
    floruit_per_city = groupByCity(floruit_data);

    default_data = birth_data;
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
  let suez;
  let all;
  const json_paths = [
    "./data/colony_divisions.json",
    "./data/ship_routes.json",
    "./data/colonies_1680.json",
    "./data/colonies_1750.json",
    "./data/colonies_1820.json",
    "./data/colonies_1885.json",
    "./data/suez_routes.json",
  ];
  getGeo(json_paths).then((geo) => {
    countries_json = geo[0];
    shipping_json = geo[1];
    colonies_1680 = geo[2];
    colonies_1750 = geo[3];
    colonies_1820 = geo[4];
    colonies_1885 = geo[5];
    suez = geo[6];
  });

  function handlePolygonClick(event) {
    selected_country = event.detail;
    let overall_data;
    let new_data;
    if (current_data_string == "birth") {
      // new_data = births_per_colony.find(
      //   (item) => item[0] === selected_country,
      // )?.[1];

      overall_data = births_per_colony.find(
        (item) => item[0] === selected_country,
      )?.[1];

      new_data = current_data.filter(
        (person) => person.birth_location?.colony === selected_country,
      );
    } else if (current_data_string == "floruit") {
      // new_data = floruit_per_colony.find(
      //   (item) => item[0] === selected_country,
      // )?.[1];
      overall_data = floruit_per_colony.find(
        (item) => item[0] === selected_country,
      )?.[1];

      new_data = current_data.filter(
        (person) =>
          Array.isArray(person.floruit) &&
          person.floruit.some((f) => f.location?.colony === selected_country),
      );
    }
    if (new_data !== current_data) {
      // Only update if value changes
      default_data = overall_data;
      current_data = new_data;
    }
  }

  function handleClusterClick(event) {
    let new_data = event.detail;
    if (new_data !== current_data) {
      // Only update if value changes
      default_data = new_data;
      current_data = new_data;
    }
  }

  function handleCityClick(event) {
    let selected_city = event.detail;
    let new_data;
    if (current_data_string == "birth") {
      new_data = births_per_city.find((city) => city[0] === selected_city);
    } else if (current_data_string == "floruit") {
      new_data = floruit_per_city.find((city) => city[0] === selected_city);
    }
    // Only update if value changes
    if (new_data !== current_data) {
      default_data = new_data[1];
      current_data = new_data[1];
    }
  }

  let refresh = 0;
  function handle_refresh() {
    d3.select("#all").style("background-color", "#003847");
    d3.select("#all").style("color", "white");
    d3.selectAll("#male, #female").style("background-color", "white");
    d3.selectAll("#male, #female").style("color", "black");
    //reset data on details close
    if (current_data_string == "birth") {
      current_data = birth_data;
      default_data = birth_data;
    } else if (current_data_string == "floruit") {
      current_data = floruit_data;
      default_data = floruit_data;
    }
    selected_country = null;
    selectedCareerStore.set([]);
    selectedYearsStore.set([]);
    selectedDegreeStore.set([]);
    selectedCollegeStore.set([]);
    mapRef.flyToInitialPosition();
    refresh += 1;
  }

  //set variables based on selection (birth or floruit)
  function handle_birth_floruit(selected_data) {
    // Always reset gender button styles
    updateGenderButtons("all");

    // Update data and styles for birth/floruit selection
    const isBirth = selected_data === "birth";
    const activeTab = isBirth ? "birth" : "floruit";
    const inactiveTab = isBirth ? "floruit" : "birth";

    // Update active/inactive tab styles
    setButtonStyle(activeTab, true);
    setButtonStyle(inactiveTab, false);

    // Set current data and state
    current_data = isBirth ? birth_data : floruit_data;
    default_data = current_data;
    current_data_string = selected_data;
  }

  function setButtonStyle(id, isActive) {
    d3.select(`#${id}`)
      .style("background-color", isActive ? "#003847" : "white")
      .style("color", isActive ? "white" : "black");
  }

  function handle_gender(gender) {
    selected_gender = gender;
    // Filter data only if "birth" or "floruit"
    if (current_data_string === "birth" || current_data_string === "floruit") {
      const maleData = default_data.filter((d) => d.gender === "M");
      const femaleData = default_data.filter((d) => d.gender === "F");
      if (gender === "male") {
        current_data = maleData;
      } else if (gender === "female") {
        current_data = femaleData;
      } else {
        current_data = default_data;
      }
      // Update UI styles
      updateGenderButtons(gender);
    }
  }

  function updateGenderButtons(selected) {
    const allButtons = ["male", "female", "all"];
    allButtons.forEach((id) => {
      const isSelected = id === selected;
      d3.select(`#${id}`).style(
        "background-color",
        isSelected ? "#003847" : "white",
      );
      d3.select(`#${id}`).style("color", isSelected ? "white" : "black");
    });
  }

  // $: console.log(current_data);
</script>

<main bind:clientWidth={width}>
  <Home />
  <About />
  <!-- <Provenance /> -->
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
        {suez}
        {selected_country}
        bind:this={mapRef}
        bind:map
        on:polygonClick={handlePolygonClick}
        on:clusterClick={handleClusterClick}
        on:cityClick={handleCityClick}
      />
      <div id="buttons">
        <button
          id="birth"
          on:click={() => {
            handle_birth_floruit("birth");
          }}>Origin</button
        >
        <button
          id="floruit"
          on:click={() => {
            handle_birth_floruit("floruit");
          }}
        >
          Career
        </button>
      </div>
      <div id="gender">
        <button
          id="male"
          on:click={() => {
            handle_gender("male");
          }}
        >
          Male</button
        ><button
          id="female"
          on:click={() => {
            handle_gender("female");
          }}>Female</button
        ><button
          id="all"
          on:click={() => {
            handle_gender("all");
          }}>All</button
        >
      </div>
      <button class="btn refresh" on:click={handle_refresh}
        >Refresh <i class="fa fa-refresh"></i>
      </button>
      <!-- <div id="time_description">Students Entering University</div> -->
      <!-- Navigation Menu -->
      <Timeline {current_data} {selected_country} {refresh} />
      <Details
        {current_data}
        {births_per_colony}
        {floruit_per_colony}
        {selected_country}
        {current_data_string}
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
    color: rgb(0, 0, 0);
    left: 45px;
    bottom: 120px;
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
    margin: 2px;
  }

  .btn.refresh {
    position: absolute;
    top: 66px;
    left: 7px;
    color: white;
    background-color: steelblue;
    border: 1px solid black;
    padding: 2px 10px;
    border-radius: 2px;
    font-size: 16px;
    cursor: pointer;
    font-family: "Montserrat";
    font-weight: 450;
    transition: border 0.3s ease;
  }

  /* .btn.refresh:hover {
    color: white;
  } */

  #gender {
    z-index: 80;
    position: absolute;
    top: 40px;
    left: 5px;
    padding: 0px;
    margin: 0px;
    transition: top 0.3s ease;
  }

  #gender button {
    margin: 2px;
    border: 1px solid black;
    border-radius: 2px;
    font-family: "Montserrat", sans-serif;
    font-weight: 450;
    font-size: 14px;
    cursor: pointer;
  }

  #birth,
  #floruit {
    border: 1px solid black;
    border-radius: 2px;
    color: black;
    padding: 3px 8px;
    width: 75px;
    text-align: center;
    font-family: "Montserrat", sans-serif;
    font-weight: 450;
    font-size: 16px;
    text-decoration: none;
    display: inline-block;
    margin: 0px;
    transition: box-shadow 0.2s ease-in-out; /* Smooth transition */
    cursor: pointer;
  }

  /* Button background colors */
  #birth {
    background-color: #003847;
    color: white;
  }

  #floruit {
    background-color: white;
  }

  #male,
  #female {
    background-color: white;
    color: black;
  }

  #all {
    background-color: #003847;
    color: white;
  }
</style>
