import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Map from './map/Map';
import Records from "./records/Records"
import RecordObjects from "./records/objects/RecordObjects";
import Objects from "./objects/Objects"

import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import {createTheme, ThemeProvider} from '@mui/material/styles';

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
        element: <Objects/>,
    }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <RouterProvider router={router}/>
        </ThemeProvider>
    </React.StrictMode>
);
