<script>
  import { onMount } from "svelte";
  import {
    scrollToSection,
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
    selectedGenderStore,
  } from "./years";

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
  let showScrollToTop = false; // Visibility of the scroll-to-top button
  let isMenuOpen = false; // Toggle menu visibility

  //load biographical data
  let path = ["./data/birth_colonies.json", "./data/floruit_colonies.json"];
  let birth_data;
  let floruit_data;
  let births_per_colony;
  let floruit_per_colony;
  let sections = [
    { id: "home", name: "Home" },
    { id: "people", name: "About" },
    { id: "provenance", name: "Provenance" },
    { id: "vis", name: "Visualization" },
  ];

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

    d3.select("#time_description").style("left", "0%");
    d3.select("#details").style("right", "0px");
    d3.select("#buttons").style("top", "-50px");
  }

  function handleClose() {
    //reset data on details close
    if (current_data_string == "birth") {
      current_data = birth_data;
    } else if (current_data_string == "floruit") {
      current_data = floruit_data;
    }
    d3.select("#time_description").style("left", "2.5%");
    d3.select("#details").style("right", "-100%");
    d3.select("#buttons").style("top", "10px");
    selected_country = null;
    selectedCareerStore.set([]);
    mapRef.flyToInitialPosition();
  }

  //set variables based on selection (birth or floruit)
  function change_data(selected_data) {
    if (selected_data == "birth") {
      d3.select("#header").text("Student Births in the Colonies (1700-1897)");
      d3.select("#floruit").style("background-color", "white");
      d3.select("#floruit").style("color", "black");
      d3.select("#birth").style("background-color", "black");
      d3.select("#birth").style("color", "white");
      current_data = birth_data;
      current_data_string = selected_data;
    } else if (selected_data == "floruit") {
      d3.select("#header").text("Student Careers in the Colonies (1700-1897)");
      d3.select("#floruit").style("background-color", "black");
      d3.select("#floruit").style("color", "white");
      d3.select("#birth").style("background-color", "white");
      d3.select("#birth").style("color", "black");
      current_data = floruit_data;
      current_data_string = selected_data;
    }
  }

  // Scroll to a specific section
  const career_select = (sectionId) => {
    if (current_data_string == "birth") {
      current_data = birth_data;
    } else if (current_data_string == "floruit") {
      current_data = floruit_data;
    }
    // divide into careers
    let career_groups = career(current_data);
    // people with selected career
    let fin_career = career_groups[sectionId].filter(
      (item, index, self) => index === self.findIndex((t) => t.id === item.id),
    );
    current_data = fin_career;
  };

  $: console.log(selected_country);
</script>

