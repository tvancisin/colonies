import * as d3 from "d3";

// Scroll to a specific section
export const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: "smooth" });
    }
};

export function constructParallelData(data) {
    const transformedData = data.map(item => {
        const college = item.study?.colleges?.[0]?.name || "unknown";
        const degree = item.study?.degrees?.[0]?.name || "unknown";
        const id = item.id;

        // Handle career extraction
        let career = "unknown";
        if (item.floruit?.[0]?.occupation) {
            const occupation = item.floruit[0].occupation;
            if (Array.isArray(occupation)) {
                career = occupation[0] || "unknown";
            } else {
                career = occupation || "unknown";
            }
        }

        career = career.toLowerCase();

        // Assign to the appropriate group
        if (occupations.medicine.includes(career)) {
            career = "medicine"
        } else if (occupations.religion.includes(career)) {
            career = "religion"
        } else if (occupations.education.includes(career)) {
            career = "education"
        } else if (occupations.noble.includes(career)) {
            career = "noble"
        } else if (occupations.trade.includes(career)) {
            career = "trade"
        } else if (occupations.land.includes(career)) {
            career = "land"
        } else if (occupations.military.includes(career)) {
            career = "military"
        } else if (occupations.government.includes(career)) {
            career = "government"
        } else if (occupations.local_government.includes(career)) {
            career = "local_government"
        } else if (occupations.politics.includes(career)) {
            career = "politics"
        } else if (occupations.justice.includes(career)) {
            career = "justice"
        } else if (occupations.art.includes(career)) {
            career = "art"
        } else if (occupations.printed.includes(career)) {
            career = "print"
        } else if (occupations.engineer.includes(career)) {
            career = "engineering"
        } else if (occupations.farm.includes(career)) {
            career = "farming"
        } else if (occupations.forestry.includes(career)) {
            career = "forestry"
        } else if (occupations.sport.includes(career)) {
            career = "sport"
        } else if (occupations.unknown.includes(career)) {
            career = "unclear"
        }

        return {
            college,
            degree,
            career
        };
    });
    return transformedData
}

//LOADING DATA FUNCTIONS
export async function getJson(path) {
    let loadedData = await d3.json(path);
    return loadedData;
}

export async function getIndividualJSON(path) {
    let loadedData = await d3.json(path);
    return loadedData;
}

export async function getJSON(paths) {
    const promises = paths.map(path => getIndividualJSON(path));
    const results = await Promise.all(promises);
    return results;
    // let loadedData = await d3.csv(path);
    // return loadedData
}

export async function getIndividualGeo(url) {
    let response = await fetch((import.meta.env.BASE_URL || "") + url);
    let json = await response.json();
    return json;
}

export async function getGeo(paths) {
    const promises = paths.map(path => getIndividualGeo(path));
    const results = await Promise.all(promises);
    return results;
}

//MAP FUNCTIONS
export function year_filter(data, startYear, endYear) {
    return data.filter((item) => {
        // Check if 'study' exists and is not null
        if (!item.study) return false;

        // Extract years from 'study.colleges.from'
        const collegesYears = (item.study.colleges || [])
            .map((college) => parseInt(college.from, 10))
            .filter(
                (year) =>
                    !isNaN(year) && year >= startYear && year <= endYear,
            );

        // Extract years from 'study.degrees.date', handling null dates
        const degreesYears = (item.study.degrees || [])
            .map((degree) => {
                if (!degree.date) return null; // Handle null or undefined date
                const match = degree.date.match(/^(\d{4})/);
                return match ? parseInt(match[1], 10) : null;
            })
            .filter(
                (year) =>
                    !isNaN(year) && year >= startYear && year <= endYear,
            );

        // Include item if any valid year is within the range
        return collegesYears.length > 0 || degreesYears.length > 0;
    });
}

// Width scale
const widthScale = d3.scaleLinear().domain([0, 350]).range([0, 15]);

