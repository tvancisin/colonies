import * as d3 from "d3";

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
