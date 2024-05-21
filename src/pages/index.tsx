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
import { getIcon } from "material-file-icons";
import { KeyAPI } from "../api/auth";
import { FileList } from "../api/files";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import prettyBytes from 'pretty-bytes';

const Home = (props) => {
    // var [serverMode, setServerMode] = useState("test");
    var [umlsKey, setUmlsKey] = useState('');
    var [keyError, setKeyError] = useState(false);
    var [hasAuth, setHasAuth] = useState(false);
    var [error, setError] = useState('');
    var [inputDisabled, setInputDisabled] = useState(false);
    var [fileList, setFileList] = useState([]);

    useEffect(() => {
        console.debug('%c◉ useEffect LS Get, sets umlskey ', 'color:#00ff7b', );
        const ls = localStorage.getItem("umlsKey");
        if (ls) {
            setUmlsKey(ls);
            FileList(ls)
                .then((res) => {
                    var fileJson = JSON.parse(res);
                    setFileList(fileJson);
                    setHasAuth(true);
                })
                .catch((err) => {   
                    console.debug('%c◉ err ', 'color:#ff005d', err);
                });
        }
    }, []);

    // useEffect(() => {
    //     console.debug('%c◉ useEffect LS Set if  ', 'color:#00ff7b', );
    //     if (umlsKey) {
    //         localStorage.setItem("umlsKey", umlsKey);
    //     }
    // }, [umlsKey]);

    function authCheck() {
        if(!localStorage.getItem("umlskey")){localStorage.setItem("umlsKey", umlsKey)}
        console.debug("%c◉ umlsKey ", "color:#00ff7b", umlsKey);
        if(umlsKey && umlsKey.length > 0 && umlsKey !== ''){
            KeyAPI(umlsKey)
            .then((res) => {
                console.debug(res);
                //@TODO:  Here's where we check if they umls key is true
                // Currently just verifies we get the usual hello back from ingest API,
                // A 200 response should likewise work regardless,
                //  but there may be better things to check in the response
                if (res.status === 200) {
                    console.debug(
                        "%c◉ KeyAPI Res from index ",
                        "color:#00ff7b",
                        res,
                    );
                    
                    localStorage.setItem("umlsKey", umlsKey);

                    setInputDisabled(true);
                    setHasAuth(true);
                    setError('');

                    // Now that we're Valid, lets get the Files
                    fileGet();
                } else if (res.status === 403 || res.status === 401) {
                    // 401 / 403
                    console.debug(
                        "%c◉ Invalid key provided to KeyAPI ",
                        "color:#00ff7b",
                        res.status,
                    );
                    // How we'll handle other res, such as the invalids
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
            setKeyError(true);
            setError('Please provide a valid UMLS License Key');
            console.debug('%c◉ NO KEY ', 'color:#ff005d', );
        }

    }

    function fileGet(providedKey) {
        var key = providedKey || umlsKey;
        FileList(umlsKey)
            .then((res) => {
                console.debug("%c◉ fileGet Success ", "color:#c3fd7b", res);
                // @TODO: If you have to switch from using DATA to using RESPONSE in FileList
                // You will likelly need to extract the actual json from the request here
                // Something like req.response.data or req.data
                var fileJson = JSON.parse(res);
                console.debug("%c◉ fileJson ", "color:#00ff7b", fileJson);
                setFileList(fileJson);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    function reset() {
        console.debug("%c◉ reset ", "color:#00ff7b");

        localStorage.removeItem("umlsKey");
        setUmlsKey('');
        setHasAuth(false);
        setInputDisabled(false);
        setError('');
    }

    function updateKey(event) {
        setUmlsKey(event.target.value);
    }

    function fileIcon(filename) {
        return (
            <div
                className="test"
                dangerouslySetInnerHTML={{ __html: getIcon(filename).svg }}
            />
        );
    }

    function renderTable() {
        // auth check asap to pre-loadya in there
        if (fileList.length === 0) {
            return <GridLoader color="#36d7b7" />;
        } else {
            console.debug("%c◉ fileList ", "color:#00ff7b", fileList);

            return (
                <TableContainer component={Paper} sx={{ minWidth: "550px" }}>
                    <Table size="big" aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="left" width={"7%"}></TableCell>
                                <TableCell align="left" width={"20%"}>Name</TableCell>
                                <TableCell align="left" width={"9%"}>Size</TableCell>
                                <TableCell align="left" width={"40%"}>Description</TableCell>
                                <TableCell align="left">Last Modified</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {fileList.map((row, index) => (
                                <TableRow
                                    key={row.name + "-" + row.index}
                                    sx={{"&:last-child td, &:last-child th": {border: 0}}}
                                >
                                    <TableCell>{fileIcon(row.name)}</TableCell>
                                    <TableCell><a href={`${process.env.NEXT_PUBLIC_ASSETS_URL_BASE}` + row.name + "?umls-key=" + umlsKey}>{row.name}</a></TableCell>
                                    <TableCell>{prettyBytes(row.size)}</TableCell>
                                    <TableCell>{row.description}</TableCell>
                                    <TableCell>{row.last_modified}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            );
        }
    }

    function renderLicenceInfo() {
        return (
            <Alert className="alert alert-info" severity="info" role="alert">
                <h2>License requirements</h2>
                <Typography>
                    The <a href="https://ubkg.docs.xconsortia.org/" target="_blank">Unified Biomedical Knowledge Graph (UBKG)</a> includes content from biomedical vocabularies that are maintained by the <a href="https://uts.nlm.nih.gov/uts/umls/home" target="_blank"> </a>National Library of Medicine. The use of content from the UMLS is governed by the <a href="https://github.com/x-atlas-consortia/ubkg-download/issues/url" target="_blank">UMLS License Agreement</a>.
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
                
                { ! hasAuth && (
                    <>
                        <TextField
                            label="UMLS Key"
                            size="small"
                            margin="dense"
                            multiline
                            fullWidth
                            // variant="filled"
                            id="umlsKey"
                            value={umlsKey}
                            placeholder={umlsKey}
                            disabled={inputDisabled}
                            onChange={updateKey}
                            sx={{
                                backgroundColor:"white"
                            }}
                        />{" "}
                        <br /> <br />
                        <Button variant="contained" onClick={() => authCheck()} sx={{ float: "right"}}>Submit</Button>
                    </>
                )}
            </Alert>
        )
    }
    function renderFileView() {
        console.debug('%c◉ hasAuth ', 'color:#00ff7b', hasAuth);
        console.debug('%c◉ fileList ', 'color:#00ff7b', fileList);
        return (
            <>
                {hasAuth && fileList.length > 0 && (
                    <Paper elevation={0} sx={{ margin: "20px auto", padding: "20px 20px", maxWidth: "1280px",}}>
                        <Typography sx={{ marginBottom: "20px" }}>Downloadable Files ({fileList.length}):</Typography>
                        {renderTable()}
                    </Paper>
                )}
            </>
        );
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
                    <>{renderFileView()}</>
                </Box>
            </Container>
        </Box>
    );
};

export default Home;
