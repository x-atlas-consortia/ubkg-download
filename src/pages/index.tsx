'use client'

import React, { useEffect, useState, useRef  } from "react";
import Container from '@mui/material/Container';
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card';
import Grid from "@mui/material/Grid";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Alert from '@mui/material/Alert';
import GridLoader from "react-spinners/GridLoader";
import { getIcon } from 'material-file-icons';

import { useRouter } from 'next/router';
import {KeyAPI} from './api/auth/token'
import {FileList} from './api/fileList'
import Navigation from './nav';


const Home = (props) => {
  // var [serverMode, setServerMode] = useState("test");
  var [umlsKey, setUmlsKey] = useState("");
  var [authState, setAuthState] = useState(false);
  var [validState, setValidState] = useState(false);
  var [fileList, setFileList] = useState([]);
  const router = useRouter()
  

  
  useEffect(() => {
    var ls = localStorage.getItem('umlsKey');
    console.debug('%c◉ ls ', 'color:#00ff7b', ls);
    if(ls && ls !== ""){
      console.debug('%c◉ LS Not Empty ', 'color:#00ff7b', ls);
      setUmlsKey(localStorage.getItem("umlsKey") || "") 
      authCheck();
    }else if(ls && ls === ""){
      console.debug('%c◉ LS EMPTY ', 'color:#00ff7b', ls);
      setAuthState(false)
      setValidState(false)
    }else{
      console.debug('%c◉ NO LS ', 'color:#00ff7b', );
      //setAuthState(false)
      //setValidState(false)
    }
  }, []);

  
  function authCheck() {
    console.debug('%c◉ umlsKey ', 'color:#00ff7b', umlsKey);
    KeyAPI(umlsKey)
      .then((res) => {
        // console.log(res)
        //@TODO:  Here's where we check if they umls key is true
        // Currently just verifies we get the usual hello back from ingest API, 
        // A 200 response should likewise work regardless, 
        //  but there may be better things to check in the response
        if (res.status === 200){
          console.debug('%c◉ KeyAPI Res from index ', 'color:#00ff7b', res);
          localStorage.setItem("umlsKey",umlsKey);
          setAuthState(true)
          // Now that we're Valid, lets get the Files 
          fileGet();
        }else if(res.status === 403 || res.status === 401){
          // 401 / 403
          console.debug('%c◉ Invalid jey provided to KeyAPI in index ', 'color:#00ff7b', res.status);
          // How we'll handle other res, such as the invalids
          setValidState(false)
          setAuthState(true)
        }else{
          throw new Error
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }

  function fileGet() {
    FileList(umlsKey)
    .then((res) => {
      console.debug('%c◉ fileGet Success ', 'color:#c3fd7b', res);
      // @TODO: If you have to switch from using DATA to using RESPONSE in FileList
      // You will likelly need to extract the actual json from the request here
      // Something like req.response.data or req.data 
      var fileJson = JSON.parse(res) 
      console.debug('%c◉ fileJson ', 'color:#00ff7b', fileJson);
      setFileList(fileJson)
      setValidState(true)
    })
    .catch((err) => {
      console.log(err)        
    })
  } 

  function reload() {
    console.debug('%c◉ reload ', 'color:#00ff7b');
    if(localStorage.umlsKey){
      localStorage.removeItem(umlsKey)
      setUmlsKey("")
      setValidState(false)
      setAuthState(false)
    }
    //window.location.href = "/"
  }

  function updateKey(event) {
    setUmlsKey(event.target.value)
  }

  function fileIcon(filename) {
    return <div
      className="test"
      dangerouslySetInnerHTML={{ __html: getIcon(filename).svg }}
    />;
  }



  function renderInvalidView() {
    return( 
      <Alert severity="error">
        <Typography> Invalid UMLS License Key. Please obtain  a valid license key at: https://uts.nlm.nih.gov</Typography> <br /><br />
        <Button variant="contained" onClick={reload}>Try Again</Button>
      </Alert>
    );
  }


  
  function renderTable () { 
    // auth check asap to pre-loadya in there
    if(fileList.length === 0){
      return (<GridLoader color="#36d7b7" />);
    }else{
      console.debug('%c◉ fileList ', 'color:#00ff7b', fileList);
      return (
        <TableContainer component={Paper} sx={{ minWidth: "550px" }}>
          <Table size="small"  aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell width={"50px"} ></TableCell>
                <TableCell width={"200px"} >Name</TableCell>
                <TableCell width={"50px"}  align="left">Size</TableCell>
                <TableCell align="left">Description</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {fileList.map((row,index) => (
                <TableRow
                  key={row.name+"-"+row.index}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                  <TableCell  width={"50px"} align="left">{ fileIcon(row.name)}</TableCell>
                  <TableCell component="th" scope="row">
                    <a href={'https://assets.hubmapconsortium.org/umls-download/'+row.name+'?umls-key='+umlsKey}>{row.name}</a>
                  </TableCell>
                  <TableCell  width={"50px"} align="left">{row.size}</TableCell>
                  <TableCell align="left">{row.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      );
    }
  }

  function renderLoginView() {
    return (
      <Paper elevation={0} sx={{margin:"20px auto", padding:"20px 50px", maxWidth:"1000px"}}>
        <Grid
          container
          spacing={3}
          sx={{display:"flex",justifyContent:"flex-start",textAlign:"left"}}>
          <Grid item xs={6}>
            <Typography> Please provide your UMLS Key to access your Files </Typography>
            <Typography> To acquire a valid licence key, <br />Please visit: <a href="https://uts.nlm.nih.gov" target="_blank">https://uts.nlm.nih.gov</a></Typography> 
          </Grid>              
          <Grid item xs={6}>
            <TextField 
              label="UMLS Key"
              size="small"
              margin="dense"
              multiline
              fullWidth
              variant="filled"
              id="umlsKey" 
              value={umlsKey} 
              placeholder={umlsKey} 
              onChange={updateKey} /> <br /> <br />
              {validState === true && authState === true && fileList.length !== 0 && (
                <Button variant="contained" onClick={reload} sx={{float:"right"}}>Logout</Button>
              )}
              {authState === false && (
                <Button variant="contained" onClick={authCheck} sx={{float:"right"}}>Submit</Button>
              )}
          </Grid>
        </Grid>

        {validState === false  && authState === true  && (
           <>{renderInvalidView()}</>
        )}
        
        {validState === true && authState === true && fileList.length !== 0 &&(
          <>
            <Typography sx={{color:"rgb(99, 99, 99)"}}> Your Files: </Typography>
            {renderTable()}
          </>
        )}
      </Paper>
    );
  }

  
  
  return (
    <Box > 
      <Navigation />
      <Container maxWidth="lg" className="containerBox">
        <Box sx={{padding: "20px 30px;", margin:"30px auto"}}> 
          <Typography sx={{fontWeight: 300,fontSize: "2.3rem"}}>UMLS Downloads</Typography>
          <>{renderLoginView()}</>        
        </Box>
      </Container>
    </Box>
  );
  
}
  
export default Home;
