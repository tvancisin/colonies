<script>
    import { createEventDispatcher } from "svelte";
    import {
        year_filter,
        constructNodesAndLinks,
        constructParallelData,
        career,
        degree,
        college,
    } from "../utils";
    import {
        selectedYearsStore,
        selectedCareerStore,
        selectedDegreeStore,
        selectedCollegeStore,
    } from "../years";
    // import Network from "./Network.svelte";
    import Parallel from "./Parallel.svelte";
    const dispatch = createEventDispatcher();

    export let current_data;
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
    let filteredCountry;
    let selectedCareer;
    let selectedDegree;
    let selectedCollege;

    // selected years from store
    const unsubscribe = selectedYearsStore.subscribe((value) => {
        selectedYears = value;
    });
    // selected career from store
    const career_unsubscribe = selectedCareerStore.subscribe((value) => {
        selectedCareer = value;
    });
    // selected degree from store
    const degree_unsubscribe = selectedDegreeStore.subscribe((value) => {
        selectedDegree = value;
    });
    // selected college from store
    const college_unsubscribe = selectedCollegeStore.subscribe((value) => {
        selectedCollege = value;
    });

    //// COLONY FILTER
    $: if (selected_country != null) {
        // default data
        filteredCountry = (
            current_data_string === "birth"
                ? births_per_colony
                : floruit_per_colony
        ).filter((item) => item[0] == selected_country)[0][1];

        // data to operate with
        data = filteredCountry;
        // console.log("one");
    } else {
        // console.log("three");
        data = current_data;
    }

    $: if (current_data) {
        data = current_data;
    }

    //// YEAR FILTER
    $: if (selectedYears.length != 0) {
        data = current_data;
        //filter data to selected years
        let filter_years = year_filter(
            data,
            selectedYears[0],
            selectedYears[1],
        );

        //update data
        data = filter_years;
    }

    //// COLLEGE FILTER
    $: if (selectedCollege.length != 0) {
        // college groups
        let college_groups = college(data);

        // only selected college
        let fin_college = college_groups[selectedCollege].filter(
            (item, index, self) =>
                index === self.findIndex((t) => t.id === item.id),
        );

        // update data
        data = fin_college;
    }

    //// DEGREE FILTER
    $: if (selectedDegree.length != 0) {
        // degree groups
        let degree_groups = degree(data);

        // only selected degree
        let fin_degree = degree_groups[selectedDegree].filter(
            (item, index, self) =>
                index === self.findIndex((t) => t.id === item.id),
        );

        // update data
        data = fin_degree;
    }

    //// CAREER FILTER
    $: if (selectedCareer.length != 0) {
        // construct career groups
        let career_groups = career(data);

        // only selected career
        let fin_career = career_groups[selectedCareer].filter(
            (item, index, self) =>
                index === self.findIndex((t) => t.id === item.id),
        );

        // update data
        data = fin_career;
    }

    // function closeDetails() {
    //     dispatch("close");
    // }

    // if refreshed, reset to filteredCountry data
    // let check = false;
    // $: if (check) {
    //     data = filteredCountry;
    //     check = false;
    // }

    //data for network
    // $: node_link = constructNodesAndLinks(data);

    // sort by years of study
    function extractYear(entry) {
        // Try to get year from colleges[0].from
        if (entry.study?.colleges?.length > 0 && entry.study.colleges[0].from) {
            return parseInt(entry.study.colleges[0].from);
        }

        // Else try to get year from degrees[0].date
        if (entry.study?.degrees?.length > 0 && entry.study.degrees[0].date) {
            return parseInt(entry.study.degrees[0].date.slice(0, 4));
        }

        // Default fallback if neither exists
        return Infinity; // Places this item at the end
    }

    // data for parallel
    $: if (data) {
        data.sort((a, b) => extractYear(a) - extractYear(b));
        console.log(data);
        const withColony = data.filter(
            (person) => person.birth_location?.colony !== undefined,
        );
        console.log(withColony);

        // const idArray = data.map(obj => obj.id);
        // console.log(idArray);
        parallel_data = constructParallelData(data);
    }
</script>

<div
    id="details"
    bind:clientWidth={details_width}
    bind:clientHeight={details_height}
>
    <div id="peace_title_div">
        {#if selected_country == "America"}
            <h3>North America</h3>
        {:else if selected_country == "India"}
            <h3>British India</h3>
        {:else if selected_country == "Asia"}
            <h3>Southeast Asia</h3>
        {:else if selected_country == "Australia"}
            <h3>Australia & New Zealand</h3>
        {:else if selected_country == "Caribbean"}
            <h3>{selected_country}</h3>
        {:else if selected_country == "Africa"}
            <h3>{selected_country}</h3>
        {:else if selected_country == null}
            <h3>Whole Empire</h3>
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
        <div id="people_details">
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
                            <strong>Father:</strong>
                            {d.father?.forename || ""}
                            {d.father?.surname || "Unknown"}
                        </p>
                        <p>
                            <strong>Mother:</strong>
                            {d.mother?.forename || ""}
                            {d.mother?.surname || "Unknown"}
                        </p>
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
                        <p>
                            <strong>Career:</strong>
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
                        <p>
                            <strong>Death Location:</strong>
                            {d.death_location?.original_name || "Unknown"}
                        </p>
                        <p>
                            <strong>Death Date:</strong>
                            {d.death_date || "Unknown"}
                        </p>
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
                        <p>
                            <strong>Online Register:</strong>
                            {#if d.new_id}
                                <a
                                    href={`https://arts.st-andrews.ac.uk/biographical-register/data/documents/${d.new_id}`}
                                    target="_blank"
                                >
                                    Link
                                </a>
                            {:else}
                                <a
                                    href={`https://arts.st-andrews.ac.uk/biographical-register/data/documents/${d.id}`}
                                    target="_blank"
                                >
                                    Link
                                </a>
                            {/if}
                        </p>
                        <!-- <p><strong>ID:</strong> {d.id || "Unknown"}</p> -->
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
        position: absolute;
        right: 0px;
        bottom: 0px;
        width: 35%;
        height: 100%;
        transition: right 0.3s ease;
        /* background-color: #003847; */
        background-color: #242429;
        overflow: hidden;
        z-index: 5;
        font-family: "Montserrat", sans-serif;
        font-optical-sizing: auto;
        font-weight: 300;
        font-style: normal;
        display: flex;
        flex-direction: column;
        z-index: 11;
        box-shadow: -2px 0 8px -4px #000000;
    }
    hr {
        width: 80%;
        color: rgb(66, 66, 66);
        border: none;
        border-top: 1px solid;
    }

    strong {
        font-weight: 600;
        color: #000000;
    }
    @media (max-width: 768px) {
        #details {
            width: 100%;
            height: 50%;
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
        padding: 3px;
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

    #peace_title_div {
        display: flex;
        align-items: stretch;
    }

    #peace_content {
        height: 100%;
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;
        overflow-y: auto;
        font-size: 0.8em;
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
    #people_details {
        flex-basis: 0;
        width: 100%;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        line-height: 1.5;
        background: #ffffff;
        font-size: 12px;
        color: rgb(0, 0, 0);
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
        font-weight: 400;
        overflow-x: hidden;
    }

    #career_wrapper {
        flex-grow: 1;
        overflow-y: auto;
        padding: 2px;
        background: none;
        box-sizing: border-box;
        font-weight: 300;
    }

    #peace_title_div {
        text-align: center;
        position: relative;
        margin: 2px;
    }

    :global(a) {
        color: rgb(87, 87, 87);
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
