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

    // Remove 'career' field and remove duplicates
    $: withoutCareer = Array.from(
        new Set(
            parallel_data.map(({ career, ...rest }) => JSON.stringify(rest)),
        ),
    ).map((str) => JSON.parse(str));

    // Remove 'college' field and remove duplicates
    $: withoutCollege = Array.from(
        new Set(
            parallel_data.map(({ college, ...rest }) => JSON.stringify(rest)),
        ),
    ).map((str) => JSON.parse(str));

    $: collegeCounts = (() => {
        const seen = new Set();
        const counts = {};

        for (const entry of parallel_data) {
            const key = `${entry.id}::${entry.college}`;
            if (!seen.has(key)) {
                seen.add(key);
                counts[entry.college] = (counts[entry.college] || 0) + 1;
            }
        }

        return counts;
    })();

    $: degreeCounts = (() => {
        const seen = new Set();
        const counts = {};

        for (const entry of parallel_data) {
            const key = `${entry.id}::${entry.degree}`;
            if (!seen.has(key)) {
                seen.add(key);
                counts[entry.degree] = (counts[entry.degree] || 0) + 1;
            }
        }

        return counts;
    })();

    $: careerCounts = (() => {
        const seen = new Set();
        const counts = {};

        for (const entry of parallel_data) {
            const key = `${entry.id}::${entry.career}`;
            if (!seen.has(key)) {
                seen.add(key);
                counts[entry.career] = (counts[entry.career] || 0) + 1;
            }
        }

        return counts;
    })();

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
        .range([margin.left + 5, width - margin.right - 20]);

    $: x_bar_scale = d3.scaleLinear().domain([0, 400]).range([2, 40]);

    $: d3.select(gy_college)
        .call(d3.axisLeft(y["college"]))
        .selectAll("text")
        .style("font-family", "Montserrat")
        .style("font-weight", 500);
    $: d3.select(gy_degree)
        .call(d3.axisLeft(y["degree"]))
        .selectAll("text")
        .style("font-family", "Montserrat")
        .style("font-weight", 500);
    $: d3.select(gy_career)
        .call(d3.axisLeft(y["career"]))
        .selectAll("text")
        .style("font-family", "Montserrat")
        .style("font-weight", 500);

    // $: line = function path(d) {
    //     return d3.line()(
    //         dimensions.map(function (p) {
    //             return [x_scale(p), y[p](d[p])];
    //         }),
    //     );
    // };

    function curvedPath([x1, y1], [x2, y2]) {
        const dx = (x2 - x1) / 2;
        return `M${x1},${y1} C${x1 + dx},${y1} ${x2 - dx},${y2} ${x2},${y2}`;
    }

    $: car_line = function path(d) {
        const p1 = [x_scale("college"), y["college"](d["college"])];
        const p2 = [x_scale("degree"), y["degree"](d["degree"])];
        return curvedPath(p1, p2);
    };

    $: col_line = function path(d) {
        const p1 = [x_scale("degree"), y["degree"](d["degree"])];
        const p2 = [x_scale("career"), y["career"](d["career"])];
        return curvedPath(p1, p2);
    };

    // $: car_line = function path(d) {
    //     return d3.line()(
    //         withoutCareerDimensions.map(function (p) {
    //             return [x_scale(p), y[p](d[p])];
    //         }),
    //     );
    // };

    // $: col_line = function path(d) {
    //     return d3.line()(
    //         withoutCollegeDimensions.map(function (p) {
    //             return [x_scale(p), y[p](d[p])];
    //         }),
    //     );
    // };

    function college_click(college) {
        console.log(college);

        selectedCollegeStore.set(college);
    }

    function degree_click(degree) {
        selectedDegreeStore.set(degree);
    }

    function career_click(career) {
        console.log(career);

        selectedCareerStore.set(career);
    }

    $: {
        d3.select(gy_college)
            .selectAll("path, .tick>line")
            .style("opacity", 0.4);
        d3.select(gy_degree)
            .selectAll("path, .tick>line")
            .style("opacity", 0.4);
        d3.select(gy_career)
            .selectAll("path, .tick>line")
            .style("opacity", 0.4);
    }

    $: d3.select(gy_degree)
        .call(d3.axisLeft(y["degree"]))
        .selectAll(".tick")
        .each(function () {
            const tick = d3.select(this);
            const text = tick.select("text");
            const bbox = text.node().getBBox();

            tick.insert("rect", "text")
                .attr("x", bbox.x - 2)
                .attr("y", bbox.y - 2)
                .attr("width", bbox.width + 4)
                .attr("height", bbox.height + 4)
                .attr("fill", "white")
                .attr("fill-opacity", 0.4)
                .attr("rx", 2)
                .attr("ry", 2);
        })
        .selectAll("text")
        .style("font-family", "Montserrat")
        .style("font-weight", 500);

    $: d3.select(gy_career)
        .call(d3.axisLeft(y["career"]))
        .selectAll(".tick")
        .each(function () {
            const tick = d3.select(this);
            const text = tick.select("text");
            const bbox = text.node().getBBox();

            tick.insert("rect", "text")
                .attr("x", bbox.x - 2)
                .attr("y", bbox.y - 2)
                .attr("width", bbox.width + 4)
                .attr("height", bbox.height + 4)
                .attr("fill", "white")
                .attr("fill-opacity", 0.4)
                .attr("rx", 2)
                .attr("ry", 2);
        })
        .selectAll("text")
        .style("font-family", "Montserrat")
        .style("font-weight", 500);
