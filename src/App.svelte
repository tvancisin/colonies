<script>
  import { onMount } from "svelte";
  import * as d3 from "d3";
  import { getJSON, getGeo } from "./utils.js";
  import Map from "./lib/Map.svelte";
  import Details from "./lib/Details.svelte";
  import Timeline from "./lib/Timeline.svelte";

  let width, height, map;
  let mapRef;
  let selectedProperties = null;
  let legend_height = 50;
  let legend_width = 200;
  let colonies = [
    "US",
    "CA",
    "ZA",
    "SL",
    "EG",
    "ZM",
    "MU",
    "NG",
    "AU",
    "NZ",
    "JM",
    "AG",
    "BB",
    "GY",
    "BS",
    "TT",
    "GD",
    "DM",
    "KN",
    "VC",
    "BZ",
    "SG",
    "MY",
    "ID",
    "CN",
    "VU",
    "MM",
    "HK",
    "WS",
    "LB",
    "IL",
    "CY",
    "MT",
    "SY",
    "TR",
    "IR",
    "AR",
    "IN",
    "LK",
    "AF",
    "PK",
    "BD",
  ];

  const india_colonies = ["IN", "LK", "PK", "MM"];
  const african_colonies = ["ZA", "SL", "EG", "ZM", "NG"];
  const america_colonies = ["US", "CA"];
  const australia_colonies = ["AU", "NZ"];
  const asian_colonies = ["MY", "SG", "HK"];
  const caribbean_colonies = [
    "JM",
    "AG",
    "BB",
    "GY",
    "BS",
    "TT",
    "GD",
    "DM",
    "KN",
    "VC",
  ];

  //load biographical data
  let path = ["./data/birth_colonies.json", "./data/floruit_colonies.json"];
  let birth_data;
  let floruit_data;
  let births_per_colony;

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
    "./data/colonies_1885.json"
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
    selectedProperties = event.detail;
    d3.select("#details").style("right", "0px");
    d3.select("h1").style("top", "-50px");
  }

  function handleClose() {
    d3.select("#details").style("right", "-100%");
    d3.select("h1").style("top", "-2px");
    selectedProperties = null;
    mapRef.flyToInitialPosition();
  }
</script>

<main bind:clientWidth={width} bind:clientHeight={height}>
  {#if countries_json && shipping_json && birth_data && floruit_data}
    <h1>University of St Andrews Students in the Empire (1700-1897)</h1>
    <Map
      {countries_json}
      {shipping_json}
      {colonies_1680}
      {colonies_1750}
      {colonies_1820}
      {colonies_1885}
      {births_per_colony}
      {birth_data}
      {floruit_data}
      {colonies}
      bind:this={mapRef}
      bind:map
      on:polygonClick={handlePolygonClick}
    />
    <div id="time_description">Students Entering University</div>
    <Timeline {birth_data} {selectedProperties} {births_per_colony} />
    <Details on:close={handleClose} {births_per_colony} {selectedProperties} />
    <!-- <div id="legend">
      <svg
        height={legend_height}
        width={legend_width}
        viewBox="0 0 200 50"
        preserveAspectRatio="xMidYMid meet"
      >
        <rect
          id="legend_rectangle"
          x="2.5%"
          y="68%"
          width="100%"
          height="40%"
          fill="url(#legend_gradient)"
        />
  
        <defs>
          <linearGradient id="legend_gradient">
            <stop class="stop_one" offset="0%" />
            <stop class="stop_two" offset="50%" />
            <stop class="stop_three" offset="100%" />
          </linearGradient>
        </defs>
  
        <text
          x="2.5%"
          y="60%"
          fill="black"
          font-size="12"
          font-weight="500"
          text-anchor="start"
        >
          less births 
        </text>
  
        <text
          x="100%"
          y="60%"
          fill="black"
          font-size="12"
          font-weight="500"
          text-anchor="end"
        >
          more births 
        </text>
      </svg>
    </div> -->
  
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
    font-size: 1.8em;
    margin: 0px;
    text-align: center;
    color: black;
    background: white;
    z-index: 1;
    transition: top 0.3s ease;
    box-shadow: 0 0 3px #5a5a5a;
  }

  /* #legend {
    width: 205px;
    position: absolute;
    top: 0px;
    left: 10px;
    border-radius: 3px;
  }

  @media only screen and (max-width: 768px) {
    #legend {
      width: 123px;
    }
  }

  #legend_rectangle {
    fill: url(#legend_gradient);
  }

  .stop_one {
    stop-color: #DBC2C1;
  }
  .stop_two {
    stop-color: #934242;
  }
  .stop_three {
    stop-color: #740b0b;
  } */

  #time_description {
    border-radius: 2px;
    position: absolute;
    left: 0px;
    bottom: 160px;
    font-weight: 500;
    background: rgba(0, 0, 0, 0.034);
    padding: 5px;
  }

  /* Map {
		flex: 1;
		width: 100%;
	} */
</style>
