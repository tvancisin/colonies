<script>
    import * as d3 from "d3";
    import {
        selectedYearsStore,
        selectedCareerStore,
        selectedDegreeStore,
        selectedCollegeStore,
    } from "../years";
    import { year_filter, career, degree, college } from "../utils";

    export let current_data;
    export let selected_country;

    let selected_years = [1700, 1900];
    let selected_career;
    let selected_degree;
    let selected_college;
    let data_to_draw;
    let width = 800;
    let height = 160;
    let containerWidth = 800;
    let margin = { top: 20, right: 30, bottom: 20, left: 40 };
    let svg;
    let x_ticks = [1700, 1725, 1750, 1775, 1800, 1825, 1850, 1875, 1900];
    let y_ticks = [5, 15];
    let selectedLineStart = null,
        selectedLineEnd = null,
        selectedYearStart = null,
        selectedYearEnd = null;
    //create array with all years. some may be empty
    let allYears = Array.from({ length: 1900 - 1700 + 1 }, (_, i) => 1700 + i);

    // assign clicked country data to data_to_draw
    $: if (current_data) {
        data_to_draw = current_data;
    }

    ////SELECTED CAREER FILTER
    //catch new selected career
    const career_unsubscribe = selectedCareerStore.subscribe((value) => {
        selected_career = value;
    });

    $: if (selected_career.length != 0) {
        // construct career groups based on clicked country
        let career_groups = career(current_data);

        // only get people with selected career
        data_to_draw = career_groups[selected_career].filter(
            (item, index, self) =>
                index === self.findIndex((t) => t.id === item.id),
        );
    } else if (selected_career.length == 0) {
        data_to_draw = current_data;
    }

    ////SELECTED DEGREE FILTER
    //catch new selected degree
    const degree_unsubscribe = selectedDegreeStore.subscribe((value) => {
        selected_degree = value;
    });

    $: if (selected_degree.length != 0) {
        // construct degree groups
        let degree_groups = degree(current_data);

        // only selected degree
        data_to_draw = degree_groups[selected_degree].filter(
            (item, index, self) =>
                index === self.findIndex((t) => t.id === item.id),
        );
    } else if (selected_degree.length == 0) {
        data_to_draw = current_data;
    }

    ////SELECTED COLLEGE FILTER
    //catch new selected college
    const college_unsubscribe = selectedCollegeStore.subscribe((value) => {
        selected_college = value;
    });

    $: if (selected_college.length != 0) {
        // construct college groups
        let college_groups = college(current_data);

        // only selected college 
        data_to_draw = college_groups[selected_college].filter(
            (item, index, self) =>
                index === self.findIndex((t) => t.id === item.id),
        );
    } else if (selected_college.length == 0) {
        data_to_draw = current_data;
    }

    // DATA PREP FOR TIMELINE
    //group data by study years
    $: grouped = d3
        .groups(data_to_draw, (d) => {
            if (d.study && d.study.colleges && d.study.colleges.length > 0) {
                return +d.study.colleges[0].from; // Convert to number
            } else if (
                d.study &&
                d.study.degrees &&
                d.study.degrees.length > 0
            ) {
                return +d.study.degrees[0].date.substring(0, 4);
            }
        })
        .filter((group) => group[0] !== undefined) // Remove cases where 'from' is undefined
        .sort((a, b) => d3.ascending(a[0], b[0])); // Sort by 'from' year

    $: groupedDataMap = new Map(grouped.map((d) => [d[0], d[1].length]));

    //final data
    $: completeGrouped = allYears.map((year) => [
        year,
        groupedDataMap.get(year) || 0,
    ]); // Default value is 0 if year is not found

    // Reactive block to update width when selected_country changes
    $: {
        if (selected_country) {
            // width = containerWidth - innerWidth * 0.4;
            // d3.selectAll("#timeline, #year_detail")
            //     .style("width", "100%")
            //     .style("left", "0%");
        } else {
            width = containerWidth; // Full width when selected_country is null
            d3.selectAll("#timeline, #year_detail")
                .style("width", "calc(100% - 550px)")
                .style("left", "0%");
        }
    }

    //SCALES FOR TIMELINE
    // Create the X scale for the years (horizontal axis)
    $: xScale = d3
        .scaleBand()
        .domain(allYears) // Use all years
        .range([margin.left, width - margin.right])
        .padding(0.2);

    // Create the Y scale for the counts (vertical axis)
    $: yScale = d3
        .scaleLinear()
        .domain([0, 20]) // The max number of elements
        .nice() // Adds some padding to the top of the Y axis
        .range([height - margin.bottom, margin.top]);

    //BRUSHING
    $: brush = d3
        .brushX()
        .handleSize(10)
        .extent([
            [margin.left, margin.top],
            [width - margin.right, height - margin.bottom],
        ])
        .on("start brush end", brushed);

    let snappedSelection = function (bandScale, domain) {
        const min = d3.min(domain),
            max = d3.max(domain);
        return [bandScale(min), bandScale(max) + bandScale.bandwidth()];
    };

    let previousSelectedYears = { start: null, end: null };

    function brushed(event) {
        // Check if the event is valid (either brush or click event)
        if (
            !event.selection &&
            !(event.sourceEvent && event.sourceEvent.offsetX)
        )
            return;

        // Handle brushing and clicking scenarios
        let [x0, x1] = event.selection
            ? event.selection
            : [1, 2].fill(event.sourceEvent ? event.sourceEvent.offsetX : 0); // Safely fill with 0 if no sourceEvent

        // If sourceEvent exists and is a valid mouse event, handle snapping
        if (event.sourceEvent && "offsetX" in event.sourceEvent) {
            // If the selection is smaller than one band, treat it as a click and snap to the closest year
            if (Math.abs(x1 - x0) < xScale.bandwidth()) {
                let clickX = event.sourceEvent.offsetX; // Get the click point
                let closestYear = allYears.reduce((a, b) =>
                    Math.abs(xScale(b) - clickX) < Math.abs(xScale(a) - clickX)
                        ? b
                        : a,
                );
                x0 = xScale(closestYear); // Snap to the closest year
                x1 = x0 + xScale.bandwidth(); // Ensure a full year is selected
            }
        }

        // Now filter the years between x0 and x1
        let all_selected_years = allYears.filter((year) => {
            let x = xScale(year);
            return x >= x0 && x <= x1;
        });

        // If it's the end of the brush event, move the brush to the snapped position
        if (event.sourceEvent && event.type === "end") {
            let s1 = snappedSelection(xScale, all_selected_years);
            x0 = s1[0];
            x1 = s1[1];
            d3.select(this).transition().call(event.target.move, s1);
        }

        // Set line positions and year labels based on selection
        selectedLineStart = x0;
        selectedYearStart = all_selected_years[0];
        selectedLineEnd = x1;
        selectedYearEnd = all_selected_years[all_selected_years.length - 1];

        // Check if both selectedYearStart and selectedYearEnd have changed
        if (
            previousSelectedYears.start !== null &&
            previousSelectedYears.end !== null &&
            (selectedYearStart !== previousSelectedYears.start ||
                selectedYearEnd !== previousSelectedYears.end)
        ) {
            //selected two years
            selected_years = [selectedYearStart, selectedYearEnd];
            selectedYearsStore.set(selected_years);
        }

        // Update the previous values for the next function call
        previousSelectedYears.start = selectedYearStart;
        previousSelectedYears.end = selectedYearEnd;
    }

    $: {
        // Update brush component
        if (svg) {
            d3.select(svg)
                .select(".brush")
                .call(brush)
                .call(brush.move, [margin.left, width - margin.right]);
        }
    }

    // Create X axis with custom ticks
    $: xAxis = d3.axisBottom(xScale).tickValues(x_ticks);
    $: yAxis = d3.axisLeft(yScale).tickValues(y_ticks);

    // Append axes to the SVG
    $: {
        if (svg) {
            d3.select(svg)
                .select(".x-axis")
                .call(xAxis)
                .select(".domain")
                .style("stroke", "gray");

            d3.select(svg)
                .select(".x-axis")
                .selectAll("text")
                .style("font-family", "Montserrat")
                .style("font-weight", 300)
                .style("font-size", 13)
                .style("fill", "white");

            d3.select(svg)
                .select(".y-axis")
                .call(yAxis)
                .select(".domain")
                .style("stroke", "gray");

            d3.select(svg)
                .select(".y-axis")
                .selectAll("text")
                .style("font-family", "Montserrat")
                .style("font-weight", 300)
                .style("font-size", 13)
                .style("fill", "white");
        }
    }

    // let one_year;
    // $: if (selected_years[0] == selected_years[1]) {
    //     //filter data to selected years
    //     one_year = year_filter(
    //         current_data,
    //         selected_years[0],
    //         selected_years[1],
    //     );

    //     one_year.forEach((d) => {
    //         if (d.birth_date) {
    //             if (d.birth_date.length > 4) {
    //                 d.birth_date = +d.birth_date.slice(0, 4);
    //             } else {
    //                 d.birth_date = +d.birth_date;
    //             }
    //         }

    //         if (d.death_date) {
    //             if (d.death_date.length > 4) {
    //                 d.death_date = +d.death_date.slice(0, 4);
    //             } else {
    //                 d.death_date = +d.death_date;
    //             }
    //         }

    //         if (d.floruit) {
    //             d.floruit.forEach((x) => {
    //                 if (x.from) {
    //                     if (x.from.length > 4) {
    //                         x.from = +x.from.slice(0, 4);
    //                     } else {
    //                         x.from = +x.from;
    //                     }
    //                 } else {
    //                     x.from = selected_years[0] + 10;
    //                 }
    //             });
    //         }
    //     });
    //     d3.select("#year_detail").style("visibility", "visible");
    // } else {
    //     d3.select("#year_detail").style("visibility", "hidden");
    // }
