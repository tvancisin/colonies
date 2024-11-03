<script>
    import { createEventDispatcher } from "svelte";
    import * as d3 from "d3";
    import {
        career,
        filterData,
        genderFilter,
        constructNodesAndLinks,
    } from "../utils";
    import {
        selectedYearsStore,
        selectedCareerStore,
        selectedGenderStore,
    } from "../years";
    import Network from "./Network.svelte";

    const dispatch = createEventDispatcher();

    export let births_per_colony;
    export let floruit_per_colony;
    export let selected_country;
    export let current_data_string;

    let details_width, details_height;
    let career_width = 100;
    let career_height = 100;
    let gender_height = 10;
    let gender_width = 20;
    let def_data;
    let def_groups;
    let def_male, def_female;
    let data;
    let selectedYears = [];
    let gender, all, male, female, groups;
    let gy;
    let ticks = [10, 20, 30, 40, 50];
    let change = 0;

    //selected years from store
    const unsubscribe = selectedYearsStore.subscribe((value) => {
        selectedYears = value;
    });

    //INITIAL DATA & FILTER BY SELECTED COUNTRY
    $: filteredCountry = (
        current_data_string === "birth" ? births_per_colony : floruit_per_colony
    ).filter((item) => item[0] == selected_country);
    //default data
    $: def_data = filteredCountry[0][1];
    //set data to manipulate
    $: data = filteredCountry[0][1];
    //data for network
    $: node_link = constructNodesAndLinks(data);

    //SELECTED YEAR FILTER
    $: if (selectedYears.length != 0) {
        //always reset data
        data = def_data;
        //filter data to selected years
        let filter_years = filterData(data, selectedYears[0], selectedYears[1]);
        //update data
        data = filter_years;
        //data for network
        node_link = constructNodesAndLinks(data);
    } else if (selectedYears.length == 0) {
        //always reset data
        data = def_data;
    }

    $: console.log(selected_country);

    function closeDetails() {
        dispatch("close");
        // change = 0;
    }

    // function refresh() {
    //     // change = 0;
    //     data = def_data;
    //     // let gender_pass = [def_data, "default"];
    //     // let floruit_pass = [def_data, "default"];
    //     // selectedGenderStore.set(gender_pass);
    //     // selectedCareerStore.set(floruit_pass);
    // }
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
        <!-- <button class="btn refresh" on:click={refresh}
            ><i class="fa fa-refresh"></i></button
        > -->
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
                <Network {node_link} {career_width} {career_height} />
            </div>
        </div>
        <div id="peace_process">
            <div class="scrollable-content">
                {#each data as d}
                    <p><strong>Name:</strong> {d.forename} {d.surname}</p>
        
                    <p><strong>Birth Location:</strong> {d.birth_location?.original_name || "Unknown"}</p>
        
                    <p><strong>Birth Date:</strong> {d.birth_date || "Unknown"}</p>
        
                    <p><strong>Death Date:</strong> {d.death_date || "Unknown"}</p>
        
                    <p><strong>Death Location:</strong> {d.death_location?.original_name || "Unknown"}</p>
        
                    <p><strong>Father:</strong> {(d.father?.forename || "")} {(d.father?.surname || "Unknown")}</p>
        
                    <p><strong>Mother:</strong> {(d.mother?.forename || "")} {(d.mother?.surname || "Unknown")}</p>
        
                    <!-- Colleges -->
                    <p><strong>Colleges:</strong>
                        {#if d.study?.colleges?.length > 0}
                            {#each d.study.colleges as college, index}
                                {#if index > 0}<br>{/if}
                                {college.name || "Unknown"} (From: {college.from || "Unknown"})
                            {/each}
                        {:else} None
                        {/if}
                    </p>
        
                    <!-- Degrees -->
                    <p><strong>Degrees:</strong>
                        {#if d.study?.degrees?.length > 0}
                            {#each d.study.degrees as degree, index}
                                {#if index > 0}<br>{/if}
                                {degree.name || "Unknown"} (Date: {degree.date || "Unknown"})
                            {/each}
                        {:else} None
                        {/if}
                    </p>
        
                    <!-- Floruit -->
                    <p><strong>Floruit:</strong>
                        {#if d.floruit?.length > 0}
                            {#each d.floruit as floruit, index}
                                {#if index > 0}<br>{/if}
                                {floruit.occupation || "Unknown"} at 
                                {floruit.location?.original_name || "Unknown Location"}
                                (From: {floruit.from || "Unknown"} To: {floruit.to || "Unknown"})
                            {/each}
                        {:else} None
                        {/if}
                    </p>
        
                    <!-- References -->
                    <p><strong>References:</strong>
                        {#if d.references?.length > 0}
                            {#each d.references as reference, index}
                                {#if index > 0}<br>{/if}
                                {reference || "Unknown"}
                            {/each}
                        {:else} None
                        {/if}
                    </p>
        
                    <p><strong>ID:</strong> {d.id || "Unknown"}</p>
        
                    <hr />
                {/each}
            </div>
        </div>
        
        
        
    </div>
</div>

<style>
    #details {
        color: black;
        position: fixed;
        right: -100%;
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

    /* @media (max-width: 1450px) {
        #details {
            width: 450px;
        }
    }

    @media (max-width: 1200px) {
        #details {
            width: 450px;
        }
    } */

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
        font-weight: 300;
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
        flex-grow: 1; /* Takes one unit of the available space */
    }

    #peace_process {
        flex-grow: 1; /* Takes three units of the available space each */
    }

    h5 {
        position: sticky;
        top: 0;
        z-index: 1;
        margin: 0;
        padding: 5px 15px;
        color: black;
        font-size: 1em;
        font-weight: 550;
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
