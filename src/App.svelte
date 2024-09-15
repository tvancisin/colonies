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
  const json_paths = [
    "./data/colony_divisions.json",
    "./data/shipping_routes.json",
  ];
  getGeo(json_paths).then((geo) => {
    countries_json = geo[0];
    shipping_json = geo[1];
  });

  function handlePolygonClick(event) {
    selectedProperties = event.detail;
    d3.select("#details").style("right", "0px");
  }

  function handleClose() {
    d3.select("#details").style("right", "-100%");
    selectedProperties = null;
    mapRef.flyToInitialPosition();
    map.removeLayer("population");
    map.removeSource("locations");
  }
</script>

<main bind:clientWidth={width} bind:clientHeight={height}>
  {#if countries_json && shipping_json && birth_data}
    <h1>Legacies of the Empire</h1>
    <Map
      {countries_json}
      {shipping_json}
      {births_per_colony}
      {birth_data}
      bind:this={mapRef}
      bind:map
      on:polygonClick={handlePolygonClick}
    />
    <Timeline {birth_data} {selectedProperties} {births_per_colony} />
    <Details on:close={handleClose} {births_per_colony} {selectedProperties} />
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
    font-size: 2em;
    margin: 0px;
    text-align: center;
    color: black;
    background: white;
    z-index: 1;
    transition: top 0.3s ease;
    box-shadow: 0 0 3px #5a5a5a;
  }

  /* Map {
		flex: 1;
		width: 100%;
	} */
</style>
