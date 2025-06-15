import * as d3 from "d3";

export let all_students = [
    { year: 1700, number: 54 },
    { year: 1701, number: 44 },
    { year: 1702, number: 73 },
    { year: 1703, number: 36 },
    { year: 1704, number: 55 },
    { year: 1705, number: 56 },
    { year: 1706, number: 55 },
    { year: 1707, number: 28 },
    { year: 1708, number: 36 },
    { year: 1709, number: 36 },
    { year: 1710, number: 44 },
    { year: 1711, number: 40 },
    { year: 1712, number: 37 },
    { year: 1713, number: 38 },
    { year: 1714, number: 39 },
    { year: 1715, number: 30 },
    { year: 1716, number: 45 },
    { year: 1717, number: 41 },
    { year: 1718, number: 46 },
    { year: 1719, number: 31 },
    { year: 1720, number: 39 },
    { year: 1721, number: 49 },
    { year: 1722, number: 43 },
    { year: 1723, number: 49 },
    { year: 1724, number: 28 },
    { year: 1725, number: 33 },
    { year: 1726, number: 32 },
    { year: 1727, number: 49 },
    { year: 1728, number: 27 },
    { year: 1729, number: 27 },
    { year: 1730, number: 29 },
    { year: 1731, number: 20 },
    { year: 1732, number: 25 },
    { year: 1733, number: 22 },
    { year: 1734, number: 25 },
    { year: 1735, number: 31 },
    { year: 1736, number: 21 },
    { year: 1737, number: 26 },
    { year: 1738, number: 23 },
    { year: 1739, number: 24 },
    { year: 1740, number: 18 },
    { year: 1741, number: 23 },
    { year: 1742, number: 25 },
    { year: 1743, number: 30 },
    { year: 1744, number: 36 },
    { year: 1745, number: 35 },
    { year: 1746, number: 44 },
    { year: 1747, number: 33 },
    { year: 1748, number: 33 },
    { year: 1749, number: 14 },
    { year: 1750, number: 46 },
    { year: 1751, number: 24 },
    { year: 1752, number: 38 },
    { year: 1753, number: 27 },
    { year: 1754, number: 40 },
    { year: 1755, number: 35 },
    { year: 1756, number: 44 },
    { year: 1757, number: 36 },
    { year: 1758, number: 30 },
    { year: 1759, number: 42 },
    { year: 1760, number: 33 },
    { year: 1761, number: 45 },
    { year: 1762, number: 42 },
    { year: 1763, number: 56 },
    { year: 1764, number: 39 },
    { year: 1765, number: 44 },
    { year: 1766, number: 30 },
    { year: 1767, number: 28 },
    { year: 1768, number: 38 },
    { year: 1769, number: 41 },
    { year: 1770, number: 49 },
    { year: 1771, number: 39 },
    { year: 1772, number: 38 },
    { year: 1773, number: 37 },
    { year: 1774, number: 36 },
    { year: 1775, number: 39 },
    { year: 1776, number: 35 },
    { year: 1777, number: 42 },
    { year: 1778, number: 44 },
    { year: 1779, number: 65 },
    { year: 1780, number: 56 },
    { year: 1781, number: 59 },
    { year: 1782, number: 62 },
    { year: 1783, number: 97 },
    { year: 1784, number: 71 },
    { year: 1785, number: 84 },
    { year: 1786, number: 58 },
    { year: 1787, number: 64 },
    { year: 1788, number: 62 },
    { year: 1789, number: 54 },
    { year: 1790, number: 61 },
    { year: 1791, number: 51 },
    { year: 1792, number: 46 },
    { year: 1793, number: 50 },
    { year: 1794, number: 53 },
    { year: 1795, number: 39 },
    { year: 1796, number: 63 },
    { year: 1797, number: 55 },
    { year: 1798, number: 64 },
    { year: 1799, number: 53 },
    { year: 1800, number: 64 },
    { year: 1801, number: 53 },
    { year: 1802, number: 58 },
    { year: 1803, number: 52 },
    { year: 1804, number: 70 },
    { year: 1805, number: 47 },
    { year: 1806, number: 60 },
    { year: 1807, number: 43 },
    { year: 1808, number: 52 },
    { year: 1809, number: 64 },
    { year: 1810, number: 67 },
    { year: 1811, number: 72 },
    { year: 1812, number: 80 },
    { year: 1813, number: 75 },
    { year: 1814, number: 88 },
    { year: 1815, number: 76 },
    { year: 1816, number: 82 },
    { year: 1817, number: 89 },
    { year: 1818, number: 104 },
    { year: 1819, number: 111 },
    { year: 1820, number: 100 },
    { year: 1821, number: 101 },
    { year: 1822, number: 116 },
    { year: 1823, number: 105 },
    { year: 1824, number: 175 },
    { year: 1825, number: 139 },
    { year: 1826, number: 79 },
    { year: 1827, number: 95 },
    { year: 1828, number: 88 },
    { year: 1829, number: 62 },
    { year: 1830, number: 59 },
    { year: 1831, number: 55 },
    { year: 1832, number: 68 },
    { year: 1833, number: 66 },
    { year: 1834, number: 56 },
    { year: 1835, number: 54 },
    { year: 1836, number: 66 },
    { year: 1837, number: 61 },
    { year: 1838, number: 60 },
    { year: 1839, number: 73 },
    { year: 1840, number: 69 },
    { year: 1841, number: 75 },
    { year: 1842, number: 88 },
    { year: 1843, number: 101 },
    { year: 1844, number: 104 },
    { year: 1845, number: 167 },
    { year: 1846, number: 116 },
    { year: 1847, number: 117 },
    { year: 1848, number: 79 },
    { year: 1849, number: 87 },
    { year: 1850, number: 121 },
    { year: 1851, number: 140 },
    { year: 1852, number: 138 },
    { year: 1853, number: 127 },
    { year: 1854, number: 128 },
    { year: 1855, number: 108 },
    { year: 1856, number: 137 },
    { year: 1857, number: 116 },
    { year: 1858, number: 112 },
    { year: 1859, number: 156 },
    { year: 1860, number: 141 },
    { year: 1861, number: 171 },
    { year: 1862, number: 666 },
    { year: 1863, number: 64 },
    { year: 1864, number: 62 },
    { year: 1865, number: 65 },
    { year: 1866, number: 68 },
    { year: 1867, number: 62 },
    { year: 1868, number: 77 },
    { year: 1869, number: 74 },
    { year: 1870, number: 72 },
    { year: 1871, number: 73 },
    { year: 1872, number: 59 },
    { year: 1873, number: 52 },
    { year: 1874, number: 68 },
    { year: 1875, number: 56 },
    { year: 1876, number: 49 },
    { year: 1877, number: 78 },
    { year: 1878, number: 98 },
    { year: 1879, number: 112 },
    { year: 1880, number: 134 },
    { year: 1881, number: 180 },
    { year: 1882, number: 213 },
    { year: 1883, number: 345 },
    { year: 1884, number: 187 },
    { year: 1885, number: 241 },
    { year: 1886, number: 250 },
    { year: 1887, number: 375 },
    { year: 1888, number: 241 },
    { year: 1889, number: 277 },
    { year: 1890, number: 335 },
    { year: 1891, number: 346 },
    { year: 1892, number: 413 },
    { year: 1893, number: 403 },
    { year: 1894, number: 485 },
    { year: 1895, number: 426 },
    { year: 1896, number: 385 },
    { year: 1897, number: 328 },
    { year: 1898, number: 5 },
    { year: 1899, number: 6 },
    { year: 1900, number: 2 }
]



