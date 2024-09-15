import * as d3 from "d3";

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
export function filterData(data, startYear, endYear) {
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

        // Extract years from 'study.degrees.date'
        const degreesYears = (item.study.degrees || [])
            .map((degree) => {
                // Extract the year from the date, assuming 'date' might be in various formats
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

export function opacity_generator(data) {
    let filter_undefined = data.filter((d) => d[0] !== undefined);
    let regionsWithOpacity = filter_undefined.map((region) => {
        let regionName = region[0]; // Get the region name
        let count = region[1].length; // Get the length of the array (e.g., 58)
        let opacity = opacityScale(count); // Use the scale to calculate opacity
        return [regionName, opacity]; // Return the region name and calculated opacity
    });
    return regionsWithOpacity;
}

// Opacity scale
const opacityScale = d3.scaleLinear().domain([0, 70]).range([0.2, 1]);

// Function to build dynamic opacity expression
export function getOpacityExpression(regions) {
    let expression = ["match", ["get", "ADMIN"]]; // Using 'ADMIN' as the property to check
    regions.forEach(([region, opacity]) => {
        expression.push(region, opacity);
    });
    expression.push(1);
    return expression;
}

//occupations
export const medicine = [
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

export const religion = [
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

export const education = [
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

export const noble = ["Earl", "Baron", "Marquess", "baronet", "Duke", "duke", "Bt."];

export const trade = [
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

export const land = ["Landowner", "Laird"];

export const military = [
    "officer of militia",
    "Captain in the army",
    "Captain",
    "cadet",

    "Cadet",
    "Ensign",
    "Garrison Mate",
    "Deputy Adjutant General",
    "Soldier",
    "Artillery"
];

export const government = [
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

export const local_government = [
    "Burgess",
    "Town Councillor",
    "Mayor",
    "City Superintendent",

    "City Superintendent",
    "Councillor and Mayor",
];

export const politics = [
    "Member of Parliament",
    "Tory M.P.",
    "M.P.",
    "Member of the House of Assembly",

    "Member of local legislature",
    " Liberal leader",
];

export const justice = [
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

export const art = ["author", "Curator"];

export const printed = [
    "journalist",
    "Editor",
    "Assistant editor",
    "Assistant librarian",
    "Colporteur",
];

export const engineer = [
    "civil engineer",
    "chief engineer",
    "Superintending engineer",
    "Engineer",

    "consulting engineer",
];

export const farm = [
    "sheep farmer",
    "practitioner and farmer",
    "farm labourer",
    "sheep breeder",

    "Farmer",
    "Estanciero",
];

export const forestry = [
    "Conservator of Forests",
    "Delegate for instruction in Forestry",
];

export const sport = ["Amateur golf champion"];

export const unknown = [
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

export function career (career_data) {
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
            const occupation = f.occupation; // normalize case for comparison

            // Assign to the appropriate group
            if (medicine.includes(occupation)) {
                grps.medicine.push(item);
                hasValidOccupation = true;
            } else if (religion.includes(occupation)) {
                grps.religion.push(item);
                hasValidOccupation = true;
            } else if (education.includes(occupation)) {
                grps.education.push(item);
                hasValidOccupation = true;
            } else if (noble.includes(occupation)) {
                grps.noble.push(item);
                hasValidOccupation = true;
            } else if (trade.includes(occupation)) {
                grps.trade.push(item);
                hasValidOccupation = true;
            } else if (land.includes(occupation)) {
                grps.land.push(item);
                hasValidOccupation = true;
            } else if (military.includes(occupation)) {
                grps.military.push(item);
                hasValidOccupation = true;
            } else if (government.includes(occupation)) {
                grps.government.push(item);
                hasValidOccupation = true;
            } else if (local_government.includes(occupation)) {
                grps.local_government.push(item);
                hasValidOccupation = true;
            } else if (politics.includes(occupation)) {
                grps.politics.push(item);
                hasValidOccupation = true;
            } else if (justice.includes(occupation)) {
                grps.justice.push(item);
                hasValidOccupation = true;
            } else if (art.includes(occupation)) {
                grps.art.push(item);
                hasValidOccupation = true;
            } else if (printed.includes(occupation)) {
                grps.printed.push(item);
                hasValidOccupation = true;
            } else if (engineer.includes(occupation)) {
                grps.engineer.push(item);
                hasValidOccupation = true;
            } else if (farm.includes(occupation)) {
                grps.farm.push(item);
                hasValidOccupation = true;
            } else if (forestry.includes(occupation)) {
                grps.forestry.push(item);
                hasValidOccupation = true;
            } else if (sport.includes(occupation)) {
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