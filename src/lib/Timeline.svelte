<script>
    import * as d3 from "d3";
    import { selectedYearsStore } from "../years";

    export let birth_data;
    export let selectedProperties;
    export let births_per_colony;

    let data;
    let selected_years;
    let width = 800; // Set initial width
    let height = 200; // Set initial height
    let containerWidth = 800; // To track the width of the container
    let margin = { top: 20, right: 30, bottom: 30, left: 40 };
    let svg;
    let ticks = [1700, 1725, 1750, 1775, 1800, 1825, 1850, 1875, 1900]; // Custom ticks

    // Reactive block to update width when selectedProperties changes
    $: {
        if (selectedProperties) {
            width = containerWidth - 450; // Reduce the width by 450px when selectedProperties is not null
            let selected_colony = births_per_colony.filter(
                (group) => group[0] == selectedProperties,
            );
            data = selected_colony[0][1];
        } else {
            width = containerWidth; // Full width when selectedProperties is null
            data = birth_data;
        }
    }

    // Prepare the data
    let allYears = Array.from({ length: 1900 - 1700 + 1 }, (_, i) => 1700 + i);
    $: grouped = d3
        .groups(data, (d) => {
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
        // .filter((group) => group[0] !== undefined) // Remove cases where 'from' is undefined
        .sort((a, b) => d3.ascending(a[0], b[0])); // Sort by 'from' year

    $: groupedDataMap = new Map(grouped.map((d) => [d[0], d[1].length]));
    $: completeGrouped = allYears.map((year) => [
        year,
        groupedDataMap.get(year) || 0,
    ]); // Default value is 0 if year is not found

    // Create the X scale for the years (horizontal axis)
    $: xScale = d3
        .scaleBand()
        .domain(allYears) // Use all years
        .range([margin.left, width - margin.right])
        .padding(0.2);

    // Create the Y scale for the counts (vertical axis)
    $: yScale = d3
        .scaleLinear()
        .domain([0, 15]) // The max number of elements
        .nice() // Adds some padding to the top of the Y axis
        .range([height - margin.bottom, margin.top]);

    // Create the brush
    $: brush = d3
        .brushX()
        .extent([
            [margin.left, margin.top],
            [width - margin.right, height - margin.bottom],
        ]) // Extending the full width and height
        .on("end", brushed);

    function brushed(event) {
        if (event.selection) {
            // Brush is active, capture the selected years
            let [x0, x1] = event.selection;
            let all_selected_years = allYears.filter((year) => {
                let x = xScale(year);
                return x >= x0 && x <= x1;
            });
            selected_years = [
                all_selected_years[0],
                all_selected_years[all_selected_years.length - 1],
            ];
            selectedYearsStore.set(selected_years);
        } else {
            // Brush selection cleared, reset the store or handle unselecting
            selectedYearsStore.set([]); // or [] if you prefer an empty array
        }
    }

    $: {
        // Update brush component
        if (svg) {
            d3.select(svg).select(".brush").call(brush);
        }
    }

    // Create X axis with custom ticks
    $: xAxis = d3.axisBottom(xScale).tickValues(ticks); // Use the custom ticks
    $: yAxis = d3.axisLeft(yScale);

    // Append the axes to the SVG
    $: {
        if (svg) {
            d3.select(svg)
                .select(".x-axis")
                .call(xAxis)
                .selectAll("text")
                .style("font-family", "Montserrat")
                .style("font-weight", 500)
                .style("font-size", 12)

            d3.select(svg)
                .select(".y-axis")
                .call(yAxis)
                .selectAll("text")
                .style("font-family", "Montserrat")
                .style("font-weight", 500)
                .style("font-size", 12)
        }
    }
</script>

<div id="timeline" bind:clientWidth={containerWidth} bind:clientHeight={height}>
    <svg {width} {height} bind:this={svg}>
        <!-- Bars -->
        {#each completeGrouped as d}
            <rect
                x={xScale(d[0])}
                y={yScale(d[1])}
                width={xScale.bandwidth()}
                height={yScale(0) - yScale(d[1])}
                fill="black"
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
    </svg>
</div>

<style>
    #timeline {
        position: absolute;
        bottom: 0px;
        width: 100%;
        height: 200px;
        background: rgba(0, 0, 0, 0.034);
    }

</style>
