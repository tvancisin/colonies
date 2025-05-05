<script>
    import { scrollToSection } from "../utils";
    let sections = [
        { id: "home", name: "Home" },
        { id: "people", name: "About" },
        { id: "provenance", name: "Provenance" },
        { id: "vis", name: "Visualization" },
    ];

    let showScrollToTop = false; // Visibility of the scroll-to-top button
    let isMenuOpen = false; // Toggle menu visibility
</script>

<div id="home">
    <!-- Navigation Menu -->
    <div id="navigation">
        <i
            class="fa fa-bars"
            aria-hidden="true"
            on:click={() => (isMenuOpen = !isMenuOpen)}
        ></i>

        {#if isMenuOpen}
            <ul class="dropdown">
                {#each sections as section}
                    <li on:click={() => scrollToSection(section.id)}>
                        {section.name}
                    </li>
                {/each}
            </ul>
        {/if}
    </div>
    <img id="uni_logo" src="uni_white.png" alt="St Andrews University Logo" />
    <h1>University of St Andrews in the Colonies</h1>
    <h3>
        Exploring connections between St Andrews students and
        the British Empire.
    </h3>
</div>

<style>
    #home {
        position: relative;
        width: 100%;
        align-content: center;
        text-align: center;
        background-color: #18181B;
        padding-bottom: 40px;
    }
    h1 {
        color: white;
        margin-bottom: 5px;
        font-family: "Montserrat", sans-serif;
        font-optical-sizing: auto;
        font-weight: 800;
        font-style: normal;
    }
    h3 {
        color: white;
        font-weight: 500;
    }
    #navigation {
        position: absolute;
        top: 10px;
        left: 20px;
        z-index: 10;
    }
    #navigation .fa-bars {
        font-size: 30px;
        color: white;
        cursor: pointer;
    }
    .dropdown {
        position: absolute;
        top: 30px;
        left: 0;
        text-align: left;
        background-color: #252529;
        border-radius: 1px;
        list-style: none;
        padding: 0;
        margin: 0;
        z-index: 10;
    }
    .dropdown li {
        all: unset;
        font-weight: 300;
        padding: 10px 20px;
        color: white;
        cursor: pointer;
        display: block;
        text-align: left;
        font-weight: 500;
    }
    .dropdown li:hover {
        background-color: #1c4265;
    }

    #uni_logo {
        padding-top: 70px;
        height: 80px;
    }
</style>
