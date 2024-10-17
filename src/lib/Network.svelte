<script>
    import * as d3 from "d3";

    export let node_link;
    export let career_width;
    export let career_height;

    const padding = { top: 20, right: 40, bottom: 40, left: 25 };

    $: width = career_width - 10;
    $: height = career_height - 10;
    $: links = node_link.links;
    $: nodes = node_link.nodes;

    let transform = d3.zoomIdentity;

    $: simulation = d3
        .forceSimulation(nodes)
        .force(
            "link",
            d3.forceLink(links).id((d) => d.id),
        )
        .force("charge", d3.forceManyBody())
        .force("x", d3.forceX(width / 2).strength(0.05))
        .force("y", d3.forceY(height / 2).strength((0.05 * width) / height))
        .force(
            "collision",
            d3.forceCollide().radius(function (d) {
                return d.connectionCount;
            }),
        )
        .stop();

    $: {
        for (let i = 0, n = 120; i < n; ++i) {
            simulation.tick();
        }
    }

    function diff_group(data) {
        if (data.group == "person") {
            return "orange";
        } else {
            return "#333333";
        }
    }

    $: career_nodes = nodes.filter((d) => d.group == "career");
    $: person_nodes = nodes.filter((d) => d.group == "person");
    $: radiusScale = d3.scaleLinear().domain([1, 50]).range([4, 30]);
</script>

<svg {width} {height}>
    {#each links as link}
        <g stroke="#999" stroke-opacity="0.6">
            <line
                x1={link.source.x}
                y1={link.source.y}
                x2={link.target.x}
                y2={link.target.y}
                transform="translate({transform.x} {transform.y}) scale({transform.k} {transform.k})"
            >
                <title>{link.source.id}</title>
            </line>
        </g>
    {/each}

    {#each career_nodes as point, i}
        <circle
            class="career-node"
            r={radiusScale(point.connectionCount)}
            fill={diff_group(point)}
            cx={point.x}
            cy={point.y}
            transform="translate({transform.x} {transform.y}) scale({transform.k} {transform.k})"
        >
            <title>{point.id}</title>
        </circle>
    {/each}

    {#each person_nodes as point, i}
        <circle
            class="person-node"
            r="3"
            fill={diff_group(point)}
            cx={point.x}
            cy={point.y}
            transform="translate({transform.x} {transform.y}) scale({transform.k} {transform.k})"
        >
            <title>{point.id}</title>
        </circle>
    {/each}
</svg>

<style>
    .women {
        stroke: black;
    }
</style>
