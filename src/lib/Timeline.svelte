<script>
    import * as d3 from "d3";
    import {
        selectedYearsStore,
        selectedCareerStore,
        selectedGenderStore,
    } from "../years";

    export let current_data;
    export let birth_data;
    export let floruit_data;
    export let selected_country;
    export let births_per_colony;

    let data;
    let selected_years;
    let selected_gender;
    let selected_career;
    let width = 800;
    let height = 160;
    let containerWidth = 800;
    let margin = { top: 20, right: 30, bottom: 30, left: 40 };
    let svg;
    let x_ticks = [1700, 1725, 1750, 1775, 1800, 1825, 1850, 1875, 1900]; // Custom ticks
    let y_ticks = [5, 15]; // Custom ticks
    let selectedLineStart = null,
        selectedLineEnd = null,
        selectedYearStart = null,
        selectedYearEnd = null;

    // // DATA PREPARATION TODO: simplify!
    // //switching between birth and floruit data
    // $: if (current_data) {
    //     if (current_data == "birth") {
    //         data = birth_data;
    //     } else if (current_data == "floruit") {
    //         data = floruit_data;
    //     }
    // }
    //create array with all years. some may be empty 
    let allYears = Array.from({ length: 1900 - 1700 + 1 }, (_, i) => 1700 + i);
    //group data by study years
    $: grouped = d3
        .groups(current_data, (d) => {
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
    //final dataset
    $: completeGrouped = allYears.map((year) => [
        year,
        groupedDataMap.get(year) || 0,
    ]); // Default value is 0 if year is not found

    // //SELECTED GENDER FILTER
    // const unsubscribe = selectedGenderStore.subscribe((value) => {
    //     selected_gender = value[0];
    // });

    // $: {
    //     if (selected_gender) {
    //         data = selected_gender;
    //     } else {
    //         data = birth_data;
    //     }
    // }

    // //SELECTED CAREER FILTER
    // const unsubscribe_career = selectedCareerStore.subscribe((value) => {
    //     selected_career = value[0];
    // });

    // $: {
    //     if (selected_career) {
    //         data = selected_career;
    //     } else {
    //         data = birth_data;
    //     }
    // }

    // Reactive block to update width when selected_country changes
    $: {
        if (selected_country) {
            width = containerWidth - innerWidth * 0.4; // Reduce the width by 450px when selectedProperties is not null
            d3.select("#timeline").style("width", "100%")
            // let selected_colony = births_per_colony.filter(
            //     (group) => group[0] == selected_country,
            // );
            // data = selected_colony[0][1];
        } else {
            width = containerWidth; // Full width when selected_country is null
            d3.select("#timeline").style("width", "85%")
            // data = birth_data;
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
        //selected two years
        selected_years = [selectedYearStart, selectedYearEnd];
        selectedYearsStore.set(selected_years);
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

    // Append the axes to the SVG
    $: {
        if (svg) {
            d3.select(svg)
                .select(".x-axis")
                .call(xAxis)
                .selectAll("text")
                .style("font-family", "Montserrat")
                .style("font-weight", 500)
                .style("font-size", 12);

            d3.select(svg)
                .select(".y-axis")
                .call(yAxis)
                .selectAll("text")
                .style("font-family", "Montserrat")
                .style("font-weight", 500)
                .style("font-size", 12);
        }
    }
</script>

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
                fill="black"
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
                y1={margin.top}
                x2={selectedLineStart}
                y2={height - margin.bottom}
                stroke="red"
                stroke-width="1"
            />
            <text
                x={selectedLineStart}
                y={margin.top - 5}
                text-anchor="middle"
                font-size="13px"
                font-weight="550"
                fill="red"
            >
                {selectedYearStart}
            </text>

            <!-- End line -->
            <line
                x1={selectedLineEnd}
                y1={margin.top}
                x2={selectedLineEnd}
                y2={height - margin.bottom}
                stroke="red"
                stroke-width="1"
            />

            <!-- Only show the end label if more than one year is selected -->
            {#if selectedYearStart !== selectedYearEnd}
                <text
                    x={selectedLineEnd}
                    y={margin.top - 5}
                    text-anchor="middle"
                    font-size="13px"
                    font-weight="550"
                    fill="red"
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
        width: 85%;
        height: 160px;
        background: rgba(0, 0, 0, 0.034);
    }

    :global(.brush .selection) {
        stroke: none;
    }
</style>
