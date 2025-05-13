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


export async function FileListProviderUpgrade(umlsKey) {
    let url = `${process.env.NEXT_PUBLIC_ASSETS_URL_BASE}file_descriptions.json?umls-key=${umlsKey}`;
    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {"Content-Type": "application/json"}
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const jsonData = await response.json();
        return jsonData; // Return the parsed JSON data
    } catch (error) {
        console.error('Error fetching JSON file:', error);
        throw error; // Re-throw the error to handle it in the calling code
    }
}