<script>
    import { createEventDispatcher } from "svelte";
    import * as d3 from "d3";

    const dispatch = createEventDispatcher();

    let medicine = [
        "Surgeon",
        "Physician",
        "surgeon",
        "Surgeon’s mate",

        "Professor of natural philosophy",
        "Professor of Moral Philosophy",

        "Doctor",
        "Assistant surgeon",
        "Medical student",
        "Medical Officer",

        "Nurse",
        "Civil surgeon",
        "Assistant Surgeon",
        "Surgoen",
        "Surgeon apothecary",

        "Secession minister",
        "Examiner of medical stores",
        "army surgeon",
        "Medical missionary",

        "doctor",
        "Head surgeon",
        "Hospital Mate",
        "Second surgeon",
        "chief physician",

        "Surgeon to Governor",
        "Surgeon’s Mate",
        "Congregational minister and physician",

        "Surgeon General",
        "Medical assistant",
        "Colonial surgeon",
        "physician superintendent",

        "Physician General",
        "Principal surgeon",
        "Hospital mate",
        "House surgeon",

        "Pathologist and curator",
        "Medical superintendent",
        "Senior Assistant Surgeon",

        "Principal Surgeon",
        "Apothecary",
        "medical student",
    ];

    let religion = [
        "Evangelist",
        "representative of ‘waalsche’ churches",

        "Minister",
        "clergyman",
        "Precentor",
        "Bishop",
        "minister",
        "presbytery",

        "Preached",
        "bishop",
        "Archdeacon",
        "Episcopal minister",
        "Missionary",
        "Vicar",

        "Curate",
        "preacher",
        "Church of Scotland chaplain",
        "Chaplain",
        "U.F. minister",

        "missionary",
        "United Presbyterian Minister",
        "Free Church minister",

        "Relief and United Presbyterian minister",
        "Chaplain to Forces",

        "Military chaplain and minister",
        "Church of Scotland minister",
        "Ordained",

        "Free Church and U.F. missionary",
        "U.P. and U.F. minister",
        "Unitarian minister",

        "Congregational minister",
        "Presbyterian minister",
        "catechist",
        "Baptist minister",

        "United Presbyterian minister",
        "London Missionary Society missionary",

        "Free Church missionary",
        "Secession minister",
        "Assistant minister",
        "Perpetual curate",

        "priest",
        "Preacher",
        "Session clerk",
        "Head of Scots Mission",
        "Pastor",
        "Priest",

        "Priest in charge",
        "Burgher minister",
        "chaplain",

        "Free Church and United Free Church missionary",
        "U.F. minister",
        "Catechist",

        "Reader and preacher",
        "Assistant chaplain",
        "Episcopal clergyman",
        "U.P. minister",

        "Congregational missionary",
        "Principal Medical Officer",
        "divinity student",

        "United Presbyterian and U.F. minister",
        "Theological student",
        "Antiburgher minister",

        "Church Missionary Society",
        "Baptist missionary",
        "Army chaplain",

        "United Associate and United Presbyterian minister",
    ];

    let education = [
        "Schoolmaster and clerk",
        "Rector",
        "schoolmaster",

        "teacher of Latin and Greek",
        "Professor of divinity",
        "Principal",
        "Schoolmaster",

        "Professor of Hebrew",
        "Professor of Mathematics",
        "Tutor",
        "Professor",

        "Inspector of Schools",
        "Professor of Oriental Languages",
        "Master",

        "Assistant in Humanity",
        "Professor of Chemistry",
        "Professor of Obstetric Medicine",

        "MacDonald Professor of Chemistry",
        "Founder and first principal",
        "Provost",

        "Lecturer in Natural History",
        "Professor of Natural History",

        "Professor of Comparative Anatomy and Zoology",
        "Professor of Biology",

        "Professor of Engineering",
        "Vice-principal",
        "Vice - Principal",
        "school teacher",

        "tutor",
        "Professor of English",
        "Rector of the University",
        "teacher of music",

        "Professor of Humanity",
        "Professor of Sacred Literature",
        "Professor of Modern History",

        "Professor of Sanskrit",
        "Professor of Anatomy",
        "Tutor in mathematics",

        "Mathematics master",
        "Assistant in Greek",
        "Professor of Classics",
        "Vice Chancellor",

        "Professor of Natural History and Chemistry",
        "Classical master",
        "Private tutor",

        "classics master",
        "Professor of New Testament Studies",
        "Science and mathematics master",

        "Mathematics teacher",
        "Professor of Civil History",
        "Teacher",
        "Assistant master",

        "Lecturer",
        "Commissioner of Schools",
        "Senior assistant in zoology",

        "Naturalist at Marine laboratory",
        "Professor of zoology",
        "Demonstrator in Chemistry",

        "Science master",
        "Tutor in gynaecology",
        "Professor of Obstetrics",

        "Professor of Midwifery",
        "Professor of Physiology and Pathology",
        "Chancellor",

        "Lecturer in Logic",
        "Professor of Mental and Moral Philosophy",

        "Professor of Sacred Languages",
        "Professor of English Language and Literature",

        "Classics master",
        "Professor of Forestry",
        "Marine biologist",
        "Professor of Zoology",

        "Professor of Church History and History of Dogma",
        "Venture schoolmaster",

        "Superintending chemist",
        "Tutor and guardian",
        "Lecturer in Political Economy",

        "Assistant to Professor Fischer",
        "Chief Inspector of Schools",
        "Senior language mistress",

        "Classical mistress",
        "Modern languages tutor",
        "Assistant French mistress",
        "Fellow",

        "Professor of English Literature",
        "Professor of Comparative Literature",
        "Professor of Arabic",

        "Professor of Belles Lettres",
        "Professor of Biblical Criticism",
        "Assistant in humanity",

        "Taylorian lecturer in Scandinavian languages",
        "Professor of Anglo-Saxon",

        "Lecturer in Anatomy",
        "Professor of Physiology",
        "Lecturer in materia medica",

        "university lecturer",
        "Professor of Physics",
        "Professor of Clinical Surgery",

        "Headmaster",
        "Assistant lecturer",
        "Master of Method",
        "Head teacher",

        "First professor of philosophy and English literature",
        "Assistant to Professor of Hebrew",

        "English master",
        "Assistant classical master",
        "Professor of systematic Theology",

        "teacher of languages",
        "Professor of English and Philosophy",
        "Vice principal",

        "School Superintendent",
        "Head master",
        "Assistant to Professor of Humanity",

        "Professor of Greek, Latin and English",
    ];

    let noble = ["Earl", "Baron", "Marquess", "baronet", "Duke", "duke", "Bt."];

    let trade = [
        "Senior merchant",
        "Factor",
        "Clerk",
        "Chairman",
        "merchant",

        "general merchant, importer and shipping agent",
        "coffee planter",
        "business man",

        "Sugar planter",
        "planter",
        "Town clerk",
        "Senior clerk",

        "Officiating import warehouse keeper and naval stock keeper",
        "manager",

        "indigo planter",
        "dry goods business",
        "free merchant",
        "Banker",
        "Free merchant",

        "burgher",
        "Teller",
        "Bookkeeper",
    ];

    let land = ["Landowner", "Laird"];

    let military = [
        "officer of militia",
        "Captain in the army",
        "Captain",
        "cadet",

        "Cadet",
        "Ensign",
        "Garrison Mate",
        "Deputy Adjutant General",
        "Soldier",
    ];

    let government = [
        "Chamberlain",
        "HM Comptroller",
        "Governor",
        "Ambassador",
        "Regent",

        "Director of Public Instruction",
        "Governor General",

        "Superintendent of the government botanic garden",
        "Parliamentary Librarian",

        "District commissioner",
        "British Consular Service",
        "Minister of Education",

        "Superintendent General of Education",
        "Governor and Commander in Chief",

        "Chief Secretary to the Government",
        "Deputy Inspector General",
        "Inspector General",

        "Commissioner of Court of Requests",
        "Commissioner of Fisheries",
        "Civil servant",

        "Privy Councillor and Chancellor",
        "civil servant and magistrate",
        "Lieutenant governor",

        "Secretary of State",
        "Deputy master of the Mint",
        "Attaché",
        "Chargé d’affaires",

        "Envoy extraordinary and minister plenipotentiary",

        "Clerk of the Executive and Legislative Councils",
        "Member of legislative council",

        "U.S. ambassador",
        "Colonial treasurer and Naval officer",

        "Chief engineer and Secretary to Government",
        "Official member of Council",

        "Assistant Commissioner and Settlement Officer",
        "Collector of Customs",

        "Commissioner of customs, salt and opium",
        "Sheriff",
        "Senator",
        "Inspector",

        "Member of Council",
        "Deputy Inspector",
        "Divisional Revenue Commissioner",

        "Paymaster General",
        "Chief secretary ",
        "Lord Lieutenant",
        "Commissioner for Crown lands",

        "Scientific Advisor",
        "Lieutenant Governor",
    ];

    let local_government = [
        "Burgess",
        "Town Councillor",
        "Mayor",
        "City Superintendent",

        "City Superintendent",
        "Councillor and Mayor",
    ];

    let politics = [
        "Member of Parliament",
        "Tory M.P.",
        "M.P.",
        "Member of the House of Assembly",

        "Member of local legislature",
        " Liberal leader",
    ];

    let justice = [
        "magistrate",
        "Chief Justice",
        "Associate Justice Supreme Court",

        "Civil and Sessions judge",
        "City coroner",
        "Chief justice",
        "lawyer",
        "Assistant judge",

        "Barrister",
        "Attorney General",
        "Judge",
        "Advocate General",
        "Advocate",
        "Law agent",
        "Writer",

        "writer",
    ];

    let art = ["author", "Curator"];

    let printed = [
        "journalist",
        "Editor",
        "Assistant editor",
        "Assistant librarian",
        "Colporteur",
    ];

    let engineer = [
        "civil engineer",
        "chief engineer",
        "Superintending engineer",
        "Engineer",

        "consulting engineer",
    ];

    let farm = [
        "sheep farmer",
        "practitioner and farmer",
        "farm labourer",
        "sheep breeder",

        "Farmer",
        "Estanciero",
    ];

    let forestry = [
        "Conservator of Forests",
        "Delegate for instruction in Forestry",
    ];

    let sport = ["Amateur golf champion"];

    let unknown = [
        "Assistant",
        "Retired",
        "Member",
        "Moderator",
        "Private assistant",

        "Director",
        "member of the St Andrews Society",
        "Casualty Clearing Station",
        "Apprentice",

        "pioneer",
        "Staff",
        "assistant",
        "Chief",
        "director",
        "Warden",
        "President ",
        "Secretary",

        "President",
        "Superintendent",
        "Incumbent",
        "Usher",
    ];

    export let births_per_colony;
    export let selectedProperties;

    $: filteredCountry = births_per_colony.filter(
        (item) => item[0] == selectedProperties,
    );

    let gender, all, male, female;

    $: if (filteredCountry) {
        all = filteredCountry[0][1].length;
        gender = d3.groups(filteredCountry[0][1], (d) => d.gender);
        male = gender.find((item) => item[0] === "M")[1];
        female = gender.find((item) => item[0] === "F")[1];
    }

    $: console.log(male, female);

    let details_width;
    let details_height;

    function closeDetails() {
        dispatch("close");
    }
