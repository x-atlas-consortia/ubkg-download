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



export async function FileList(umlsKey) {
    //@TODO:  ACTIVATE THEY KEY ATTACHMENT TO THE UMLS URL HERE
    // let url = process.env.NEXT_PUBLIC_IAPIURL+umlsKey
    let url = process.env.NEXT_PUBLIC_UMLSREQ
    let headers = {"Content-Type":"application/json"}
    console.debug('%c◉ fileList url ', 'color:#00ff7b', url);

   return await fetch(
      url, {
      method: "GET",
      headers: headers,
   })
   // @TODO
   // We may need to switch out Data with Result, 
   // Had to use data for the local file list
   // This is because it comes in as a "ReadableStream"
   // Result should be correct for the API Response
   
   // RESULT
   /*.then(result => {
      console.debug('%c◉ fileList result ', 'color:#00ff7b', result);
      return result;
   })*/
   
   // DATA
   .then(function(data) {
      console.debug('%c◉ fileList result ', 'color:#00ff7b', data);
      return data;
   })
   
   .catch(error => {
      console.debug('%c◉ fileList error ', 'color:#00ff7b', error);
      return error;
   });
}
    


var files =  [
   {
       "name": "test-file1.txt",
       "size": "10M",
       "description": "A test file..."
   },{
       "name": "test-file2.zip",
       "size": "894M",
       "description": "A second test file..."
   },{
       "name": "test-file3.txt",
       "size": "456K"
   }
]