// Scroll to a specific section
export const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: "smooth" });
    }
};

export let dimensions = ["college", "degree", "career"];
export let colleges = [
    "UNC",
    "UCD",
    "SMC",
    "SSC",
    "SLC",
    "unk",
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
    "unk",
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
    "unk",
];


export function constructParallelData(data) {
    const transformedData = [];

    data.forEach(item => {
        const id = item.id;

        // Normalize colleges
        const colleges = item.study?.colleges?.map(col => {
            let college = col.name;
            if (college === "St Leonard’s College") return "SLC";
            if (college === "St Salvator’s College") return "SSC";
            if (college === "St Mary’s College") return "SMC";
            if (college === "U.C.D.") return "UCD";
            if (college === "United College") return "UNC";
            return college || "unk";
        }) || ["unk"];

        // Normalize degrees
        const degrees = item.study?.degrees?.map(deg => deg.name || "unk") || ["unk"];
        // "idp1379846380"

        // Normalize careers
        let careers = [];

        if (Array.isArray(item.floruit)) {
            item.floruit.forEach(f => {
                const occupation = f.occupation;
                if (Array.isArray(occupation)) {
                    occupation.forEach(o => {
                        if (typeof o === 'string') {
                            careers.push(o);
                        }
                    });
                } else if (typeof occupation === 'string') {
                    careers.push(occupation);
                }
            });
        }

        if (careers.length === 0) {
            careers = ["unk"];
        }

        // Normalize and group careers
        careers = careers.map(raw => {
            let career = raw.toLowerCase();

            if (occupations.medicine.includes(career)) return "medicine";
            if (occupations.religion.includes(career)) return "religion";
            if (occupations.education.includes(career)) return "education";
            if (occupations.noble.includes(career)) return "noble";
            if (occupations.trade.includes(career)) return "trade";
            if (occupations.land.includes(career)) return "land";
            if (occupations.military.includes(career)) return "military";
            if (occupations.government.includes(career)) return "government";
            if (occupations.local_government.includes(career)) return "local_government";
            if (occupations.politics.includes(career)) return "politics";
            if (occupations.justice.includes(career)) return "justice";
            if (occupations.art.includes(career)) return "art";
            if (occupations.print.includes(career)) return "print";
            if (occupations.engineer.includes(career)) return "engineering";
            if (occupations.farming.includes(career)) return "farming";
            if (occupations.forestry.includes(career)) return "forestry";
            if (occupations.sport.includes(career)) return "sport";
            if (occupations.unclear.includes(career)) return "unclear";

            return "unk";
        });

        // console.log(id, colleges, degrees, careers);

        // Combine all combinations
        colleges.forEach(college => {
            degrees.forEach(degree => {
                careers.forEach(career => {
                    transformedData.push({
                        id,
                        college,
                        degree,
                        career
                    });
                });
            });
        });
    });

    const seen = new Set();
    const deduplicatedData = transformedData.filter(entry => {
        const key = JSON.stringify(entry);
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });

    return deduplicatedData;
}