</script>

<!-- <div id="year_detail">
    {#if one_year}
        <svg {width} height="110px">
            {#each one_year as year, i}
                <rect
                    x={year.birth_date
                        ? xScale(year.birth_date)
                        : xScale(selected_years[0]) - 10}
                    y={104.5 - i * 5}
                    width={year.death_date
                        ? xScale(year.death_date) -
                          (year.birth_date
                              ? xScale(year.birth_date)
                              : xScale(selected_years[0]) - 10)
                        : xScale(selected_years[0]) +
                          10 -
                          (year.birth_date
                              ? xScale(year.birth_date)
                              : xScale(selected_years[0]) - 10)}
                    height="1"
                    fill="#424242"
                />
                {#if year.birth_date}
                    <circle
                        cx={xScale(year.birth_date)}
                        cy={104.5 - i * 5}
                        r="2"
                        fill="white"
                        stroke="black"
                        stroke-width="0.5"
                    />
                {:else}
                    <rect
                        x={xScale(selected_years[0]) - 15}
                        y={104.5 - i * 5}
                        width="5"
                        height="1"
                        fill="gray"
                    />
                {/if}

                {#if year.death_date}
                    <circle
                        cx={xScale(year.death_date)}
                        cy={104.5 - i * 5}
                        r="2"
                        fill="black"
                        stroke="black"
                        stroke-width="0.5"
                    />
                {:else}
                    <rect
                        x={xScale(selected_years[0]) + 10}
                        y={104.5 - i * 5}
                        width="5"
                        height="1"
                        fill="gray"
                    />
                {/if}
                <circle
                    cx={xScale(selected_years[0]) + xScale.bandwidth() / 2}
                    cy={104.5 - i * 5}
                    r="2"
                    fill="#00539B"
                    stroke="black"
                    stroke-width="0.5"
                />
                {#each year.floruit as flor}
                    <circle
                        cx={xScale(flor.from)}
                        cy={105 - i * 5}
                        r="2"
                        fill="red"
                        stroke="black"
                        stroke-width="0.5"
                    />
                {/each}
            {/each}
        </svg>
    {/if}
</div> -->
<div id="timeline" bind:clientWidth={containerWidth} bind:clientHeight={height}>
    <svg {width} {height} bind:this={svg}>
        <!-- Bars -->
        {#each completeGrouped as d}
            <rect
                x={xScale(d[0])}
                rx="1"
                y={yScale(d[1])}
                width={xScale.bandwidth()}
                height={yScale(0) - yScale(d[1])}
                fill=" #F17822"
                class="bar"
            />
        {/each}

        <!-- Append Axes -->
        <g
            class="x-axis"
            transform={`translate(0,${height - margin.bottom})`}
        />
        <g class="y-axis" transform={`translate(${margin.left},0)`} />

        <!-- Brush -->
        <g class="brush"></g>

        <!-- Period lines and year labels -->
        {#if selectedLineStart && selectedLineEnd}
            <!-- Start line and label -->
            <line
                x1={selectedLineStart}
                y1={margin.top - 7}
                x2={selectedLineStart}
                y2={height - margin.bottom}
                stroke="white"
                stroke-width="2"
            />
            <text
                x={selectedLineStart}
                y={margin.top - 10}
                text-anchor="middle"
                font-size="14px"
                font-weight="300"
                fill="white"
            >
                {selectedYearStart}
            </text>
            <!-- End line -->
            <line
                x1={selectedLineEnd}
                y1={margin.top - 7}
                x2={selectedLineEnd}
                y2={height - margin.bottom}
                stroke="white"
                stroke-width="2"
            />
            <!-- Only show the end label if more than one year is selected -->
            {#if selectedYearStart !== selectedYearEnd}
                <text
                    x={selectedLineEnd}
                    y={margin.top - 10}
                    text-anchor="middle"
                    font-size="14px"
                    font-weight="300"
                    fill="white"
                >
                    {selectedYearEnd}
                </text>
            {/if}
        {/if}
    </svg>
</div>

<style>
    #timeline {
        position: absolute;
        border-radius: 5px;
        bottom: 0px;
        width: calc(100% - 550px);
        height: 160px;
    }

    :global(.brush .selection) {
        stroke: none;
        fill-opacity: 0.2;
    }

    #year_detail {
        position: absolute;
        visibility: hidden;
        width: 95%;
        height: 110px;
        bottom: 160px;
    }
</style>
