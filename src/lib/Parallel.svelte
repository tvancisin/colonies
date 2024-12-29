<script>
    import * as d3 from "d3";

    export let parallel_data;
    export let career_width;
    export let career_height;

    let gy_college;
    let gy_degree;
    let gy_career;

    let margin = { top: 10, right: 10, bottom: 10, left: 10 };
    $: width = career_width - 10;
    $: height = career_height - 10;
    let dimensions = ["college", "degree", "career"];
    let colleges = [
        "United College",
        "U.C.D.",
        "St Mary’s College",
        "St Salvator’s College",
        "St Leonard’s College",
        "unknown",
    ];
    let degrees = [
        "M.D.",
        "M.A.",
        "LL.D.",
        "B.A.",
        "B.D.",
        "D.D.",
        "B.Sc.",
        "D.Sc.",
        "M.B. Ch.B.",
        "D.Mus.",
        "LLA",
        "M.B. C.M.",
        "unknown",
    ];
    let careers = [
        "trade",
        "sport",
        "religion",
        "print",
        "politics",
        "noble",
        "military",
        "medicine",
        "art",
        "education",
        "engineering",
        "farming",
        "forestry",
        "government",
        "justice",
        "land",
        "local_government",
        "unclear",
        "unknown",
    ];

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

    $: d3.select(gy_college)
        .call(d3.axisRight(y["college"]))
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

    $: line = function path(d) {
        return d3.line()(
            dimensions.map(function (p) {
                return [x_scale(p), y[p](d[p])];
            }),
        );
    };
</script>

<svg {width} {height}>
    {#if parallel_data}
        {#each parallel_data as data}
            <path fill="none" stroke="#69b3a2" opacity="0.1" d={line(data)} />
        {/each}
    {/if}
    <g bind:this={gy_college} transform="translate({x_scale('college')},0)" />
    <g bind:this={gy_degree} transform="translate({x_scale('degree')},0)" />
    <g bind:this={gy_career} transform="translate({x_scale('career')},0)" />
</svg>