//LOADING DATA FUNCTIONS
export async function getIndividualCSV(path) {
    let loadedData = await d3.csv(path);
    return loadedData;
}

export async function getCSV(paths) {
    const promises = paths.map(path => getIndividualCSV(path));
    const results = await Promise.all(promises);
    return results;
}

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
const widthScale = d3.scaleLinear().domain([0, 350]).range([0, 5]);

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
        "liberal leader",
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

    print: [
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

    farming: [
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

    unclear: [
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
        "practised",
        "killed earl of strathmore in a brawl"
    ]
};

export function college(college_data) {

    let grps = {
        "unk": [],
        "SLC": [],
        "SSC": [],
        "SMC": [],
        "UCD": [],
        "UNC": [],
    }

    // Filter objects with degree 
    let with_college = college_data.filter(
        (item) => item.study && item.study.colleges && item.study.colleges.length > 0,
    );

    with_college.forEach((item) => {
        // Loop through each degree entry for the item
        let hasValidDegree = false;

        item.study.colleges.forEach((college) => {
            if (!college.name) {
                return; // Skip null or invalid degrees
            }

            // Handle cases where degree is a valid string
            let collegeName = college.name;

            if (collegeName == "St Leonard’s College") {
                collegeName = "SLC"
            }
            else if (collegeName == "St Salvator’s College") {
                collegeName = "SSC"
            }
            else if (collegeName == "St Mary’s College") {
                collegeName = "SMC"
            }
            else if (collegeName == "U.C.D.") {
                collegeName = "UCD"
            }
            else if (collegeName == "United College") {
                collegeName = "UNC"
            }

            // Assign to the appropriate group
            if (colleges.includes(collegeName)) {
                grps[collegeName].push(item);
                hasValidDegree = true;
            }
        });

        // If no valid degree was found, push to the unknown group
        if (!hasValidDegree) {
            grps["unk"].push(item);
        }
    });


    let without_college = college_data.filter(
        (item) => !item.study || !item.study.colleges || item.study.colleges.length === 0,
    );

    without_college.forEach((item) => {
        grps["unk"].push(item); // If no degree information, add to 'unknown'
    });

    return grps;
}


export function degree(degree_data) {

    let grps = {
        "M.B. C.M.": [],
        "LLA": [],
        "D.Mus.": [],
        "M.B. Ch.B.": [],
        "D.Sc.": [],
        "B.Sc.": [],
        "D.D.": [],
        "B.D.": [],
        "B.A.": [],
        "LL.D.": [],
        "M.A.": [],
        "M.D.": [],
        "unk": [],
    };

    // Filter objects with degree 
    let with_degree = degree_data.filter(
        (item) => item.study && item.study.degrees && item.study.degrees.length > 0,
    );

    with_degree.forEach((item) => {
        // Loop through each degree entry for the item
        let hasValidDegree = false;

        item.study.degrees.forEach((degree) => {
            if (!degree.name) {
                return; // Skip null or invalid degrees
            }

            // Handle cases where degree is a valid string
            const degreeName = degree.name;

            // Assign to the appropriate group
            if (degrees.includes(degreeName)) {
                grps[degreeName].push(item);
                hasValidDegree = true;
            }
        });

        // If no valid degree was found, push to the unknown group
        if (!hasValidDegree) {
            grps["unk"].push(item);
        }
    });

    let without_degree = degree_data.filter(
        (item) => !item.study || !item.study.degrees || item.study.degrees.length === 0,
    );

    without_degree.forEach((item) => {
        grps["unk"].push(item);
    });

    return grps;
}


export function career(career_data) {
    // console.log(career_data);

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
        print: [],
        engineering: [],
        farming: [],
        forestry: [],
        sport: [],
        unclear: [],
        unk: [],
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
            } else if (occupations.print.includes(occupation)) {
                grps.print.push(item);
                hasValidOccupation = true;
            } else if (occupations.engineer.includes(occupation)) {
                grps.engineering.push(item);
                hasValidOccupation = true;
            } else if (occupations.farming.includes(occupation)) {
                grps.farming.push(item);
                hasValidOccupation = true;
            } else if (occupations.forestry.includes(occupation)) {
                grps.forestry.push(item);
                hasValidOccupation = true;
            } else if (occupations.sport.includes(occupation)) {
                grps.sport.push(item);
                hasValidOccupation = true;
            } else if (occupations.unclear.includes(occupation)) {
                grps.unclear.push(item);
                hasValidOccupation = true;
            }

        });

        // If no valid occupation was found, push to the unknown group
        if (!hasValidOccupation) {
            grps.unk.push(item);
        }
    });

    // Handle cases where there is no floruit at all (i.e., item.floruit is null or empty)
    let without_careers = career_data.filter(
        (item) => !item.floruit || item.floruit.length === 0,
    );
    without_careers.forEach((item) => {
        grps.unk.push(item); // If no career information, add to 'unknown'
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

export function groupByCity(data) {
    const groupedByCity = {};

    data.forEach((item) => {
        if (item.floruit) {
            item.floruit.forEach((floruitEntry) => {
                const city = floruitEntry.location.original_name || "unknown";

                // Initialize the colony group if it doesn't exist
                if (!groupedByCity[city]) {
                    groupedByCity[city] = {
                        items: [],
                        ids: new Set(),
                    };
                }

                // Only add the item if it hasn't been added already
                if (!groupedByCity[city].ids.has(item.id)) {
                    groupedByCity[city].items.push(item);
                    groupedByCity[city].ids.add(item.id); // Mark the item as added
                }
            });
        }
    });

    // Prepare the output structure
    const outputArray = Object.keys(groupedByCity).map((city) => {
        return [
            city === "unknown" ? undefined : city,
            groupedByCity[city].items,
        ];
    });

    return outputArray;
}
