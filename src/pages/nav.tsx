import React,{useEffect} from "react";
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

export const Navigation = () => {
  
  useEffect(() => {
    
  }, []);


  return (
      <AppBar position="static" id="header" sx={{backgroundColor:"#444a65"}}>
        
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Typography>
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
               
        </Toolbar>
      </Container>
    </AppBar>
  );
}
