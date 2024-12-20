<script>
    import * as d3 from "d3";
    import {
        selectedYearsStore,
        selectedCareerStore,
        selectedGenderStore,
    } from "../years";

    export let node_link;
    export let career_width;
    export let career_height;

    const padding = { top: 10, right: 10, bottom: 10, left: 10 };

    $: width = career_width - 10;
    $: height = career_height - 10;
    $: links = node_link.links;
    $: nodes = node_link.nodes;

    // Set initial transform for zoom
    let transform = d3.zoomIdentity;
    let svgElement;

    // Create the simulation
    $: simulation = d3
        .forceSimulation(nodes)
        .force(
            "link",
            d3.forceLink(links).id((d) => d.id),
        )
        .force("charge", d3.forceManyBody())
        .force("x", d3.forceX(width / 2).strength(0.03))
        .force("y", d3.forceY(height / 2).strength(0.03))
        .force(
            "collision",
            d3.forceCollide().radius((d) => d.connectionCount),
        )
        .stop();

    // Run simulation to stabilize
    $: {
        for (let i = 0, n = 150; i < n; ++i) {
            simulation.tick();
        }
    }

    // Function to color nodes based on group
    function diff_group(data) {
        return data.group === "person" ? "#333333" : "#F27721";
    }

    // Separate career and person nodes
    $: career_nodes = nodes.filter((d) => d.group == "career");
    $: person_nodes = nodes.filter((d) => d.group == "person");
    $: radiusScale = d3.scaleLinear().domain([1, 100]).range([4, 50]);

    // Zoom handler
    function zoomed(event) {
        transform = event.transform; // Update transform on zoom
    }

    // Apply zoom to SVG when svgElement is available
    $: if (svgElement) {
        d3.select(svgElement).call(
            d3.zoom().scaleExtent([0.5, 5]).on("zoom", zoomed),
        );
    }

    function career_click(career) {
        selectedCareerStore.set(career.id);
    }
</script>

<!-- SVG element with zoom and pan capabilities -->
<svg {width} {height} bind:this={svgElement}>
    <!-- Links between nodes -->
    {#each links as link}
        <line
            stroke="#999"
            stroke-opacity="0.5"
            x1={link.source.x}
            y1={link.source.y}
            x2={link.target.x}
            y2={link.target.y}
            transform="translate({transform.x}, {transform.y}) scale({transform.k})"
        >
            <title>{link.source.id}</title>
        </line>
    {/each}

    <!-- Career nodes -->
    {#each career_nodes as point}
        <circle
            class="career-node"
            r={radiusScale(point.connectionCount)}
            fill={diff_group(point)}
            cx={point.x}
            cy={point.y}
            transform="translate({transform.x}, {transform.y}) scale({transform.k})"
            on:click={career_click(point)}
        >
            <title>{point.id}</title>
        </circle>
    {/each}

    <!-- Career node text -->
    {#each career_nodes as point}
        <text
            x={point.x}
            y={point.y - 5}
            text-anchor="middle"
            fill="black"
            stroke="white"
            paint-order="stroke"
            font-weight="700"
            transform="translate({transform.x}, {transform.y}) scale({transform.k})"
            >{point.id}
        </text>
    {/each}

    <!-- Person nodes -->
    {#each person_nodes as point}
        <circle
            class="person-node"
            r="3"
            fill={diff_group(point)}
            cx={point.x}
            cy={point.y}
            transform="translate({transform.x}, {transform.y}) scale({transform.k})"
        >
            <title>{point.id}</title>
        </circle>
    {/each}
</svg>

<style>
    .career-node,
    .person-node {
        cursor: pointer;
        transition: fill 0.3s ease;
    }
    .career-node:hover,
    .person-node:hover {
        fill: #ffcc00;
    }
</style>
