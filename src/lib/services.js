// import log from "loglevel";
// import { getAuth, getEntityEndPoint, getIngestEndPoint, getSearchEndPoint, getUUIDEndpoint } from "../config/config";
// import {getCookie} from "cookies-next";

// After creating or updating an entity, send to Entity API. Search API will be triggered during this process automatically

export async function testAPI(body) {
    let headers = {
        Authorization: "Bearer " ,
        "Content-Type":"application/json"}
    let raw = JSON.stringify(body)
    let url = process.env.NEXT_PUBLIC_IAPIURL
    return callService("Testing", url, method, headers)
}

export async function callService(raw, url, method, headers) {
    return await fetch(url, {
        method: "GET",
        headers: headers,
        body: raw,
    }).then(response => response.json())
        .then(result => 
            console.debug('%c◉ result ', 'color:#00ff7b', result);{
            // log.info(result)
            return result;
        }).catch(error => {
            console.debug('%c◉ error ', 'color:#00ff7b', error);
            // log.error('error', error)
            return error;
        });
}

export function parseJson(json) {
    if (typeof json === 'string' || json instanceof String) {
        if (json === '') {
            return null
        }
        return JSON.parse(json)
    } else {
        return json
    }
}
