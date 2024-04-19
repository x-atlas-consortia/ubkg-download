import { NextResponse, NextRequest } from "next/server";
// import configMode from "../fileConfig";

export async function GET({req: NextRequest}) {
  const result = {
    message: "working",
  };
  return NextResponse.json(result, {
    status: 200,
  });
}


export async function KeyAPI(umlsKey) {
    
    //@TODO:  ACTIVATE THEY KEY ATTACHMENT TO THE UMLS URL HERE
    // let url = process.env.NEXT_PUBLIC_IAPIURL+umlsKey
    let url = process.env.NEXT_PUBLIC_IAPIURL
    let headers = {"Content-Type":"application/json"}

    console.debug('%c◉ KeyAPI umlsKey ', 'color:#00ff7b', umlsKey);
    console.debug('%c◉ url ', 'color:#00ff7b', url);

    return await fetch(
        url, {
        method: "GET",
        headers: headers,
    })
    .then(result => {
        console.debug('%c◉ KeyAPI result ', 'color:#00ff7b', result);
        return result;
    }).catch(error => {
        console.debug('%c◉ KeyAPI error ', 'color:#00ff7b', error);
        return error;
    });
}