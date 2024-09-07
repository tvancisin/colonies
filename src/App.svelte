<script>
	import { onMount } from "svelte";
	import * as d3 from "d3";
	import { getJson, getGeo } from "./utils.js";
  import Map from "./lib/Map.svelte";
  import Details from "./lib/Details.svelte";

	let width, height, map;
	let mapRef;
	let selectedProperties;
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
	let path = "./data/data.json";
	let birth_data;
	let births_per_country;
	let births_per_colony;

	getJson(path).then((json) => {
		let just_births = d3.groups(json, (d) => d.birth_location != null);
		let colonies_births = d3.groups(just_births[0][1], (d) =>
			colonies.includes(d.birth_location.country),
		);

		birth_data = colonies_births[1][1];

		//add colonies to bio location data
		let colony_data = birth_data.map((item) => {
			if (india_colonies.includes(item.birth_location.country)) {
				item.birth_location.colony = "India";
			} else if (america_colonies.includes(item.birth_location.country)) {
				item.birth_location.colony = "America";
			} else if (
				australia_colonies.includes(item.birth_location.country)
			) {
				item.birth_location.colony = "Australia";
			} else if (
				caribbean_colonies.includes(item.birth_location.country)
			) {
				item.birth_location.colony = "Caribbean";
			} else if (asian_colonies.includes(item.birth_location.country)) {
				item.birth_location.colony = "Asia";
			} else if (african_colonies.includes(item.birth_location.country)) {
				item.birth_location.colony = "Africa";
			}

			return item;
		});

		births_per_colony = d3.groups(
			colony_data,
			(d) => d.birth_location.colony,
		);

		births_per_country = d3.groups(
			colonies_births[1][1],
			(d) => d.birth_location.country,
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
		// d3.select(".information").style("right", "-100%");
		mapRef.flyToInitialPosition();
		map.removeLayer("population");
		map.removeSource("locations");
	}
</script>

<main bind:clientWidth={width} bind:clientHeight={height}>
	{#if countries_json && shipping_json && birth_data}
		<Map
			{countries_json}
			{shipping_json}
			{births_per_colony}
			bind:this={mapRef}
			bind:map
			on:polygonClick={handlePolygonClick}
		/>
		<Details
			on:close={handleClose}
			{births_per_colony}
			{selectedProperties}
		/>
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
	}

	/* Map {
		flex: 1;
		width: 100%;
	} */
</style>