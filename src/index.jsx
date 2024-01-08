import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Map from './map/Map';
import Records from "./records/Records"
import RecordObjects from "./records/objects/RecordObjects";
import Cameras from "./cameras/Cameras";
import Objects from "./objects/Objects"

import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import {createTheme, ThemeProvider} from '@mui/material/styles';
import CameraRecords from "./cameras/records/CameraRecords";

const theme = createTheme({
    typography: {
        fontFamily: 'Montserrat, monospace',
    },
});

const router = createBrowserRouter([
    {
        path: "/",
        element: <Map/>,
    },
    {
        path: "/records",
        element: <Records/>,
    },
    {
        path: "/records/:recordID",
        element: <RecordObjects/>,
    },
    {
        path: "/cameras",
        element: <Cameras/>,
    },
    {
        path: "/cameras/:cameraID",
        element: <CameraRecords/>,
    },
    {
        path: "/objects",
        element: <Objects/>,
    },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <RouterProvider router={router}/>
        </ThemeProvider>
    </React.StrictMode>
);
