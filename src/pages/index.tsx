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
    var [hasAuth, setHasAuth] = useState(false);
    var [error, setError] = useState('');
    var [inputDisabled, setInputDisabled] = useState(false);
    var [fileList, setFileList] = useState([]);

    useEffect(() => {
        const ls = localStorage.getItem("umlsKey");

        if (ls) {
            setUmlsKey(ls);
        }
    }, []);

    useEffect(() => {
        if (umlsKey) {
            localStorage.setItem("umlsKey", umlsKey);
        }
    }, [umlsKey]);

    function authCheck() {
        console.debug("%c◉ umlsKey ", "color:#00ff7b", umlsKey);

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
    }

    function fileGet() {
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

    function renderError(errorMsg) {
        if (errorMsg) {
            return (
                <Alert sx={{marginTop: "20px"}} severity="error">{errorMsg}</Alert>
            );
        }
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

    function renderLoginView() {
        return (
            <Paper elevation={0} sx={{ margin: "20px auto", padding: "20px 20px", maxWidth: "1280px",}}>
                <Grid container spacing={3} sx={{display: "flex", justifyContent: "flex-start", textAlign: "left",}}>
                    <Grid item xs={6}>
                        <Typography>
                            {" "}
                            Please provide your UMLS Key to access the downloadble files{" "}
                        </Typography>
                        <Typography>
                            {" "}
                            To acquire a valid licence key, please visit:{" "}
                            <a href="https://uts.nlm.nih.gov" target="_blank">https://uts.nlm.nih.gov</a>
                        </Typography>
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
                            disabled={inputDisabled}
                            onChange={updateKey}
                        />{" "}
                        <br /> <br />
                        { ! hasAuth && (
                            <Button variant="contained" onClick={authCheck} sx={{ float: "right" }}>Submit</Button>
                        )}
                    </Grid>
                </Grid>

                <>{renderError(error)}</>

                {hasAuth && fileList.length > 0 && (
                        <>
                            <Typography sx={{ marginBottom: "20px" }}>Downloadable Files ({fileList.length}):</Typography>
                            {renderTable()}
                        </>
                    )}
            </Paper>
        );
    }

    function logout() {
        if (hasAuth) {
            return (<Button variant="contained" onClick={reset} sx={{ float: "right" }}>Logout</Button>);
        }
    }

    function topNav() {
        return (
            <AppBar id="header" sx={{ backgroundColor: "#444a65" }}>
                <Toolbar variant="dense">
                    <Box><h1>UBKG Download</h1></Box>
                    {<Box style={{ flex: 1 }}>{logout()}</Box>}
                </Toolbar>
            </AppBar>
        );
    }

    return (
        <Box>
            {topNav()}
            <Container maxWidth="xl" className="containerBox">
                <Box sx={{ padding: "20px;", margin: "30px auto" }}>
                    <>{renderLoginView()}</>
                </Box>
            </Container>
        </Box>
    );
};

export default Home;
