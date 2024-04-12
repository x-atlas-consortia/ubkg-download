'use client'

import React, { useEffect, useState, useRef  } from "react";
import Container from '@mui/material/Container';
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import {Navigation} from './nav';
import Paper from '@mui/material/Paper';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import { useRouter } from 'next/router';
import {reqAuth} from './api/auth/token'
import {reqFiles} from './api/fileList'


const Home = (props) => {
  var [ubkgKey, setUbkgKey] = useState("");
  var [authState, setAuthState] = useState(false);
  var [fileList, setFileList] = useState([]);
  const router = useRouter()
  
  function authCheck() {
    console.debug('%c◉ ubkgKey ', 'color:#00ff7b', ubkgKey);
    reqAuth(ubkgKey)
    .then((res) => {
      console.log(res)
      if (res === true){
        console.debug('%c◉ TRUE ', 'color:#00ff7b');
        // router.push('/fileList', { scroll: false })
        reqFiles(ubkgKey)
        .then((res) => {
          console.log(res)
          setFileList(res)
          setAuthState(true)
        })
        .catch((err) => {
          console.log(err)
        })
      }
    })
    .catch((err) => {
      console.log(err)
    })
  }
  function updateKey(event) {
    setUbkgKey(event.target.value)
  }
  
  function renderTable () { 
    if(fileList.length === 0){

    }else{
      return (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell width={"50px"}  align="left">Size</TableCell>
                <TableCell align="left">Description</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {fileList.map((row) => (
                <TableRow
                  key={row.name}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.name}
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

  
  
  if(authState === false){
    return (
      <Box> 
        <Navigation />
        <Container maxWidth="lg" >
          <Box sx={{padding: "20px 30px;", margin:"0 auto"}}> 
  
          <Paper elevation={0} sx={{margin:"20px auto", padding:"20px 50px", maxWidth:"1000px"}}>
            
          <Typography> Please input your UBKG Key Below to access your Files  </Typography>
  
            <TextField id="ubkgKey" value={ubkgKey} onChange={updateKey} variant="standard" /> <br /> <br />
            <Button variant="contained" onClick={authCheck}>Submit</Button>
  
            </Paper>
  
          </Box>
        </Container>
      </Box>
    );
  }else{
    return (
      <Box> 
        <Navigation />
        <Container maxWidth="lg" >
          <Box sx={{padding: "20px 30px;", margin:"0 auto"}}> 
          <Paper elevation={0} sx={{margin:"20px auto", padding:"20px 50px", maxWidth:"1000px"}}>
            <Typography> Here are your files  </Typography> <br /><br />
            {renderTable()}
            </Paper>
          </Box>
        </Container>
      </Box>
    );
  }
}
export default Home;