export function width_generator(data) {
    if (data.length == 0) {
        return [
            ['Africa', 0],
            ['India', 0],
            ['America', 0],
            ['Australia', 0],
            ['Caribbean', 0],
            ['Asia', 0]
        ]
    }
    else {
        let filter_undefined = data.filter((d) => d[0] !== undefined);
        let regionsWithWidth = filter_undefined.map((region) => {
            let regionName = region[0]; // Get the region name
            let count = region[1].length; // Get the length of the array (e.g., 58)
            let opacity = widthScale(count); // Use the scale to calculate opacity
            return [regionName, opacity]; // Return the region name and calculated opacity
        });
        return regionsWithWidth;
    }
}


// Function to build dynamic opacity expression
export function getWidthExpression(regions) {
    let expression = ["match", ["get", "ADMIN"]]; // Using 'ADMIN' as the property to check
    regions.forEach(([region, opacity]) => {
        expression.push(region, opacity);
    });
    expression.push(0);
    return expression;
}



export const occupations = {
    medicine: [
        "surgeon",
        "physician",
        "surgeon",
        "surgeon’s mate",

        "professor of natural philosophy",
        "professor of moral philosophy",

        "doctor",
        "assistant surgeon",
        "medical student",
        "medical officer",

        "nurse",
        "civil surgeon",
        "assistant surgeon",
        "surgoen",
        "surgeon apothecary",

        "secession minister",
        "examiner of medical stores",
        "army surgeon",
        "medical missionary",

        "doctor",
        "head surgeon",
        "hospital mate",
        "second surgeon",
        "chief physician",

        "surgeon to governor",
        "surgeon’s mate",
        "congregational minister and physician",

        "surgeon general",
        "medical assistant",
        "colonial surgeon",
        "physician superintendent",

        "physician general",
        "principal surgeon",
        "hospital mate",
        "house surgeon",

        "pathologist and curator",
        "medical superintendent",
        "senior assistant surgeon",
        "assistant indian medical service",

        "principal surgeon",
        "apothecary",
        "medical student",
        "medical service",
        "hospital apprentice"
    ],

    religion: [
        "evangelist",
        "representative of ‘waalsche’ churches",

        "minister",
        "clergyman",
        "precentor",
        "bishop",
        "minister",
        "presbytery",

        "preached",
        "bishop",
        "archdeacon",
        "episcopal minister",
        "missionary",
        "vicar",

        "curate",
        "preacher",
        "church of scotland chaplain",
        "chaplain",
        "u.f. minister",

        "missionary",
        "united presbyterian minister",
        "free church minister",

        "relief and united presbyterian minister",
        "chaplain to forces",

        "military chaplain and minister",
        "church of scotland minister",
        "ordained",

        "free church and u.f. missionary",
        "u.p. and u.f. minister",
        "unitarian minister",

        "congregational minister",
        "presbyterian minister",
        "catechist",
        "baptist minister",

        "united presbyterian minister",
        "london missionary society missionary",

        "free church missionary",
        "secession minister",
        "assistant minister",
        "perpetual curate",

        "priest",
        "preacher",
        "session clerk",
        "head of scots mission",
        "pastor",
        "priest",

        "priest in charge",
        "burgher minister",
        "chaplain",

        "free church and united free church missionary",
        "u.f. minister",
        "catechist",

        "reader and preacher",
        "assistant chaplain",
        "episcopal clergyman",
        "u.p. minister",

        "congregational missionary",
        "principal medical officer",
        "divinity student",

        "united presbyterian and u.f. minister",
        "theological student",
        "antiburgher minister",

        "church missionary society",
        "baptist missionary",
        "army chaplain",

        "united associate and united presbyterian minister",
    ],

    education: [
        "schoolmaster and clerk",
        "rector",
        "schoolmaster",

        "teacher of latin and greek",
        "professor of divinity",
        "principal",
        "schoolmaster",

        "professor of hebrew",
        "professor of mathematics",
        "tutor",
        "professor",

        "inspector of schools",
        "professor of oriental languages",
        "master",

        "assistant in humanity",
        "professor of chemistry",
        "professor of obstetric medicine",

        "macdonald professor of chemistry",
        "founder and first principal",
        "provost",

        "lecturer in natural history",
        "professor of natural history",

        "professor of comparative anatomy and zoology",
        "professor of biology",

        "professor of engineering",
        "vice-principal",
        "vice - principal",
        "school teacher",

        "tutor",
        "professor of english",
        "rector of the university",
        "teacher of music",

        "professor of humanity",
        "professor of sacred literature",
        "professor of modern history",

        "professor of sanskrit",
        "professor of anatomy",
        "tutor in mathematics",

        "mathematics master",
        "assistant in greek",
        "professor of classics",
        "vice chancellor",

        "professor of natural history and chemistry",
        "classical master",
        "private tutor",

        "classics master",
        "professor of new testament studies",
        "science and mathematics master",

        "mathematics teacher",
        "professor of civil history",
        "teacher",
        "assistant master",

        "lecturer",
        "commissioner of schools",
        "senior assistant in zoology",

        "naturalist at marine laboratory",
        "professor of zoology",
        "demonstrator in chemistry",

        "science master",
        "tutor in gynaecology",
        "professor of obstetrics",

        "professor of midwifery",
        "professor of physiology and pathology",
        "chancellor",

        "lecturer in logic",
        "professor of mental and moral philosophy",

        "professor of sacred languages",
        "professor of english language and literature",

        "classics master",
        "professor of forestry",
        "marine biologist",
        "professor of zoology",

        "professor of church history and history of dogma",
        "venture schoolmaster",

        "superintending chemist",
        "tutor and guardian",
        "lecturer in political economy",

        "assistant to professor fischer",
        "chief inspector of schools",
        "senior language mistress",

        "classical mistress",
        "modern languages tutor",
        "assistant french mistress",
        "fellow",

        "professor of english literature",
        "professor of comparative literature",
        "professor of arabic",

        "professor of belles lettres",
        "professor of biblical criticism",
        "assistant in humanity",

        "taylorian lecturer in scandinavian languages",
        "professor of anglo-saxon",

        "lecturer in anatomy",
        "professor of physiology",
        "lecturer in materia medica",

        "university lecturer",
        "professor of physics",
        "professor of clinical surgery",

        "headmaster",
        "assistant lecturer",
        "master of method",
        "head teacher",

        "first professor of philosophy and english literature",
        "assistant to professor of hebrew",

        "english master",
        "assistant classical master",
        "professor of systematic theology",

        "teacher of languages",
        "professor of english and philosophy",
        "vice principal",

        "school superintendent",
        "head master",
        "assistant to professor of humanity",

        "professor of greek, latin and english",
    ],

    noble: ["earl", "baron", "marquess", "baronet", "duke", "duke", "bt."],

    trade: [
        "honourable east india company service",
        "senior merchant",
        "factor",
        "clerk",
        "chairman",
        "merchant",

        "general merchant, importer and shipping agent",
        "coffee planter",
        "business man",

        "sugar planter",
        "planter",
        "town clerk",
        "senior clerk",

        "officiating import warehouse keeper and naval stock keeper",
        "manager",

        "indigo planter",
        "dry goods business",
        "free merchant",
        "banker",
        "free merchant",

        "burgher",
        "teller",
        "bookkeeper",
    ],

    land: ["landowner", "laird", "landed proprietor"],

    military: [
        "officer of militia",
        "captain in the army",
        "captain",
        "cadet",
        "army",
        "colonel",
        "major",
        "adjutant",

        "cadet",
        "ensign",
        "ensign",
        "garrison mate",
        "deputy adjutant general",
        "soldier",
        "artillery"
    ],

    government: [
        "chamberlain",
        "hm comptroller",
        "governor",
        "ambassador",
        "regent",

        "director of public instruction",
        "governor general",

        "superintendent of the government botanic garden",
        "parliamentary librarian",

        "district commissioner",
        "british consular service",
        "minister of education",

        "superintendent general of education",
        "governor and commander in chief",

        "chief secretary to the government",
        "deputy inspector general",
        "inspector general",

        "commissioner of court of requests",
        "commissioner of fisheries",
        "civil servant",
        "indian civil service",

        "privy councillor and chancellor",
        "civil servant and magistrate",
        "lieutenant governor",

        "secretary of state",
        "deputy master of the mint",
        "attaché",
        "chargé d’affaires",

        "envoy extraordinary and minister plenipotentiary",

        "clerk of the executive and legislative councils",
        "member of legislative council",

        "u.s. ambassador",
        "colonial treasurer and naval officer",

        "chief engineer and secretary to government",
        "official member of council",

        "assistant commissioner and settlement officer",
        "collector of customs",

        "commissioner of customs, salt and opium",
        "sheriff",
        "senator",
        "inspector",

        "member of council",
        "deputy inspector",
        "divisional revenue commissioner",

        "paymaster general",
        "chief secretary ",
        "lord lieutenant",
        "lieutenant",
        "commissioner for crown lands",

        "scientific advisor",
        "lieutenant governor",
    ],

    local_government: [
        "burgess",
        "town councillor",
        "mayor",
        "city superintendent",

        "city superintendent",
        "councillor and mayor",
    ],

    politics: [
        "member of parliament",
        "tory m.p.",
        "m.p.",
        "member of the house of assembly",

        "member of local legislature",
        " liberal leader",
    ],

    justice: [
        "magistrate",
        "chief justice",
        "associate justice supreme court",

        "civil and sessions judge",
        "city coroner",
        "chief justice",
        "lawyer",
        "assistant judge",

        "barrister",
        "attorney general",
        "judge",
        "judge",
        "advocate general",
        "advocate",
        "law agent",
        "writer",

        "writer",
    ],

    art: ["author", "curator"],

    printed: [
        "journalist",
        "editor",
        "assistant editor",
        "assistant librarian",
        "colporteur",
    ],

    engineer: [
        "civil engineer",
        "chief engineer",
        "superintending engineer",
        "engineer",

        "consulting engineer",
        "engineer officer"
    ],

    farm: [
        "sheep farmer",
        "practitioner and farmer",
        "farm labourer",
        "sheep breeder",

        "farmer",
        "estanciero",
    ],

    forestry: [
        "conservator of forests",
        "delegate for instruction in forestry",
    ],

    sport: ["amateur golf champion"],

    unknown: [
        "assistant",
        "retired",
        "member",
        "moderator",
        "private assistant",

        "director",
        "member of the st andrews society",
        "casualty clearing station",
        "apprentice",

        "pioneer",
        "staff",
        "assistant",
        "chief",
        "director",
        "warden",
        "president ",
        "secretary",

        "president",
        "superintendent",
        "incumbent",
        "usher",
        "practised"
    ]
};


