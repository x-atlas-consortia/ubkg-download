import {
    NextResponse,
    NextRequest
} from "next/server";

export async function GET({
    req: NextRequest
}) {
    const result = {
        message: "working",
    };
    return NextResponse.json(result, {
        status: 200,
    });
}


export async function FileList(umlsKey) {
    let url = `${process.env.NEXT_PUBLIC_API_URL_BASE}${process.env.NEXT_PUBLIC_UBKG_FILES_ENDPOINT}?umls-key=${umlsKey}`
    let headers = {
        "Content-Type": "application/json"
    }
    console.debug('%c◉ fileList url ', 'color:#00ff7b', url);


    return await fetch(
        url, {
            method: "GET",
            headers: headers,
        })
        // @TODO
        // We may need to switch out Data with Result, 
        // Had to use data for the local file list
        // Result should be correct for the API Response

        // RESULT
        .then(result => {
            console.debug('%c◉ fileList result ', 'color:#00ff7b', result);
            return result;
        })
        .then(function (response) {
            return response.text();
        })
        .then(function (data) {
            // console.debug('%c◉ response ', 'color:#00ff7b', response);
            console.debug('%c◉ fileList result ', 'color:#00ff7b', data);
            // log.info(result)
            return data;
        }).catch(error => {
            console.debug('%c◉ fileList error ', 'color:#00ff7b', error);
            // log.error('error', error)
            return error;
        });
}