<main bind:clientWidth={width}>
  <!-- intro -->
  <div id="home">
    <!-- Navigation Menu -->
    <div id="navigation">
      <i
        class="fa fa-bars"
        aria-hidden="true"
        on:click={() => (isMenuOpen = !isMenuOpen)}
      ></i>

      {#if isMenuOpen}
        <ul class="dropdown">
          {#each sections as section}
            <li on:click={() => scrollToSection(section.id)}>
              {section.name}
            </li>
          {/each}
        </ul>
      {/if}
    </div>
    <img id="uni_logo" src="uni_white.png" alt="St Andrews University Logo" />
    <h1>University of St Andrews in the Colonies</h1>
    <h3>
      Exploring connections between the University of St Andrews' students and
      the British Empire.
    </h3>
  </div>

  <!-- about -->
  <div id="people">
    <h3 style="position: absolute; left: 10px; top: 0px">About</h3>
    <div id="about">
      <div class="row">
        <div class="column left"><img src="./tom.png" /></div>
        <div class="column right">
          <p>
            <strong>Dr Tomas Vancisin</strong> is an Information Visualization and
            Digital Humanities researcher. At PeaceRep, he focuses on visualization
            of transition trajectories, and the mediation space of peace and transition
            processes. Tomas recently finished his PhD in Computer Science. He holds
            an MSc in Computing and Information Technology, and MA(Hons) in Comparative
            Literature and Russian, all from the University of St Andrews. Before
            joining PeaceRep, Tomas worked on his PhD, focusing on the visualization
            of historical textual collections from the University of St Andrews dating
            back to 1579.
          </p>
        </div>
      </div>
      <hr />
      <div class="row">
        <div class="column left"><img src="./aileen.jpg" /></div>
        <div class="column right">
          <p>
            <strong>Prof Aileen Fyfe</strong>
            focuses on the history of science and technology, particularly the communication
            of science, and the technologies which made that possible. Aileen has
            recently been investigating the history of academic publishing from the
            seventeenth century to the present day; this includes the financial models
            underpinning scientific journals, as well as their editorial and reviewing
            processes. Aileen's book
            <i
              >A History of Scientific Journals: publishing at the Royal
              Society, 1665-2015 (2022, OA)</i
            > was the result of AHRC-funded research on the world's oldest scientific
            journal, the Philosophical Transactions of the Royal Society of London.
          </p>
        </div>
      </div>
    </div>
  </div>

  <!-- provenance -->
  <div id="provenance" class="timeline-container">
    <h3 style="position: absolute; left: 10px; top: 0px">Provenance</h3>
    <!-- Vertical Timeline Line -->
    <div class="timeline"></div>

    <!-- Events -->
    <div class="timeline-event" style="margin-bottom: 800px">
      <div class="event-content">
        <div class="event-image">
          <img src="./orig.jpg" alt="1579 Event" />
        </div>
        <div class="event-text" style="padding-left: 10px">
          <h3>1579</h3>
          <p>Matriculation Roll</p>
        </div>
      </div>
    </div>

    <div class="timeline-event" style="margin-bottom: 10px">
      <div class="event-content">
        <div class="event-text" style="text-align: right; margin-right: 10px">
          <h3>1905</h3>
          <p>Manual transcription of 1747-1897 records</p>
        </div>
        <div class="event-image">
          <img src="ander.jpg" alt="1888 Event" />
        </div>
      </div>
    </div>

    <div class="timeline-event" style="margin-bottom: 150px">
      <div class="event-content">
        <div class="event-image">
          <img src="ander_2.png" alt="1888 Event" />
        </div>
        <div class="event-text" style="padding-left: 10px">
          <h3>1927</h3>
          <p>Manual transcription of 1579-1746 records</p>
        </div>
      </div>
    </div>

    <div class="timeline-event" style="margin-bottom: 10px">
      <div class="event-content">
        <div class="event-text" style="text-align: right; margin-right: 10px">
          <h3>2004</h3>
          <p>Expansion of 1747-1897 records</p>
        </div>
        <div class="event-image">
          <img src="smart.png" alt="1888 Event" />
        </div>
      </div>
    </div>

    <div class="timeline-event" style="margin-bottom: 10px">
      <div class="event-content">
        <div class="event-image">
          <img src="smart_2.png" alt="1888 Event" />
        </div>
        <div class="event-text" style="padding-left: 10px">
          <h3>2012</h3>
          <p>Expansion of 1579-1746 records</p>
        </div>
      </div>
    </div>

    <div class="timeline-event">
      <div class="event-content">
        <div class="event-text" style="text-align: right; margin-right: 10px">
          <h3>2016</h3>
          <p>Digitization of 1747-1897 records</p>
        </div>
        <div class="event-image">
          <img src="digital.png" alt="1888 Event" />
        </div>
      </div>
    </div>

    <div class="timeline-event">
      <div class="event-content">
        <div class="event-image">
          <img src="digital_2.png" alt="1888 Event" />
        </div>
        <div class="event-text" style="padding-left: 10px">
          <h3>2020</h3>
          <p>Digitization of 1579-1746 records</p>
        </div>
      </div>
    </div>
  </div>

  <!-- visualization -->
  <!-- <h1 id="header">Student Births in the Colonies (1700-1897)</h1> -->
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
        <button id="birth" on:click={() => change_data("birth")}>Birth</button>
        <button id="floruit" on:click={() => change_data("floruit")}
          >Career</button
        >
      </div>
      <div id="time_description">Students Entering University</div>
      <Timeline {current_data} {selected_country} />
      <Details
        on:close={handleClose}
        {births_per_colony}
        {floruit_per_colony}
        {selected_country}
        {current_data_string}
      />
    {/if}
  </div>
  <!-- Navigation Menu -->
  <!-- <div id="navigation">
      <i
        class="fa fa-bars"
        aria-hidden="true"
        on:click={() => (isMenuOpen = !isMenuOpen)}
      ></i>

      {#if isMenuOpen}
        <ul class="dropdown">
          {#each sections as section}
            <li on:click={() => career_select(section.id)}>
              {section.name}
            </li>
          {/each}
        </ul>
      {/if}
    </div> -->
  <!-- <div id="legend">
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
          rx="2"
          width="20%"
          height="50%"
          fill="#A6A6A6"
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
    </div> -->
</main>

<style>
  #home {
    position: relative;
    width: 100%;
    height: 300px;
    align-content: center;
    text-align: center;
    background-color: #001c23;
  }

  #people {
    position: relative;
    background-color: #003645;
    width: 100%;
  }

  #about {
    position: relative;
    width: 80%;
    display: flex; /* Enable flexbox layout */
    flex-wrap: wrap; /* Allow wrapping on smaller screens */
    margin: auto;
    padding-top: 50px;
  }

  .row {
    display: flex; /* Create a flex row for each pair of columns */
    flex-wrap: wrap; /* Allow wrapping for responsive design */
    width: 100%; /* Ensure rows take full width */
    margin-bottom: 30px; /* Add spacing between rows */
    margin-top: 30px; /* Add spacing between rows */
  }

  .column {
    flex: 1; /* Equal width for left and right columns */
    padding: 10px; /* Add spacing inside columns */
    box-sizing: border-box; /* Ensure padding doesn't affect width */
    text-align: center; /* Center-align content (optional) */
    color: white; /* Text color for better contrast */
  }

  hr {
    width: 80%;
    height: 1px;
    border: 0;
    border-top: 2px solid #001c23;
    padding-bottom: 30px;
  }

  .column img {
    height: 350px;
    border-radius: 3px;
    -webkit-box-shadow: 0 0 10px #22222293;
    box-shadow: 0 0 10px #22222293;
  }

  .right p {
    text-align: left;
    line-height: 1.5;
  }

  @media (max-width: 768px) {
    .column {
      flex-basis: 100%; /* Stack columns vertically on smaller screens */
    }
  }

  main {
    position: relative;
    align-items: center;
    font-family: "Montserrat", sans-serif;
    font-optical-sizing: auto;
    font-weight: 300;
    font-style: normal;
  }

  h1 {
    color: white;
    font-weight: 500;
    margin-bottom: 5px;
    font-family: "Montserrat", sans-serif;
    font-optical-sizing: auto;
    font-weight: 500;
    font-style: normal;
  }

  h3 {
    color: white;
    font-weight: 400;
  }

  /* Navigation Menu */
  #navigation {
    position: absolute;
    top: 10px;
    left: 20px;
    z-index: 10;
  }

  #navigation .fa-bars {
    font-size: 24px;
    color: white;
    cursor: pointer;
  }

  .dropdown {
    position: absolute;
    top: 30px;
    left: 0;
    text-align: left;
    background-color: #252529;
    border-radius: 1px;
    list-style: none;
    padding: 0;
    margin: 0;
    z-index: 10;
  }

  .dropdown li {
    all: unset;
    font-weight: 300;
    padding: 10px 20px;
    color: white;
    cursor: pointer;
    display: block;
    text-align: left;
  }

  .dropdown li:hover {
    background-color: #042645;
  }

  #legend {
    width: 150px;
    height: 100px;
    position: absolute;
    top: 45px;
    left: 5px;
  }

  @media only screen and (max-width: 768px) {
    #legend {
      width: 123px;
    }
  }

  #uni_logo {
    position: absolute;
    top: 2px;
    right: 5px;
    height: 50px;
  }

  #time_description {
    border-radius: 2px;
    position: absolute;
    left: 2.5%;
    bottom: 160px;
    font-weight: 450;
    background: rgba(0, 0, 0, 0.09);
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
    background-color: white; /* Green */
    border: none;
    color: black;
    padding: 5px 10px;
    text-align: center;
    font-family: "Montserrat";
    font-weight: 450;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 0px;
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

  /* Parent container for all timeline events */
  .timeline-container {
    position: relative;
    width: 100%; /* Full screen width */
    display: flex;
    flex-direction: column; /* Stack events vertically */
    align-items: center; /* Center the events horizontally relative to the timeline */
    gap: 20px; /* Add vertical spacing between events */
    padding: 20px 0; /* Add padding to the top and bottom */
    padding-top: 100px;
    background-color: #001c23;
  }

  /* Timeline Line */
  .timeline {
    position: absolute;
    width: 1px;
    height: 95%;
    background-color: rgb(255, 183, 0);
    z-index: 1; /* Ensure it's below the events */
  }

  /* Timeline Events */
  .timeline-event {
    position: relative; /* Positioned within the flex container */
    width: 80%; /* Takes 80% of screen width */
    display: flex;
    justify-content: center;
    z-index: 2; /* Ensure it appears above the timeline */
  }

  .event-content {
    display: flex;
    width: 100%;
    overflow: hidden;
  }

  .event-image {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden; /* Ensures enlarged images don't overflow the container */
  }

  .event-image img {
    width: 100%;
    border-radius: 3px;
  }

  /* Text Section */
  .event-text {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .event-text h3 {
    margin: 0 0 10px;
    font-size: 18px;
    color: #ffffff;
    padding-left: 0px;
  }

  .event-text p {
    margin: 0;
    font-size: 14px;
    color: #ffffff;
    padding-left: 0px;
  }

  /* Responsive Design */
  @media (max-width: 750px) {
    .timeline-container {
      gap: 1px; /* Increase gap between events on smaller screens */
    }

    .event-content {
      flex-direction: column; /* Stack image and text vertically */
      align-items: center;
    }

    .event-image,
    .event-text {
      flex: none;
      width: 100%;
    }

    .event-text {
      padding: 10px;
    }
  }
</style>