</script>

<div
    id="details"
    bind:clientWidth={details_width}
    bind:clientHeight={details_height}
>
    <div id="peace_title_div">
        <button class="btn close" on:click={closeDetails}
            ><i class="fa fa-close"></i></button
        >
        {#if selectedProperties}
            <h3>{selectedProperties}</h3>
        {/if}
    </div>
    <div id="peace_content">
        <div id="overview">
            <h5>Overview</h5>
            <div class="content-wrapper">
                <div class="content-box">
                    <h6>All</h6>
                    <div class="row">{all}</div>
                </div>
                <div class="content-box">
                    <h6>Female</h6>
                    <div class="row">{female.length}</div>
                </div>
                <div class="content-box">
                    <h6>Male</h6>
                    <div class="row">{male.length}</div>
                </div>
            </div>
        </div>

        <div id="general">
            <h5>Careers</h5>
        </div>
        <div id="peace_process">
            <h5>List</h5>
            <div class="scrollable-content"></div>
        </div>
    </div>
</div>

<style>
    #details {
        color: black;
        position: fixed;
        border-radius: 2px;
        right: -100%;
        width: 500px;
        height: calc(100%);
        transition: right 0.3s ease;
        background-color: rgba(80, 80, 80, 0.932);
        overflow: hidden;
        z-index: 5;
        font-family: "Montserrat", sans-serif;
        font-optical-sizing: auto;
        font-weight: 300;
        font-style: normal;
        display: flex;
        flex-direction: column;
        z-index: 11;
    }

    @media (max-width: 1450px) {
        #details {
            width: 450px;
        }
    }

    @media (max-width: 1200px) {
        #details {
            width: 400px;
        }
    }

    @media (max-width: 768px) {
        #details {
            width: 100%;
        }
    }

    #peace_title_div {
        text-align: center;
        position: relative;
        margin: 1px;
    }

    .btn.close {
        position: absolute;
        right: 4px;
        background: none;
        color: white;
        border: none;
        padding: 2px 10px;
        border-radius: 2px;
        font-size: 22px;
        cursor: pointer;
        font-family: "Montserrat";
        transition: border 0.3s ease;
    }

    @media only screen and (max-width: 1450px) {
        .btn.close {
            font-size: 1.1em;
        }
    }

    @media only screen and (max-width: 1024px) {
        .btn.close {
            font-size: 1em;
        }
    }

    h3 {
        color: rgb(0, 0, 0);
        margin: auto;
        font-size: 1.3redem;
        padding: 5px;
        font-weight: 450;
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

    .btn.close {
        position: absolute;
        right: 4px;
        background: none;
        color: black;
        border: none;
        padding: 2px 10px;
        border-radius: 2px;
        font-size: 1.5em;
        cursor: pointer;
        font-family: "Montserrat";
        transition: border 0.3s ease;
    }

    .btn.close:hover {
        color: red;
    }

    @media only screen and (max-width: 1450px) {
        .btn.close {
            font-size: 1.3em;
        }
    }

    @media only screen and (max-width: 1024px) {
        .btn.close {
            font-size: 1.2em;
        }
    }

    #peace_content {
        height: 100%; /* Ensure that #peace_content takes full available height */
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;
        overflow-y: auto;
        font-size: 0.8em;
        margin-top: 0px;
        margin-right: 5px;
        margin-left: 5px;
        margin-bottom: 5px;
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
    #peace_process {
        flex-basis: 0;
        width: 100%;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        line-height: 1.5;
    }

    #overview {
        flex-basis: 0;
        width: 100%;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
    }

    #general,
    #peace_process,
    #overview {
        background: white;
        border-radius: 3px;
    }

    #overview h5,
    #general h5,
    #peace_process h5 {
        background-color: #d9d9d9;
        z-index: 2;
        box-shadow: 0 2px 3px rgba(117, 117, 117, 0.8);
    }

    #overview,
    #general,
    #peace_process {
        flex-shrink: 0; /* Prevent shrinking of these elements */
    }

    #overview {
        flex-grow: 1; /* Takes one unit of the available space */
    }

    #general,
    #peace_process {
        flex-grow: 3; /* Takes three units of the available space each */
    }

    h5 {
        position: sticky;
        top: 0;
        z-index: 1;
        margin: 0;
        padding: 5px 15px;
        color: black;
        font-size: 1em;
        font-weight: 450;
    }

    @media only screen and (max-width: 768px) {
        h5 {
            font-size: 0.9em;
            padding: 3px 10px;
        }
    }

    h6 {
        position: sticky;
        text-align: center;
        top: 0;
        z-index: 1;
        margin: 0;
        padding: 2px 15px;
        color: black;
        font-size: 0.9em;
        font-weight: 450;
    }

    @media only screen and (max-width: 768px) {
        h6 {
            font-size: 0.8em;
            padding: 2px 10px;
        }
    }

    .content-wrapper {
        flex-grow: 1;
        display: flex;
        gap: 5px;
        padding: 5px;
        overflow-y: auto;
        flex-direction: row;
        align-items: stretch;
    }

    .content-box {
        flex-basis: 50%;
        background: white;
        color: black;
        padding: 2px;
        /* box-shadow: 0 2px 4px rgba(0, 0, 0, 0.8); */
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
        /* overflow: hidden; Prevent overflow from disrupting layout */
        overflow: visible;
    }

    .row {
        display: flex;
        flex-grow: 1;
        justify-content: center; /* Horizontally center the content */
        align-items: center; /* Vertically center the content */
        font-weight: 450;
    }

    .scrollable-content {
        flex-grow: 1;
        overflow-y: auto;
        padding: 2px 15px;
        background: none;
        box-sizing: border-box;
    }

    #peace_title_div {
        text-align: center;
        position: relative;
        margin: 2px;
    }

    :global(a) {
        color: rgb(110, 122, 177);
        cursor: pointer;
    }

    :global(ul) {
        padding-left: 20px;
        padding-right: 10px;
        margin: 0px;
        font-weight: 400;
    }
</style>
