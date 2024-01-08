import * as React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import FunctionsIcon from '@mui/icons-material/Functions';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import {Stack} from "@mui/system";

export default function StatisticsTable({table}) {

    function getSpeedArray() {
        const speedArray = [];
        for (const row of table.getPrePaginationRowModel().rows) {
            speedArray.push(Number(row.original['speed']))
        }
        return speedArray
    }

    function getTableVariance() {
        const speedArray = getSpeedArray();
        if (speedArray.length < 2) {
            return undefined;
        }
        const n = speedArray.length;
        const mean = speedArray.reduce((a, b) => a + b) / n;
        return speedArray.map((x) => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / (n - 1)
    }

    function getTableStandardDeviation() {
        return Math.sqrt(
            getTableVariance()
        );
    }

    function getTableAverage() {
        const speedArray = getSpeedArray();
        const sumSpeed = speedArray.reduce((a, b) => a + b, 0);
        return sumSpeed / speedArray.length
    }

    return (
        <Box
            sx={{width: '100%', maxWidth: 360, bgcolor: 'background.paper', marginTop: '20px'}}>
            <List component={Stack} direction="row">
                <ListItem disablePadding>
                    <ListItemButton>
                        <ListItemIcon>
                            <FunctionsIcon/>
                        </ListItemIcon>
                        <ListItemText sx={{
                            width: '100vw'
                        }} primary="Average" secondary={
                            Math.round((getTableAverage() + Number.EPSILON) * 1000) / 1000
                        }/>
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton>
                        <ListItemIcon>
                            <EqualizerIcon/>
                        </ListItemIcon>
                        <ListItemText sx={{
                            width: '100vw'
                        }} primary="Standard deviation" secondary={
                            Math.round((getTableStandardDeviation() + Number.EPSILON) * 1000) / 1000
                        }/>
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton>
                        <ListItemIcon>
                            <ShowChartIcon/>
                        </ListItemIcon>
                        <ListItemText sx={{
                            width: '100vw'
                        }} primary="Variance" secondary={
                            Math.round((getTableVariance() + Number.EPSILON) * 1000) / 1000
                        }/>
                    </ListItemButton>
                </ListItem>
            </List>
        </Box>
    );
}