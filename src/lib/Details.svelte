<script>
    import { createEventDispatcher } from "svelte";
    import * as d3 from "d3";
    import { career, filterData } from "../utils";
    import { selectedYearsStore } from "../years";

    const dispatch = createEventDispatcher();

    export let births_per_colony;
    export let selectedProperties;

    let details_width, details_height;
    let career_width, career_height;
    let gender_height = 10,
        gender_width = 20;
    let def_data;
    let def_groups;
    let def_male, def_female;
    let data;
    let selectedYears = [];
    let gender, all, male, female, groups;
    let gy;
    let ticks = [10, 20, 30, 40, 50];

    //SELECTED YEAR FILTER
    const unsubscribe = selectedYearsStore.subscribe((value) => {
        selectedYears = value;
    });

    $: if (selectedYears.length != 0) {
        //always reset data
        data = def_data;
        let filter_years = filterData(data, selectedYears[0], selectedYears[1]);
        //gender
        let filter_gender = d3.groups(filter_years, (d) => d.gender);
        if (filter_gender.length == 2) {
            female = filter_gender.find((item) => item[0] === "F")[1];
        } else {
            female = [];
        }
        male = filter_gender.find((item) => item[0] === "M")[1];
        data = filter_years;
        //floruit
        groups = career(data);
    } else if (selectedYears.length == 0) {
        data = def_data;
        //gender
        male = def_male;
        female = def_female;
        //floruit
        groups = def_groups;
    }

    // FILTER DATA TO SELECTED COUNTRY
    $: filteredCountry = births_per_colony.filter(
        (item) => item[0] == selectedProperties,
    );

    $: if (filteredCountry) {
        def_data = filteredCountry[0][1];
        data = filteredCountry[0][1];
        all = filteredCountry[0][1].length;
        //gender
        gender = d3.groups(filteredCountry[0][1], (d) => d.gender);
        if (gender.length == 2) {
            def_female = gender.find((item) => item[0] === "F")[1];
            female = gender.find((item) => item[0] === "F")[1];
        } else {
            female = [];
        }
        def_male = gender.find((item) => item[0] === "M")[1];
        male = gender.find((item) => item[0] === "M")[1];
        //floruit
        def_groups = career(data);
        groups = career(data);
    }

    function closeDetails() {
        dispatch("close");
        change = 0;
    }

    // Convert group data to array format
    $: groupData = Object.keys(groups).map((key) => ({
        name: key,
        count: groups[key].length,
    }));

    // Dimensions and margins of the graph
    const margin = { top: 20, right: 30, bottom: 10, left: 10 };
    $: innerWidth = career_width - margin.left - margin.right;
    $: innerHeight = career_height - margin.top - margin.bottom;

    // Create scales
    $: xScaleCareer = d3
        .scaleBand()
        .domain(groupData.map((d) => d.name))
        .range([10, innerWidth - 20])
        .padding(0.2);

    $: yScaleCareer = d3
        .scaleLinear()
        .domain([0, 55])
        .nice()
        .range([innerHeight, 0]);

    $: gender_height_scale = d3
        .scaleLinear()
        .range([0, gender_height - 10])
        .domain([0, 70]);

    $: d3.select(gy)
        .call(d3.axisLeft(yScaleCareer).tickValues(ticks).tickSize(5))
        .selectAll("text")
        .style("font-family", "Montserrat")
        .style("font-weight", 500)
        .style("font-size", 10);

    let change = 0;
    function refresh() {
        console.log("here");
        change = 0;
        data = def_data;
    }
    //filter by gender
    $: if (change) {
        data = def_data;
        groups = def_groups;
        let gender_data = data.filter((item) => item.gender === change);
        data = gender_data;
        groups = career(data);
    }

    function handle_click(g) {
        change = g;
    }

</script>

