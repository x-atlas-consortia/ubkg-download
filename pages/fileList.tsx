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
import { useRouter } from 'next/router';
import {reqAuth} from './api/auth/token'


export default function FileList() {
  return (
    <Box> 
      <Navigation />
      <Container maxWidth="lg" >
        <Box sx={{padding: "20px 30px;", margin:"0 auto"}}> 

        <Paper elevation={0} sx={{margin:"20px auto", padding:"20px 50px", maxWidth:"1000px"}}>
          
        <Typography> Enjoy your files  </Typography>

          

          </Paper>

        </Box>
      </Container>
    </Box>
  );
}
