"use client";

import React, { useEffect, useState, useRef } from "react";
import Container from "@mui/material/Container";
import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Alert from "@mui/material/Alert";
import GridLoader from "react-spinners/GridLoader";
import { KeyAPI } from "../api/auth";
import { FileListProviderUpgrade } from "../api/files";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import prettyBytes from 'pretty-bytes';
import LaunchIcon from '@mui/icons-material/Launch';
import IconButton from '@mui/material/IconButton';
import { getIcon } from "material-file-icons";

import { FaOctopusDeploy } from "react-icons/fa";
import { GrDocker } from "react-icons/gr";
import { FaTruck } from "react-icons/fa";
import { BsBoxSeamFill } from "react-icons/bs";
import { FaFileCsv } from "react-icons/fa6";
import { DiDocker } from "react-icons/di";

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
    setFileList(groupedByContext);
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
          <Table  aria-label="simple table" size="small" >
          <TableHead sx={{
            backgroundColor: "#ebebeb",
            borderBottom:"1px solid #5c5c5c",
            "& th": {
              fontWeight: "bold",
              color: "#444a65"}}}>
            <TableRow>
              <TableCell align="left"></TableCell>
              <TableCell align="left" width={"7%"}>Date</TableCell>
              <TableCell align="left" >File</TableCell>
              <TableCell align="left" >Type</TableCell>
              <TableCell align="left" width={"30%"}>Description</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          {files.map((row:File, index: number) => (
            <TableRow key={row.name + "-" + index} sx={{"&:last-child td, &:last-child th": {border: 0}}} >
              <TableCell sx={{fontSize: "2rem!important"}}>{fileIcon(row.type)}</TableCell>
              <TableCell sx={{fontSize: "0.8rem!important"}}>{row.date}</TableCell>
              <TableCell sx={{fontSize: "0.8rem!important"}}><a href={`${process.env.NEXT_PUBLIC_ASSETS_URL_BASE}${row.name}?umls-key=${umlsKey}`}>{row.name}</a></TableCell>
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
          