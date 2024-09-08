import * as d3 from "d3";

//LOADING DATA FUNCTIONS
export async function getJson(path) {
    let loadedData = await d3.json(path);
    return loadedData;
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
