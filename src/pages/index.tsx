"use client";
import { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Alert from "@mui/material/Alert";
import { KeyAPI } from "../api/auth";
import { FileListProviderUpgrade } from "../api/files";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import LaunchIcon from '@mui/icons-material/Launch';
import { GrDocker } from "react-icons/gr";
import { FaTruck } from "react-icons/fa";
import { BsBoxSeamFill } from "react-icons/bs";
import { FaFileCsv } from "react-icons/fa6";
import { FaFileArchive } from "react-icons/fa";
import { FaBoxOpen } from "react-icons/fa";

const Home = (props: any) => {
  // var [serverMode, setServerMode] = useState("test");
  var [umlsKey, setUmlsKey] = useState('');
  var [hasAuth, setHasAuth] = useState(false);
  var [error, setError] = useState('');
  var [fileList, setFileList] = useState<{ Name: string; files: File[] }[]>([]);
  var [schema, setSchema] = useState<Schema>({
    files: [],
    types: [],
    contexts: [],
    definitions: [],
  });
  const iconAssociations = {
    'neo4j': <GrDocker/> ,
    'csv':<FaFileCsv/>,
    'dump':<FaTruck/>,
    'box':<BsBoxSeamFill/>,
  }
  interface Schema {
    files: Array<any>;
    types: Array<any>;
    contexts: Array<any>;
    definitions: Array<any>;
  }    
  interface File {
    date: string;
    name: string;
    type: string;
    typeDetail: string;
    description: string;
    context: string;
  }
  interface TableData {
    name: string;
    description: string;
    documentation_url: string;
    data: {
      files: File[];
    };
  }

  
  useEffect(() => {
    console.debug('%c◉ useEffect LS Get, sets umlskey ', 'color:#00ff7b', );
    const ls = localStorage.getItem("umlsKey");
    if ((ls && ls.length > 0 && ls !== '')) {
      setUmlsKey(ls);
      authCheck(ls);
    }else{
      // Wait till it's created by the button
      console.debug('%c◉ NO LS KEY  ', 'color:#FF0044', );
    }
  }, []);
  
  function authCheck(key?:string) {
    if(key && key.length > 0 && key !== ''){
      KeyAPI(key)
      .then((res) => {
        if (res.status === 200) {
          localStorage.setItem("umlsKey", key);
          setHasAuth(true);
          setError('');
          fileGet(key);
        } else if (res.status === 403 || res.status === 401) {
          // 401 / 403
          setHasAuth(false);
          setError('Invalid UMLS License Key');
        } else {
          throw new Error();
        }
      })
      .catch((err) => {
        console.log(err);
        setError('The server encountered an internal error and was unable to complete your request')
      });
      
    } else {
      setError('Please provide a valid UMLS License Key');
      console.debug('%c◉ Please provide a valid UMLS License Key ', 'color:#ff005d', );
    }
    
  }
  
  function fileGet(umlsKeyST:string) {
    let key = umlsKeyST || umlsKey;
    FileListProviderUpgrade(key)
    .then((res) => {
      fileSort(res.files, res.types, res.contexts, res.definitions);
    })
    .catch((err) => {
      console.debug('%c◉  fileGet ERROR:', 'color:#ff005d',err );
      setError('The File List Provider service encountered an internal error and was unable to complete your request: ' + JSON.stringify(err));
    });
  }
  
  function fileSort(files: Array<any>, types: Array<any>, contexts: Array<any>, definitions: Array<any>) {
    setSchema({ files, types, contexts, definitions })
    // Add typeDetail to each file
    const filesWithTypeDetail = files.map(file => {
      const matchingType = types.find(type => type.name === file.type);
      return {
        ...file,
        typeDetail: matchingType ? matchingType.description : null, // Add typeDetail field
      };
    });
    
    // Sort Out the Files
    const groupedByContext = Object.values(
      filesWithTypeDetail.reduce((acc, file) => {
        if (!acc[file.context]) {
          acc[file.context] = { Name: file.context, files: [] };
        }
        acc[file.context].files.push(file);
        return acc;
      }, {} as Record<string, { Name: string; files: File[] }>)
    ) as { Name: string; files: File[] }[];

    // setFileList(groupedByContext)
    // console.debug('%c◉ groupedByContext ', 'color:#00ff7b', groupedByContext);


    let fakeGroupedFiles = fakeFiles;
    console.debug('%c◉ fakeGroupedFiles ', 'color:#00ff7b', fakeGroupedFiles);
    
    const sortedFilesets = sortAllFilesets(fakeGroupedFiles);
    console.debug('%c◉ sortedFilesets ', 'color:#00ff7b', sortedFilesets);

    setFileList(sortedFilesets)
  }



  function groupFilesByType(files:Array<any>) {
    return files.reduce((acc, file) => {
      if (!acc[file.type]) acc[file.type] = [];
      acc[file.type].push(file);
      return acc;
    }, {});
  }


function sortFilesByDateDesc(files:Array<any>) {
  return files.slice().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
// For a single fileset: group by type, sort each group by date desc, then flatten by type order
function sortFilesInFileset(fileset:Array<any>) {
  const grouped = groupFilesByType(fileset.files);
  // Sort types alphabetically for consistent order
  const sortedTypes = Object.keys(grouped).sort();
  // Flatten: for each type, sorted by date desc
  const sortedFiles = sortedTypes.flatMap(type => sortFilesByDateDesc(grouped[type]));
  return { ...fileset, files: sortedFiles };
}
// For the array of filesets
function sortAllFilesets(filesets) {
  return filesets.map(sortFilesInFileset);
}


function reset() {
  localStorage.removeItem("umlsKey");
  setUmlsKey('');
  setHasAuth(false);
  setError('');
}

function updateKey(event:any) {
  var value = event.target.value;
  setUmlsKey(value.trim());
}

function fileIcon(type:string) {
  return (
    <Box sx={{width:"50px",height:"50px"}} className="typeIcon">
      {iconAssociations[type as keyof typeof iconAssociations] || <FaTruck/>}
    </Box> 
  );
}

function tableBuilder(tableData: TableData) {
  const { name, description, documentation_url } = tableData;
  let files = tableData.data.files;
  let setName = tableData.name;
  return (
    <Box key = {name} sx={{ margin: "20px auto 0 auto",}}>
      <Box sx={{
        display: "flex",
        width:"100%",
        alignSelf: "flex-end",
        borderTopLeftRadius: "4px",
        borderTopRightRadius: "4px",
        background: "hsl(0 0% 23.14%)", 
        color: "white", 
        padding: "10px"}}>
        
        <Box sx={{display: "flex", flexShrink:2, paddingRight:"20px"}}>
          <h3 style={{margin:"0px"}}>{name}</h3>
          <a href={documentation_url} style={{
            color:"#fff"
          }} target="_blank" rel="noopener noreferrer">
          <LaunchIcon style={{width:"20px", marginLeft:"10px", alignSelf: "flex-end",}}/></a>
        </Box>
        
        <Box sx={{display: "flex",alignSelf: 'flex-end'}}>
          <Typography variant="caption" >{description}</Typography>
        </Box>
      </Box>
      
      <TableContainer sx={{ 
        minWidth: "550px",
        display: "block",
        width:'100%',
        backgroundColor: "#f5f5f5",
        border: "2px solid #5c5c5c",}}>
        <Table aria-label="simple table" size="small" sx={{tableLayout: "fixed"}}>
          <TableHead sx={{
            backgroundColor: "#ebebeb",
            borderBottom:"1px solid #5c5c5c",
            "& th": {
              fontWeight: "bold",
              color: "#444a65"}}}>
            <TableRow>
              <TableCell align="left" sx={{width:"84px!important"}} > </TableCell>
              <TableCell align="left" sx={{width:"105px!important"}}> Date </TableCell>
              <TableCell align="left" sx={{width:"249px!important"}}> File </TableCell>
              <TableCell align="left" sx={{width:"533px!important"}}> Type </TableCell>
              <TableCell align="left" sx={{width:"402px!important"}}> Description </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          {files.map((row:File, index: number) => (
            <TableRow key={row.name + "-" + index} sx={{"&:last-child td, &:last-child th": {border: 0}}} >
              <TableCell sx={{fontSize: "2rem!important"}}>{fileIcon(row.type)}</TableCell>
              <TableCell sx={{fontSize: "0.8rem!important"}}>{row.date}</TableCell>
              <TableCell sx={{fontSize: "0.8rem!important"}}>
                <a href={`${process.env.NEXT_PUBLIC_ASSETS_URL_BASE}${row.name}?umls-key=${umlsKey}`}>{row.name}</a><br />
                <span style={{color: "#555",verticalAlign: "middle",fontSize:"1rem!important",marginBottom:"5px"}}>
                  <FaFileArchive style={{margin:"0 5px 0 0px"}} />{row.size?row.size.zipped:"??? GB"} <FaBoxOpen style={{margin:"0 5px 0 2px"}} />{row.size?row.size.unzipped:"3.26 GB"}
                  </span>
              </TableCell>
              <TableCell sx={{fontSize: "0.8rem!important"}}>{row.typeDetail}</TableCell>
              <TableCell sx={{fontSize: "0.8rem!important"}}>{row.description}</TableCell>
            </TableRow>
          ))}
          </TableBody>
        </Table>
      </TableContainer>
    <Box sx={{
      display: "flex",
      width:"100%",
      fontSize: "0.8rem",
      alignSelf: "flex-end",
      borderBottomLeftRadius: "4px",
      borderBottomRightRadius: "4px",
      background: "#595959",
      border: "2px  solid #5c5c5c",
      borderTop:"0px",
      color: "white", 
      padding: "2px 8px"}}>
        Total Files: {files.length}
      </Box>
    </Box>)
}{}
        
function renderTables() {
  return (
    Object.keys(fileList).map((key, index) => {
      // name, data, columns
      let tableSet = {
        key: index,
        name: fileList[Number(key)].Name,
        data: fileList[Number(key)],
        columns: [
          { id: "name", label: "Name", },
          { id: "description", label:"Description",},
          { id: "date", label:"Date",},
          { id: "context", label:"Context",},
          { id: "documentation", label:"Documentation",},
        ],
        description:schema.contexts[Number(key)].description,
        documentation_url:schema.contexts[Number(key)].documentation_url,
      };
      return tableBuilder(tableSet);
    })
  )
}

function renderLicenceInfo() {
  return (
    <Alert className="alert alert-info" severity="info" role="alert" sx={{marginTop: "25px"}}>
      <h2 style={{marginTop:"-5px"}}>License requirements</h2>
      <Typography>
      The <a href="https://ubkg.docs.xconsortia.org/" target="_blank">Unified Biomedical Knowledge Graph (UBKG)</a> includes content from biomedical vocabularies that are maintained by the <a href="https://uts.nlm.nih.gov/uts/umls/home" target="_blank"> </a>National Library of Medicine. The use of content from the UMLS is governed by the <a href="https://uts.nlm.nih.gov/uts/assets/LicenseAgreement.pdf" target="_blank">UMLS License Agreement</a>.
      </Typography>
      <Typography> Use of the UMLS content in the UBKG requires two licenses:</Typography>
      <ol>
        <li>The University of Pittsburgh distributes content originating from the UMLS by means of a distributor license.</li>
        <li>Consumers of the UBKG have access to UMLS content through the license that is part of their <a href="https://uts.nlm.nih.gov/uts/" target="_blank">UMLS Technology Services</a> (UTS) accounts.</li>
      </ol>
      <Typography>
      This site combines the API key from the University of Pittsburgh with the API key from a user to authenticate a user's request to download the UBKG. The user must provide the API for their UTS account to the UBKG Download site.
      </Typography>
      <h3>To obtain a UTS API key</h3>
      <ol>
        <li>Create a <a href="https://uts.nlm.nih.gov/uts/" target="_blank"> UTS</a> user profile.</li>
        <li>Generate an API key.</li>
      </ol>
      
    {!hasAuth && (
      <>
        <Typography>Please provide your UMLS Key to access the downloadable files </Typography>
        <TextField
          label="UMLS Key"
          size="small"
          margin="dense"
          multiline
          fullWidth
          id="umlsKey"
          value={umlsKey}
          placeholder={umlsKey}
          disabled={umlsKey.length > 35 ? true : false}
          onChange={updateKey}
          sx={{
            backgroundColor:"white"
          }}
        />{" "}
        <br /> <br />
        <Button 
          variant="contained" 
          onClick={() => authCheck(umlsKey)} 
          sx={{ float: "right"}}>
            Submit
        </Button>
        <Button 
          variant="outlined"
          disabled={umlsKey.length > 0 ? false : true} 
          onClick={() => reset()} 
          sx={{
            float: "left", 
            background:'#f5f5f580',
            '&:hover': {backgroundColor: "#ffffffff"}}}>
            Reset
        </Button>
      </>
    )}
    </Alert>
  )
}

function renderFileView() {
  return (
      <Paper elevation={0} sx={{ margin: "20px auto", padding: "20px 20px", }}>
        {renderTables()}
      </Paper>
  )
}          
  function logout() {
    if (hasAuth) {
      return (<Box  sx={{ float: "right" }}><Typography sx={{display:"inline-block"}}>{umlsKey}</Typography> <Button variant="contained" onClick={reset}>Logout</Button></Box>);
    }
  }
  
  function topNav() {
    return (
      <AppBar id="header" sx={{ backgroundColor: "#444a65" }}>
      <Toolbar variant="dense">
      <Box><h1>UBKG Download</h1></Box>
      {<Box style={{ flex: 1 }}> {logout()}</Box>}
      </Toolbar>
      </AppBar>
    );
  }

  const fakeFiles = [{
      "Name": "base",
      "files": [{
          "name": "ubkg-neo4j-base19mar2025.zip",
          "description": "19 Mar 2025 Base context",
          "date": "2025-01-25",
          "context": "base",
          "type": "neo4j",
          "size":{
            "zipped": "3.26 GB",
            "unzipped": "21.85 GB"
          },
          "typeDetail": "Zip archive with turn-key Docker distribution of UBKG neo4j instance"
        },{
          "name": "ubkg-neo4j-base19mar2025.zip",
          "description": "19 Mar 2025 Base context",
          "date": "2025-01-02",
          "context": "base",
          "type": "neo4j",
          "size":{
            "zipped": "3.26 GB",
            "unzipped": "21.85 GB"
          },
          "typeDetail": "Zip archive with turn-key Docker distribution of UBKG neo4j instance"
        },{
          "name": "ubkg-neo4j-base19mar2025.zip",
          "description": "19 Mar 2025 Base context",
          "date": "2025-01-12",
          "context": "base",
          "type": "csv",
          "size":{
            "zipped": "3.26 GB",
            "unzipped": "21.85 GB"
          },
          "typeDetail": "Zip archive with turn-key Docker distribution of UBKG neo4j instance"
        }]
    },{
      "Name": "Data Distillery",
      "files": [{
          "name": "DataDistillery03Jan2025.zip",
          "description": "03 Jan 2025 Data Distillery - full distribution",
          "date": "2025-01-03",
          "context": "Data Distillery",
          "type": "neo4j",
          "size":{
            "zipped": "3.26 GB",
            "unzipped": "21.85 GB"
          },
          "typeDetail": "Zip archive with turn-key Docker distribution of UBKG neo4j instance"
        },
        {
          "name": "03Jan2025DD_csvs.zip",
          "description": "03 Jan 2025 Data Distillery",
          "date": "2025-02-03",
          "context": "Data Distillery",
          "type": "csv",
          "size":{
            "zipped": "3.26 GB",
            "unzipped": "21.85 GB"
          },
          "typeDetail": "Zip archive of ontology CSVs that can be used to generate a UBKG neo4j instance"
        },
        {
          "name": "DD_no_BIOMARKER03Jan2025.zip",
          "description": "03 Jan 2025 Data Distillery except for Biomarker",
          "date": "2025-03-03",
          "context": "Data Distillery",
          "type": "csv",
          "size":{
            "zipped": "3.26 GB",
            "unzipped": "21.85 GB"
          },
          "typeDetail": "Zip archive of ontology CSVs that can be used to generate a UBKG neo4j instance"
        },
        {
          "name": "DD_no_BIOMARKER03Jan2025.zip",
          "description": "03 Jan 2025 Data Distillery except for Biomarker",
          "date": "2025-04-03",
          "context": "Data Distillery",
          "type": "csv",
          "size":{
            "zipped": "3.26 GB",
            "unzipped": "21.85 GB"
          },
          "typeDetail": "Zip archive of ontology CSVs that can be used to generate a UBKG neo4j instance"
        },
        {
          "name": "DD_no_BIOMARKER03Jan2025.zip",
          "description": "03 Jan 2025 Data Distillery except for Biomarker",
          "date": "2025-12-03",
          "context": "Data Distillery",
          "type": "neo4j",
          "size":{
            "zipped": "3.26 GB",
            "unzipped": "21.85 GB"
          },
          "typeDetail": "Zip archive of ontology CSVs that can be used to generate a UBKG neo4j instance"
        },
        {
          "name": "DD_no_BIOMARKER03Jan2025.zip",
          "description": "03 Jan 2025 Data Distillery except for Biomarker",
          "date": "2025-07-03",
          "context": "Data Distillery",
          "type": "neo4j",
          "size":{
            "zipped": "3.26 GB",
            "unzipped": "21.85 GB"
          },
          "typeDetail": "Zip archive of ontology CSVs that can be used to generate a UBKG neo4j instance"
        },
        {
          "name": "DD_no_BIOMARKER03Jan2025.zip",
          "description": "03 Jan 2025 Data Distillery except for Biomarker",
          "date": "2025-03-03",
          "context": "Data Distillery",
          "type": "csv",
          "size":{
            "zipped": "3.26 GB",
            "unzipped": "21.85 GB"
          },
          "typeDetail": "Zip archive of ontology CSVs that can be used to generate a UBKG neo4j instance"
        }]
    },{
      "Name": "Petagraph",
        "files": [{
            "name": "Petagraph_May5_v514.dump",
            "description": "05 May 2024 v514 Petagraph release",
            "date": "2024-05-05",
            "context": "Petagraph",
            "type": "dump",
            "typeDetail": "neo4j dump of a Petagraph neo4j instance"
          },
          {
            "name": "Petagraph_May5_v514.cypher",
            "description": "05 May 2024 v514 Petagraph release",
            "date": "2024-10-05",
            "context": "Petagraph",
            "type": "cypher",
            "size":{
              "zipped": "3.26 GB",
              "unzipped": "21.85 GB"
            },
            "typeDetail": "cypher script to create the Petagraph neo4j instance"
          },
          {
            "name": "Petagraph_May5_v514.json",
            "description": "05 May 2024 v514 Petagraph release",
            "date": "2024-09-05",
            "context": "Petagraph",
            "type": "dump",
            "typeDetail": "JSON representation of the Petagraph data"
          }]
    }
  ]


  
  return (
    <Box>
      {topNav()}
      <Container maxWidth="xl" className="containerBox">
        <Box sx={{ padding: "20px;", margin: "30px auto" }}>
        {renderLicenceInfo()}
        {error && error.length > 0 && (
          <Alert sx={{marginTop: "20px"}} severity="error">{error}</Alert>
        )}
        {hasAuth && fileList.length > 0 && (
          <>{renderFileView()}</>
        )}
        </Box>
      </Container>
    </Box>
  );
};

  
export default Home;
          