{#if filteredCountry[0][1]}
    <div
        id="details"
        bind:clientWidth={details_width}
        bind:clientHeight={details_height}
    >
        <div id="peace_title_div">
            <button class="btn close" on:click={closeDetails}
                ><i class="fa fa-close"></i></button
            >
            <button class="btn refresh" on:click={refresh}
                ><i class="fa fa-refresh"></i></button
            >
            {#if selectedProperties}
                <h3>{selectedProperties}</h3>
            {/if}
        </div>
        <div id="peace_content">
            <div id="overview">
                <h5>Gender</h5>
                <div class="content-wrapper">
                    <div class="content-box">
                        <div
                            class="row"
                            bind:clientWidth={gender_width}
                            bind:clientHeight={gender_height}
                        >
                            <svg width={gender_width} height={gender_height}>
                                <rect
                                    x={gender_width / 4}
                                    rx="1"
                                    y={gender_height -
                                        gender_height_scale(female.length)}
                                    width={gender_width / 2}
                                    height={gender_height_scale(female.length)}
                                    fill="black"
                                    on:click={() => handle_click("F")}
                                    on:keydown={(event) => {
                                        if (
                                            event.key === "Enter" ||
                                            event.key === " "
                                        ) {
                                            event.preventDefault();
                                            handle_click("F");
                                        }
                                    }}
                                    tabindex="0"
                                    role="button"
                                    style="cursor: pointer;"
                                ></rect>
                                <text
                                    x={gender_width / 4}
                                    y={gender_height -
                                        gender_height_scale(female.length) -
                                        2}
                                    font-size="11"
                                    font-weight="500"
                                    >Female ({female.length})</text
                                >
                            </svg>
                        </div>
                    </div>
                    <div class="content-box">
                        <div
                            class="row"
                            bind:clientWidth={gender_width}
                            bind:clientHeight={gender_height}
                        >
                            <svg width={gender_width} height={gender_height}>
                                <rect
                                    x={gender_width / 4}
                                    rx="1"
                                    y={gender_height -
                                        gender_height_scale(male.length)}
                                    width={gender_width / 2}
                                    height={gender_height_scale(male.length)}
                                    fill="black"
                                    on:click={() => handle_click("M")}
                                    on:keydown={(event) => {
                                        if (
                                            event.key === "Enter" ||
                                            event.key === " "
                                        ) {
                                            event.preventDefault();
                                            handle_click("F");
                                        }
                                    }}
                                    tabindex="0"
                                    role="button"
                                    style="cursor: pointer;"
                                ></rect>
                                <text
                                    x={gender_width / 4}
                                    y={gender_height -
                                        gender_height_scale(male.length) -
                                        2}
                                    font-size="11"
                                    font-weight="500"
                                    >Male ({male.length})
                                </text>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            <div id="general">
                <h5>Careers</h5>
                <div
                    id="career_wrapper"
                    bind:clientWidth={career_width}
                    bind:clientHeight={career_height}
                >
                    <svg width={career_width} height={career_height}>
                        <g
                            transform={`translate(${margin.left},${margin.top})`}
                        >
                            <g
                                bind:this={gy}
                                transform="translate({margin.left},0)"
                            />
                            {#each groupData as group}
                                <rect
                                    x={xScaleCareer(group.name)}
                                    y={yScaleCareer(group.count)}
                                    rx="1"
                                    width={xScaleCareer.bandwidth()}
                                    height={innerHeight -
                                        yScaleCareer(group.count)}
                                    fill="black"
                                ></rect>
                                <text
                                    x={xScaleCareer(group.name) +
                                        xScaleCareer.bandwidth() / 2}
                                    y={yScaleCareer(group.count) - 2}
                                    font-size="10"
                                    text-anchor="start"
                                    transform={`rotate(-70, ${xScaleCareer(group.name) + xScaleCareer.bandwidth() / 2}, ${yScaleCareer(group.count)})`}
                                >
                                    {group.name}
                                </text>
                            {/each}
                        </g>
                    </svg>
                </div>
            </div>
            <div id="peace_process">
                <h5>List</h5>
                <div class="scrollable-content">
                    {#each data as d}
                        <!-- Basic information -->
                        <p><strong>Name:</strong> {d.forename} {d.surname}</p>

                        <!-- Birth Information -->
                        <p>
                            <strong>Birth Location:</strong>
                            {d.birth_location.original_name}
                        </p>
                        <p>
                            <strong>Birth Date:</strong>
                            {d.birth_date || "Unknown"}
                        </p>

                        <!-- Death Information -->
                        <p>
                            <strong>Death Date:</strong>
                            {d.death_date || "Unknown"}
                        </p>
                        {#if d.death_location}
                            <p>
                                <strong>Death Location:</strong>
                                {d.death_location.original_name || "Unknown"}
                            </p>
                        {/if}

                        <!-- Family Information -->
                        {#if d.father}
                            <p>
                                <strong>Father:</strong>
                                {d.father.forename}
                                {d.father.surname}
                            </p>
                        {/if}
                        {#if d.mother}
                            <p>
                                <strong>Mother:</strong>
                                {d.mother.forename}
                                {d.mother.surname}
                            </p>
                        {/if}

                        <!-- Study Information -->
                        {#if d.study}
                            {#if d.study.colleges && d.study.colleges.length > 0}
                                <p><strong>Colleges:</strong></p>
                                {#each d.study.colleges as college}
                                    <p>{college.name} (From: {college.from})</p>
                                {/each}
                            {/if}
                            {#if d.study.degrees && d.study.degrees.length > 0}
                                <p><strong>Degrees:</strong></p>
                                {#each d.study.degrees as degree}
                                    <p>{degree.name} (Date: {degree.date})</p>
                                {/each}
                            {/if}
                        {/if}

                        <!-- Floruit (Occupations) -->
                        {#if d.floruit && d.floruit.length > 0}
                            <p><strong>Floruit:</strong></p>
                            {#each d.floruit as floruit}
                                <p>
                                    {floruit.occupation} at {floruit.location
                                        .original_name}
                                    (From: {floruit.from} To: {floruit.to})
                                </p>
                            {/each}
                        {/if}

                        <!-- References -->
                        {#if d.references && d.references.length > 0}
                            <p><strong>References:</strong></p>
                            {#each d.references as reference}
                                <p>{reference}</p>
                            {/each}
                        {/if}

                        <!-- ID -->
                        {#if d.id}
                            <p><strong>ID:</strong></p>
                            <p>{d.id}</p>
                        {/if}

                        <!-- Separator between records -->
                        <hr />
                    {/each}
                </div>
            </div>
        </div>
    </div>
{/if}

<style>
    #details {
        color: black;
        position: fixed;
        right: -100%;
        width: 450px;
        height: calc(100%);
        transition: right 0.3s ease;
        background-color: rgba(0, 0, 0, 0.932);
        overflow: hidden;
        z-index: 5;
        font-family: "Montserrat", sans-serif;
        font-optical-sizing: auto;
        font-weight: 300;
        font-style: normal;
        display: flex;
        flex-direction: column;
        z-index: 11;
    }

    @media (max-width: 1450px) {
        #details {
            width: 450px;
        }
    }

    @media (max-width: 1200px) {
        #details {
            width: 450px;
        }
    }

    @media (max-width: 768px) {
        #details {
            width: 100%;
        }
    }

    #peace_title_div {
        text-align: center;
        position: relative;
        margin: 1px;
    }

    h3 {
        color: white;
        margin: auto;
        font-size: 1.3redem;
        padding: 5px;
        font-weight: 450;
    }

    @media only screen and (max-width: 1450px) {
        h3 {
            font-size: 1.1em;
        }
    }

    @media only screen and (max-width: 1200px) {
        h3 {
            font-size: 1em;
        }
    }

    @media only screen and (max-width: 768px) {
        h3 {
            font-size: 0.9em;
        }
    }

    .btn.close {
        position: absolute;
        right: 4px;
        background: none;
        color: white;
        border: none;
        padding: 2px 10px;
        border-radius: 2px;
        font-size: 1.5em;
        cursor: pointer;
        font-family: "Montserrat";
        transition: border 0.3s ease;
    }

    .btn.close:hover {
        color: red;
    }

    @media only screen and (max-width: 1450px) {
        .btn.close {
            font-size: 1.3em;
        }
    }

    @media only screen and (max-width: 1024px) {
        .btn.close {
            font-size: 1.2em;
        }
    }

    .btn.refresh {
        position: absolute;
        right: 30px;
        top: 3px;
        background: none;
        color: white;
        border: none;
        padding: 2px 10px;
        border-radius: 2px;
        font-size: 1.2em;
        cursor: pointer;
        font-family: "Montserrat";
        transition: border 0.3s ease;
    }

    .btn.refresh:hover {
        color: red;
    }

    @media only screen and (max-width: 1450px) {
        .btn.refresh {
            font-size: 1.1em;
        }
    }

    @media only screen and (max-width: 1024px) {
        .btn.refresh {
            font-size: 1em;
        }
    }

    #peace_content {
        height: 100%; /* Ensure that #peace_content takes full available height */
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;
        overflow-y: auto;
        font-size: 0.8em;
        margin-top: 0px;
        margin-right: 5px;
        margin-left: 5px;
        margin-bottom: 5px;
        border-radius: 2px;
        gap: 6px;
    }

    @media only screen and (max-width: 1450px) {
        #peace_content {
            font-size: 0.8em;
        }
    }

    @media only screen and (max-width: 1200px) {
        #peace_content {
            font-size: 0.8em;
        }
    }

    @media only screen and (max-width: 768px) {
        #peace_content {
            font-size: 0.7em;
        }
    }

    @media only screen and (max-height: 768px) {
        #peace_content {
            font-size: 0.7em;
        }
    }

    #general,
    #peace_process {
        flex-basis: 0;
        width: 100%;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        line-height: 1.5;
    }

    #overview {
        flex-basis: 0;
        width: 100%;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
    }

    #general,
    #peace_process,
    #overview {
        background: white;
        border-radius: 2px;
    }

    #overview h5,
    #general h5,
    #peace_process h5 {
        background-color: #d9d9d9;
        z-index: 2;
        box-shadow: 0 2px 3px rgba(117, 117, 117, 0.8);
    }

    #overview,
    #general,
    #peace_process {
        flex-shrink: 0; /* Prevent shrinking of these elements */
    }

    #overview {
        flex-grow: 0.7; /* Takes one unit of the available space */
    }

    #general {
        flex-grow: 1.5; /* Takes one unit of the available space */
    }

    #peace_process {
        flex-grow: 3; /* Takes three units of the available space each */
    }

    h5 {
        position: sticky;
        top: 0;
        z-index: 1;
        margin: 0;
        padding: 5px 15px;
        color: black;
        font-size: 1em;
        font-weight: 450;
    }

    @media only screen and (max-width: 768px) {
        h5 {
            font-size: 0.9em;
            padding: 3px 10px;
        }
    }

    .content-wrapper {
        flex-grow: 1;
        display: flex;
        gap: 5px;
        padding: 5px;
        overflow-y: auto;
        flex-direction: row;
        align-items: stretch;
    }

    .content-box {
        flex-basis: 50%;
        background: white;
        color: black;
        padding: 2px;
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
        overflow: visible;
    }

    .row {
        display: flex;
        flex-grow: 1;
        width: 100%; /* Ensure it takes the full width */
        height: 100%; /* Ensure it takes the full height */
        font-weight: 450;
    }

    svg {
        max-width: 100%;
        max-height: 100%;
        width: 100%;
        display: block; /* Remove inline spacing issues */
    }

    .scrollable-content {
        flex-grow: 1;
        overflow-y: auto;
        padding: 2px 15px;
        background: none;
        box-sizing: border-box;
        font-weight: 450;
    }

    #career_wrapper {
        flex-grow: 1;
        overflow-y: auto;
        padding: 2px 15px;
        background: none;
        box-sizing: border-box;
        font-weight: 450;
    }

    #peace_title_div {
        text-align: center;
        position: relative;
        margin: 2px;
    }

    :global(a) {
        color: rgb(110, 122, 177);
        cursor: pointer;
    }

    :global(ul) {
        padding-left: 20px;
        padding-right: 10px;
        margin: 0px;
        font-weight: 400;
    }

    p {
        margin: 0px;
    }
</style>