export let dimensions = ["college", "degree", "career"];
export let colleges = [
    "United College",
    "U.C.D.",
    "St Mary’s College",
    "St Salvator’s College",
    "St Leonard’s College",
    "unknown",
];
export let degrees = [
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
export let careers = [
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

export function career(career_data) {
    console.log(career_data);

    let grps = {
        medicine: [],
        religion: [],
        education: [],
        noble: [],
        trade: [],
        land: [],
        military: [],
        government: [],
        local_government: [],
        politics: [],
        justice: [],
        art: [],
        printed: [],
        engineer: [],
        farm: [],
        forestry: [],
        sport: [],
        unknown: [],
    };

    // Filter objects with floruit (career information)
    let with_careers = career_data.filter(
        (item) => item.floruit && item.floruit.length > 0,
    );

    with_careers.forEach((item) => {
        // Loop through each floruit entry for the item
        let hasValidOccupation = false;

        item.floruit.forEach((f) => {
            if (
                f.occupation == null ||
                (Array.isArray(f.occupation) && f.occupation[0] == null)
            ) {
                return; // Skip null or invalid occupations
            }

            // Handle cases where occupation is a valid string
            const occupation = f.occupation.toLowerCase();

            // Assign to the appropriate group
            if (occupations.medicine.includes(occupation)) {
                grps.medicine.push(item);
                hasValidOccupation = true;
            } else if (occupations.religion.includes(occupation)) {
                grps.religion.push(item);
                hasValidOccupation = true;
            } else if (occupations.education.includes(occupation)) {
                grps.education.push(item);
                hasValidOccupation = true;
            } else if (occupations.noble.includes(occupation)) {
                grps.noble.push(item);
                hasValidOccupation = true;
            } else if (occupations.trade.includes(occupation)) {
                grps.trade.push(item);
                hasValidOccupation = true;
            } else if (occupations.land.includes(occupation)) {
                grps.land.push(item);
                hasValidOccupation = true;
            } else if (occupations.military.includes(occupation)) {
                grps.military.push(item);
                hasValidOccupation = true;
            } else if (occupations.government.includes(occupation)) {
                grps.government.push(item);
                hasValidOccupation = true;
            } else if (occupations.local_government.includes(occupation)) {
                grps.local_government.push(item);
                hasValidOccupation = true;
            } else if (occupations.politics.includes(occupation)) {
                grps.politics.push(item);
                hasValidOccupation = true;
            } else if (occupations.justice.includes(occupation)) {
                grps.justice.push(item);
                hasValidOccupation = true;
            } else if (occupations.art.includes(occupation)) {
                grps.art.push(item);
                hasValidOccupation = true;
            } else if (occupations.printed.includes(occupation)) {
                grps.printed.push(item);
                hasValidOccupation = true;
            } else if (occupations.engineer.includes(occupation)) {
                grps.engineer.push(item);
                hasValidOccupation = true;
            } else if (occupations.farm.includes(occupation)) {
                grps.farm.push(item);
                hasValidOccupation = true;
            } else if (occupations.forestry.includes(occupation)) {
                grps.forestry.push(item);
                hasValidOccupation = true;
            } else if (occupations.sport.includes(occupation)) {
                grps.sport.push(item);
                hasValidOccupation = true;
            }
        });

        // If no valid occupation was found, push to the unknown group
        if (!hasValidOccupation) {
            grps.unknown.push(item);
        }
    });

    // Handle cases where there is no floruit at all (i.e., item.floruit is null or empty)
    let without_careers = career_data.filter(
        (item) => !item.floruit || item.floruit.length === 0,
    );
    without_careers.forEach((item) => {
        grps.unknown.push(item); // If no career information, add to 'unknown'
    });

    return grps
}

let male, female;

export function genderFilter(filter_gender) {

    if (filter_gender.length == 0) {
        male = []
        female = []
    }
    else if (filter_gender.length == 2) {
        female = filter_gender.find((item) => item[0] === "F")[1];
        male = filter_gender.find((item) => item[0] === "M")[1];
    } else {
        if (!filter_gender.find((item) => item[0] === "M")) {
            male = [];
            female = filter_gender.find((item) => item[0] === "F")[1];
        }
        if (!filter_gender.find((item) => item[0] === "F")) {
            female = [];
            male = filter_gender.find((item) => item[0] === "M")[1];
        }
    }

    return [female, male]

}

function findOccupationArray(occupation) {
    for (const [key, array] of Object.entries(occupations)) {
        if (array.includes(occupation)) {
            return key; // Return the name of the array
        }
    }
    return "unknown"; // Return null if not found
}


export function constructNodesAndLinks(dataArray) {
    const nodes = [];
    const links = [];
    const nodeSet = new Set(); // To track existing nodes
    const connectionCounts = {}; // To keep track of connection counts

    dataArray.forEach(person => {
        // Add person node
        nodes.push({ id: person.id, group: "person", connectionCount: 0 });
        nodeSet.add(person.id); // Add to the set for quick lookup

        const occupations = person.floruit && person.floruit.length > 0
            ? person.floruit
            : [{ occupation: "unknown" }]; // Default to unknown if floruit is null or empty

        occupations.forEach(occupationEntry => {
            let occupation;

            // Determine occupation
            if (!occupationEntry.occupation || occupationEntry.occupation[0] == null) {
                occupation = "unknown";
            } else if (occupationEntry.occupation === "unknown") {
                occupation = "unknown";
            } else {
                occupation = findOccupationArray(occupationEntry.occupation);
            }

            // Add occupation node if it doesn't already exist
            if (!nodeSet.has(occupation)) {
                nodes.push({ id: occupation, group: "career", connectionCount: 0 });
                nodeSet.add(occupation); // Add to the set for quick lookup
            }

            // Create link from person to occupation if it doesn't already exist
            const link = {
                source: person.id,
                target: occupation
            };

            if (!links.some(existingLink => existingLink.source === link.source && existingLink.target === link.target)) {
                links.push(link);
                // Increment connection counts
                connectionCounts[person.id] = (connectionCounts[person.id] || 0) + 1; // Increment for person
                connectionCounts[occupation] = (connectionCounts[occupation] || 0) + 1; // Increment for occupation
            }
        });
    });

    // Update connection counts in nodes
    nodes.forEach(node => {
        node.connectionCount = connectionCounts[node.id] || 0; // Set connection count or 0 if none
    });

    return { nodes, links };
}

export let colonies = [
    "US",
    "CA",
    "ZA",
    "SL",
    "EG",
    "ZM",
    "MU",
    "NG",
    "AU",
    "NZ",
    "JM",
    "AG",
    "BB",
    "GY",
    "BS",
    "TT",
    "GD",
    "DM",
    "KN",
    "VC",
    "BZ",
    "SG",
    "MY",
    "ID",
    "CN",
    "VU",
    "MM",
    "HK",
    "WS",
    "LB",
    "IL",
    "CY",
    "MT",
    "SY",
    "TR",
    "IR",
    "AR",
    "IN",
    "LK",
    "AF",
    "PK",
    "BD",
];

export const india_colonies = ["IN", "LK", "PK", "MM"];
export const african_colonies = ["ZA", "SL", "EG", "ZM", "NG"];
export const america_colonies = ["US", "CA"];
export const australia_colonies = ["AU", "NZ"];
export const asian_colonies = ["MY", "SG", "HK"];
export const caribbean_colonies = [
    "JM",
    "AG",
    "BB",
    "GY",
    "BS",
    "TT",
    "GD",
    "DM",
    "KN",
    "VC",
];


export function groupByColony(data) {
    const groupedByColony = {};

    data.forEach((item) => {
        if (item.floruit) {
            item.floruit.forEach((floruitEntry) => {
                const colony = floruitEntry.location.colony || "unknown";

                // Initialize the colony group if it doesn't exist
                if (!groupedByColony[colony]) {
                    groupedByColony[colony] = {
                        items: [],
                        ids: new Set(),
                    };
                }

                // Only add the item if it hasn't been added already
                if (!groupedByColony[colony].ids.has(item.id)) {
                    groupedByColony[colony].items.push(item);
                    groupedByColony[colony].ids.add(item.id); // Mark the item as added
                }
            });
        }
    });

    // Prepare the output structure
    const outputArray = Object.keys(groupedByColony).map((colony) => {
        return [
            colony === "unknown" ? undefined : colony,
            groupedByColony[colony].items,
        ];
    });

    return outputArray;
}