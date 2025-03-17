<script>
    import {
        selectedDegreeStore,
        selectedCareerStore,
        selectedCollegeStore,
    } from "../years";
    import * as d3 from "d3";
    import { dimensions, colleges, degrees, careers } from "../utils";

    export let parallel_data;
    export let career_width;
    export let career_height;

    let withoutCareerDimensions = ["college", "degree"];
    let withoutCollegeDimensions = ["degree", "career"];

    // Remove 'career' field
    $: withoutCareer = parallel_data.map(({ career, ...rest }) => rest);

    // Remove 'college' field
    $: withoutCollege = parallel_data.map(({ college, ...rest }) => rest);

    $: collegeCounts = parallel_data.reduce((acc, item) => {
        const college = item.college;
        acc[college] = (acc[college] || 0) + 1;
        return acc;
    }, {});

    $: degreeCounts = parallel_data.reduce((acc, item) => {
        const degree = item.degree;
        acc[degree] = (acc[degree] || 0) + 1;
        return acc;
    }, {});

    $: careerCounts = parallel_data.reduce((acc, item) => {
        const career = item.career;
        acc[career] = (acc[career] || 0) + 1;
        return acc;
    }, {});

    let gy_college;
    let gy_degree;
    let gy_career;

    let margin = { top: 30, right: 35, bottom: 10, left: 35 };
    $: width = career_width - 10;
    $: height = career_height - 10;

    $: y = {
        college: d3
            .scalePoint()
            .domain(colleges)
            .range([height - margin.bottom, margin.top]),
        degree: d3
            .scalePoint()
            .domain(degrees)
            .range([height - margin.bottom, margin.top]),

        career: d3
            .scalePoint()
            .domain(careers)
            .range([height - margin.bottom, margin.top]),
    };

    $: x_scale = d3
        .scalePoint()
        .domain(dimensions)
        .range([margin.left, width - margin.right]);

    $: x_bar_scale = d3.scaleLinear().domain([0, 180]).range([2, 35]);

    $: d3.select(gy_college)
        .call(d3.axisLeft(y["college"]))
        .selectAll("text")
        .style("font-family", "Montserrat")
        .style("font-weight", 300);
    $: d3.select(gy_degree)
        .call(d3.axisLeft(y["degree"]))
        .selectAll("text")
        .style("font-family", "Montserrat")
        .style("font-weight", 300);
    $: d3.select(gy_career)
        .call(d3.axisLeft(y["career"]))
        .selectAll("text")
        .style("font-family", "Montserrat")
        .style("font-weight", 300);

    $: line = function path(d) {
        return d3.line()(
            dimensions.map(function (p) {
                return [x_scale(p), y[p](d[p])];
            }),
        );
    };

    $: car_line = function path(d) {
        return d3.line()(
            withoutCareerDimensions.map(function (p) {
                return [x_scale(p), y[p](d[p])];
            }),
        );
    };

    $: col_line = function path(d) {
        return d3.line()(
            withoutCollegeDimensions.map(function (p) {
                return [x_scale(p), y[p](d[p])];
            }),
        );
    };


    function college_click(college) {
        selectedCollegeStore.set(college);
    }

    function degree_click(degree) {
        selectedDegreeStore.set(degree);
    }

    function career_click(career) {
        selectedCareerStore.set(career);
    }

    $: {
        d3.select(gy_college)
            .selectAll("path, .tick>line")
            .style("opacity", 0.5);
        d3.select(gy_degree)
            .selectAll("path, .tick>line")
            .style("opacity", 0.5);
        d3.select(gy_career)
            .selectAll("path, .tick>line")
            .style("opacity", 0.5);
    }
</script>

<svg {width} {height}>
    {#if parallel_data}
        {#each withoutCareer as data}
            <path fill="none" stroke="orange" opacity="0.1" d={car_line(data)} />
        {/each}
        {#each withoutCollege as data}
            <path fill="none" stroke="gray" opacity="0.1" d={col_line(data)} />
        {/each}
    {/if}
    <g bind:this={gy_college} transform="translate({x_scale('college')},0)" />
    <g bind:this={gy_degree} transform="translate({x_scale('degree')},0)" />
    <g bind:this={gy_career} transform="translate({x_scale('career')},0)" />
    {#each dimensions as d}
        <text
            x={x_scale(d)}
            text-anchor="middle"
            font-weight="400"
            font-size="13"
            fill="white"
            y={15}>{d.toUpperCase()}</text
        >
    {/each}
    {#if collegeCounts}
        {#each Object.entries(collegeCounts) as [college, count]}
            <rect
                x={x_scale("college")}
                rx="1"
                y={y["college"](college) - 5}
                width={x_bar_scale(count)}
                height="10"
                fill="#F17822"
                class="bar"
                role="button"
                tabindex="0"
                aria-label="Select {college}"
                on:click={() => college_click(college)}
                on:keydown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                        college_click(college);
                    }
                }}
                style="cursor: pointer;"
            />
        {/each}
        {#each Object.entries(degreeCounts) as [degree, count]}
            <rect
                x={x_scale("degree")}
                rx="1"
                y={y["degree"](degree) - 5}
                width={x_bar_scale(count)}
                height="10"
                fill="#F17822"
                class="bar"
                role="button"
                tabindex="0"
                on:click={() => degree_click(degree)}
                on:keydown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                        degree_click(degree);
                    }
                }}
                style="cursor: pointer;"
            />
        {/each}
        {#each Object.entries(careerCounts) as [career, count]}
            <rect
                x={x_scale("career")}
                rx="1"
                y={y["career"](career) - 5}
                width={x_bar_scale(count)}
                height="10"
                fill="white"
                class="bar"
                role="button"
                tabindex="0"
                on:click={() => career_click(career)}
                on:keydown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                        career_click(career);
                    }
                }}
                style="cursor: pointer;"
            />
        {/each}
    {/if}
</svg>

<style>
</style>
