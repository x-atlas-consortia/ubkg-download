import React,{useEffect, useState} from "react";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

// import UploadsForm from "./components/uploads/createUploads";
// export const Navigation = () => {
export default function Navigation (props : { children : string }) { 

  var [umlsKey, setUbkgKey] = useState("");
  var [authState, setAuthState] = useState(false);
  
  useEffect(() => {
    var ls = localStorage.getItem('umlsKey');
    console.debug('%c◉ ls ', 'color:#00ff7b', ls);
    setUbkgKey(localStorage.getItem("umlsKey") || "") 
  }, []);

  function renderAccountMenu() {
    console.debug('%c◉ umlsKey ', 'color:#00ff7b', umlsKey);
    // var [umlsKey] = useState(props.umlsKey ? props.umlsKey() : null;);
    if(umlsKey!== ""){
      return  ( <Typography >Your Key: {umlsKey}</Typography>)
    }else{
      return  (<Button color="inherit">Login</Button>)
    }
}
    


  return (
      <AppBar id="header" sx={{backgroundColor:"#444a65"}}>
        <Container maxWidth="xl">
            <Toolbar disableGutters sx={{width:"100%", display:"inline-block", height:"60px", padding:"10px 0"}}>
 
              <Box sx={{ float:"left"}}>
                <Typography >
                  <a className="navbar-brand" href="/">
                    <img
                      src="https://hubmapconsortium.org/wp-content/uploads/2020/09/hubmap-type-white250.png"
                      height="40"
                      className="d-inline-block align-top"
                      id="MenuLogo"
                      alt="HuBMAP logo"
                    />
                  </a>
                </Typography>
              </Box>
              {/* 
                <Box sx={{float:"right"}}>
                {renderAccountMenu()}
              </Box>
              */} 
          </Toolbar>
        </Container>
      </AppBar>
  );
}