</script>

<svg {width} {height}>
    {#if parallel_data}
        {#each withoutCareer as data}
            <!-- {console.log(data, car_line(data))} -->
            <path fill="none" stroke="gray" opacity="0.2" d={car_line(data)} />
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
            font-weight="500"
            font-size="13"
            fill="black"
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
                fill="black"
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

            <rect
                x={x_scale("college") + x_bar_scale(count) + 2}
                y={y["college"](college) - 8}
                width={count.toString().length === 1
                    ? 14
                    : count.toString().length === 2
                      ? 20
                      : 22}
                height="14"
                fill="white"
                opacity="0.5"
                rx="2"
            />
            <text
                x={x_scale("college") + x_bar_scale(count) + 5}
                y={y["college"](college) + 3}
                stroke="none"
                fill="black"
                font-size="11"
                font-weight="500">{count}</text
            >
        {/each}
        {#each Object.entries(degreeCounts) as [degree, count]}
            <rect
                x={x_scale("degree")}
                rx="1"
                y={y["degree"](degree) - 5}
                width={x_bar_scale(count)}
                height="10"
                fill="black"
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

            <rect
                x={x_scale("degree") + x_bar_scale(count) + 2}
                y={y["degree"](degree) - 8}
                width={count.toString().length === 1
                    ? 14
                    : count.toString().length === 2
                      ? 20
                      : 24}
                height="14"
                fill="white"
                opacity="0.5"
                rx="2"
            />
            <text
                x={x_scale("degree") + x_bar_scale(count) + 5}
                y={y["degree"](degree) + 3}
                stroke="none"
                fill="black"
                font-size="11"
                font-weight="500">{count}</text
            >
        {/each}
        {#each Object.entries(careerCounts) as [career, count]}
            <rect
                x={x_scale("career")}
                rx="1"
                y={y["career"](career) - 5}
                width={x_bar_scale(count)}
                height="10"
                fill="black"
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

            <rect
                x={x_scale("career") + x_bar_scale(count) + 2}
                y={y["career"](career) - 8}
                width={count.toString().length === 1
                    ? 14
                    : count.toString().length === 2
                      ? 20
                      : 24}
                height="14"
                fill="white"
                opacity="0.5"
                rx="2"
            />
            <text
                x={x_scale("career") + x_bar_scale(count) + 5}
                y={y["career"](career) + 3}
                stroke="none"
                fill="black"
                font-size="11"
                font-weight="500">{count}</text
            >
        {/each}
    {/if}
</svg>
