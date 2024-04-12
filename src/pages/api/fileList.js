import { NextResponse, NextRequest } from "next/server";

export async function GET({req: NextRequest}) {
 
  const result = {
    message: "working",
  };
  return NextResponse.json(result, {
    status: 200,
  });
}


export async function reqFiles(req, res) {
    var fileList = [
        {
           "name": "test-file1.txt",
           "size": "10M",
           "description": "A test file..."
        },{
           "name": "test-file2.txt",
           "size": "894M",
           "description": "A second test file..."
        },{
           "name": "test-file3.txt",
           "size": "456K"
        }];
    return fileList;
}