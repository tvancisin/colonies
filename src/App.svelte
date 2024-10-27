<script>
  import * as d3 from "d3";
  import {
    getJSON,
    getGeo,
    colonies,
    india_colonies,
    african_colonies,
    america_colonies,
    australia_colonies,
    asian_colonies,
    caribbean_colonies,
  } from "./utils.js";
  import Map from "./lib/Map.svelte";
  import Details from "./lib/Details.svelte";
  import Timeline from "./lib/Timeline.svelte";

  let width, height, map;
  let mapRef;
  let current_data;
  let current_data_string;
  let selected_country = null;
  let legend_height = 50;
  let legend_width = 200;

  //load biographical data
  let path = ["./data/birth_colonies.json", "./data/floruit_colonies.json"];
  let birth_data;
  let floruit_data;
  let births_per_colony;
  let floruit_per_colony;

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

    function groupByColony(data) {
      const groupedByColony = {};

      data.forEach((item) => {
        if (item.floruit) {
          item.floruit.forEach((floruitEntry) => {
            const colony = floruitEntry.location.colony || "unknown";

            // Initialize the colony group if it doesn't exist
            if (!groupedByColony[colony]) {
              groupedByColony[colony] = {
                items: [],
                ids: new Set(),
              };
            }

            // Only add the item if it hasn't been added already
            if (!groupedByColony[colony].ids.has(item.id)) {
              groupedByColony[colony].items.push(item);
              groupedByColony[colony].ids.add(item.id); // Mark the item as added
            }
          });
        }
      });

      // Prepare the output structure
      const outputArray = Object.keys(groupedByColony).map((colony) => {
        return [
          colony === "unknown" ? undefined : colony,
          groupedByColony[colony].items,
        ];
      });

      return outputArray;
    }

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
    if (current_data_string == "birth") {
      current_data = births_per_colony.find(
        (item) => item[0] === selected_country,
      )?.[1];
    } else if (current_data_string == "floruit") {
      current_data = floruit_per_colony.find(
        (item) => item[0] === selected_country,
      )?.[1];
    }
    d3.select("#time_description").style("left", "0%");

    // console.log(mydata);
    // current_data = floruit_per_colony.find(item => item[0] === selected_country)?.[1];

    d3.select("#details").style("right", "0px");
    d3.select("h1").style("top", "-50px");
  }

  function handleClose() {
    //reset data on details close
    if (current_data_string == "birth") {
      current_data = birth_data;
    } else if (current_data_string == "floruit") {
      current_data = floruit_data;
    }

    d3.select("#time_description").style("left", "8.5%");
    d3.select("#details").style("right", "-100%");
    d3.select("h1").style("top", "-2px");
    selected_country = null;
    mapRef.flyToInitialPosition();
  }

  //set variables based on selection (birth or floruit)
  function change_data(selected_data) {
    if (selected_data == "birth") {
      d3.select("#floruit").style("background-color", "white");
      d3.select("#floruit").style("color", "black");
      d3.select("#birth").style("background-color", "black");
      d3.select("#birth").style("color", "white");
      current_data = birth_data;
      current_data_string = selected_data;
    } else if (selected_data == "floruit") {
      d3.select("#floruit").style("background-color", "black");
      d3.select("#floruit").style("color", "white");
      d3.select("#birth").style("background-color", "white");
      d3.select("#birth").style("color", "black");
      current_data = floruit_data;
      current_data_string = selected_data;
    }
  }
</script>

<main bind:clientWidth={width} bind:clientHeight={height}>
  {#if countries_json && shipping_json && current_data && births_per_colony && floruit_per_colony}
    <h1>University of St Andrews Students in the Empire (1700-1897)</h1>
    <Map
      {current_data}
      {current_data_string}
      {countries_json}
      {shipping_json}
      {colonies_1680}
      {colonies_1750}
      {colonies_1820}
      {colonies_1885}
      {colonies}
      bind:this={mapRef}
      bind:map
      on:polygonClick={handlePolygonClick}
    />
    <div id="buttons">
      <button id="birth" on:click={() => change_data("birth")}>Birth</button>
      <button id="floruit" on:click={() => change_data("floruit")}
        >Career</button
      >
    </div>
    <!-- <div id="time_description">Students Entering University/birth dates/first careers</div> -->
    <Timeline
      {current_data}
      {birth_data}
      {floruit_data}
      {selected_country}
      {births_per_colony}
    />
    <Details
      on:close={handleClose}
      {births_per_colony}
      {floruit_per_colony}
      {selected_country}
      {current_data}
      {current_data_string}
    />
    <div id="legend">
      <svg
        height={legend_height}
        width={legend_width}
        viewBox="0 0 200 50"
        preserveAspectRatio="xMidYMid meet"
      >
        <rect
          id="legend_rectangle"
          x="1%"
          y="5%"
          rx="3"
          width="20%"
          height="50%"
          fill="black"
          fill-opacity="0.7"
        />
        <text
          x="25%"
          y="40%"
          fill="black"
          font-size="12"
          font-weight="500"
          text-anchor="start"
        >
          British Empire
        </text>
      </svg>
    </div>
  {/if}
</main>

<style>
  main {
    height: 100vh;
    width: 100vw;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: hidden;
    font-family: "Montserrat", sans-serif;
    font-optical-sizing: auto;
    font-weight: 300;
    font-style: normal;
  }

  h1 {
    border-radius: 2px;
    position: absolute;
    font-weight: 400;
    padding: 5px;
    top: -2px;
    font-size: 1.3em;
    margin: 0px;
    text-align: center;
    color: black;
    background: white;
    z-index: 1;
    transition: top 0.3s ease;
    box-shadow: 0 0 3px #5a5a5a;
  }

  #legend {
    width: 150px;
    height: 100px;
    border-radius: 3px;
    position: absolute;
    top: 5px;
    right: 5px;
  }

  @media only screen and (max-width: 768px) {
    #legend {
      width: 123px;
    }
  }

  #time_description {
    border-radius: 2px;
    position: absolute;
    left: 8.5%;
    bottom: 160px;
    font-weight: 450;
    background: rgba(0, 0, 0, 0.034);
    padding: 5px;
  }

  #buttons {
    position: absolute;
    top: 5px;
    left: 5px;
  }

  #birth,
  #floruit {
    background-color: white; /* Green */
    border: none;
    color: black;
    padding: 5px 10px;
    text-align: center;
    font-family: "Montserrat";
    font-weight: 400;
    text-decoration: none;
    display: inline-block;
    font-size: 14px;
    margin: 4px 2px;
    border-radius: 3px;
    transition-duration: 0.4s;
    cursor: pointer;
    box-shadow: 0 0 2px #000000;
  }

  #birth {
    background-color: #000000;
    color: white;
  }

  #birth:hover,
  #floruit:hover {
    background-color: #000000;
    color: white;
  }
</style>
