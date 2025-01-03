<script>
    import { createEventDispatcher } from "svelte";
    import {
        year_filter,
        constructNodesAndLinks,
        constructParallelData,
        career,
    } from "../utils";
    import { selectedYearsStore, selectedCareerStore } from "../years";
    // import Network from "./Network.svelte";
    import Parallel from "./Parallel.svelte";
    const dispatch = createEventDispatcher();

    export let births_per_colony;
    export let floruit_per_colony;
    export let selected_country;
    export let current_data_string;

    let details_width, details_height;
    let career_width = 100;
    let career_height = 100;
    let data;
    let parallel_data;
    let selectedYears = [];
    let selectedCareer;
    let filteredCountry;

    // selected years from store
    const unsubscribe = selectedYearsStore.subscribe((value) => {
        selectedYears = value;
    });
    // selected career from store
    const career_unsubscribe = selectedCareerStore.subscribe((value) => {
        selectedCareer = value;
    });

    //// COUNTRY FILTER
    $: if (selected_country != null) {
        // default data
        filteredCountry = (
            current_data_string === "birth"
                ? births_per_colony
                : floruit_per_colony
        ).filter((item) => item[0] == selected_country)[0][1];

        // data to operate with
        data = filteredCountry;
    }

    //// YEAR FILTER
    $: if (selectedYears.length != 0 && selected_country != null) {
        //filter data to selected years
        let filter_years = year_filter(
            filteredCountry,
            selectedYears[0],
            selectedYears[1],
        );

        //update data
        data = filter_years;
    }

    //// CAREER FILTER
    $: if (selectedCareer.length != 0) {
        console.log("here");
        // construct career groups based on clicked country
        let career_groups = career(data);

        // only get people with sele    cted career
        let fin_career = career_groups[selectedCareer].filter(
            (item, index, self) =>
                index === self.findIndex((t) => t.id === item.id),
        );

        // update data
        data = fin_career;
    }

    function closeDetails() {
        dispatch("close");
    }

    let check = false;

    $: if (check) {
        data = filteredCountry;
        check = false;
    }

    function refresh() {
        selectedCareerStore.set([]);
        check = true;
    }

    //data for network
    // $: node_link = constructNodesAndLinks(data);
    // data for parallel
    $: if (data) {
        parallel_data = constructParallelData(data);
    }
</script>

<div
    id="details"
    bind:clientWidth={details_width}
    bind:clientHeight={details_height}
>
    <div id="peace_title_div">
        <button class="btn close" on:click={closeDetails}
            ><i class="fa fa-close"></i></button
        >
        <button class="btn refresh" on:click={refresh}>
            <i class="fa fa-refresh"></i>
        </button>
        {#if selected_country}
            <h3>{selected_country}</h3>
        {/if}
    </div>
    <div id="peace_content">
        <div id="general">
            <div
                id="career_wrapper"
                bind:clientWidth={career_width}
                bind:clientHeight={career_height}
            >
                <!-- <Network {node_link} {career_width} {career_height} /> -->
                {#if parallel_data}
                    <Parallel {parallel_data} {career_width} {career_height} />
                {/if}
            </div>
        </div>
        <div id="peace_process">
            <div class="scrollable-content">
                {#if data}
                    {#each data as d}
                        <p><strong>Name:</strong> {d.forename} {d.surname}</p>

                        <p>
                            <strong>Birth Location:</strong>
                            {d.birth_location?.original_name || "Unknown"}
                        </p>

                        <p>
                            <strong>Birth Date:</strong>
                            {d.birth_date || "Unknown"}
                        </p>

                        <p>
                            <strong>Death Date:</strong>
                            {d.death_date || "Unknown"}
                        </p>

                        <p>
                            <strong>Death Location:</strong>
                            {d.death_location?.original_name || "Unknown"}
                        </p>

                        <p>
                            <strong>Father:</strong>
                            {d.father?.forename || ""}
                            {d.father?.surname || "Unknown"}
                        </p>

                        <p>
                            <strong>Mother:</strong>
                            {d.mother?.forename || ""}
                            {d.mother?.surname || "Unknown"}
                        </p>

                        <!-- Colleges -->
                        <p>
                            <strong>Colleges:</strong>
                            {#if d.study?.colleges?.length > 0}
                                {#each d.study.colleges as college, index}
                                    {#if index > 0}<br />{/if}
                                    {college.name || "Unknown"} (From: {college.from ||
                                        "Unknown"})
                                {/each}
                            {:else}
                                None
                            {/if}
                        </p>

                        <!-- Degrees -->
                        <p>
                            <strong>Degrees:</strong>
                            {#if d.study?.degrees?.length > 0}
                                {#each d.study.degrees as degree, index}
                                    {#if index > 0}<br />{/if}
                                    {degree.name || "Unknown"} (Date: {degree.date ||
                                        "Unknown"})
                                {/each}
                            {:else}
                                None
                            {/if}
                        </p>

                        <!-- Floruit -->
                        <p>
                            <strong>Floruit:</strong>
                            {#if d.floruit?.length > 0}
                                {#each d.floruit as floruit, index}
                                    {#if index > 0}<br />{/if}
                                    {floruit.occupation || "Unknown"} at
                                    {floruit.location?.original_name ||
                                        "Unknown Location"}
                                    (From: {floruit.from || "Unknown"} To: {floruit.to ||
                                        "Unknown"})
                                {/each}
                            {:else}
                                None
                            {/if}
                        </p>

                        <!-- References -->
                        <p>
                            <strong>References:</strong>
                            {#if d.references?.length > 0}
                                {#each d.references as reference, index}
                                    {#if index > 0}<br />{/if}
                                    {reference || "Unknown"}
                                {/each}
                            {:else}
                                None
                            {/if}
                        </p>

                        <p><strong>ID:</strong> {d.id || "Unknown"}</p>

                        <hr />
                    {/each}
                {/if}
            </div>
        </div>
    </div>
</div>

<style>
    #details {
        color: black;
        position: fixed;
        right: -100%;
        bottom: 0px;
        width: 40%;
        height: calc(100%);
        transition: right 0.3s ease;
        background-color: rgb(0, 0, 0);
        overflow: hidden;
        z-index: 5;
        font-family: "Montserrat", sans-serif;
        font-optical-sizing: auto;
        font-weight: 300;
        font-style: normal;
        display: flex;
        flex-direction: column;
        z-index: 11;
        box-shadow: 0 0 5px #000000;
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
        font-weight: 500;
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

    .btn.refresh {
        position: absolute;
        left: 5px;
        background: none;
        color: white;
        border: none;
        padding: 3px 10px;
        border-radius: 2px;
        font-size: 1.2em;
        cursor: pointer;
        font-family: "Montserrat";
        transition: border 0.3s ease;
    }

    .btn.close:hover,
    .btn.refresh:hover {
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
        background: white;
        border-radius: 2px;
        flex-shrink: 0; /* Prevent shrinking of these elements */
        flex-grow: 1; /* Takes one unit of the available space */
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
        padding: 2px;
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
