import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
import SsidChartIcon from "@mui/icons-material/SsidChart";
import BarChartIcon from "@mui/icons-material/BarChart";
import PieChartIcon from "@mui/icons-material/PieChart";
import TableChartIcon from "@mui/icons-material/TableChart";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Unstable_Grid2";
import Box from "@mui/system/Box";
import {SubtypeOptions} from '../data/Options'

const ChartTypesSelection = ({chartType, onChartTypeChange}) => {
    return (
        <ToggleButtonGroup
            value={chartType}
            exclusive
            onChange={onChartTypeChange}
            aria-label="text alignment"
            fullWidth
            color="primary"
        >
            <ToggleButton value="table" aria-label="table">
                <TableChartIcon/>
            </ToggleButton>
            <ToggleButton value="line" aria-label="line">
                <SsidChartIcon/>
            </ToggleButton>
            <ToggleButton value="bar" aria-label="bar">
                <BarChartIcon/>
            </ToggleButton>
            <ToggleButton value="pie" aria-label="pie">
                <PieChartIcon/>
            </ToggleButton>
        </ToggleButtonGroup>
    );
}

const ChartSubtypeSelection = ({chartType, chartSubtype, onChartSubtypeChange}) => {
    return (
        <Autocomplete
            fullWidth
            options={SubtypeOptions[chartType]}
            value={chartSubtype}
            onChange={onChartSubtypeChange}
            renderInput={(params) => <TextField {...params} label="Chart Subtype"/>}
            isOptionEqualToValue={(option, value) => option.id === value.id}
        />
    );
}

const ChartSelections = ({chartType, onChartTypeChange, chartSubtype, onChartSubtypeChange}) => {
    return (
        <Grid container direction='column' spacing={2} sx={{
            alignItems: 'center'
        }}>
            <Grid xs={6}>
                <Box>
                    <ChartTypesSelection chartType={chartType} onChartTypeChange={onChartTypeChange}/>
                </Box>
            </Grid>
            <Grid xs={6}>
                <Box
                >
                    <ChartSubtypeSelection
                        chartType={chartType} chartSubtype={chartSubtype}
                        onChartSubtypeChange={onChartSubtypeChange}
                    />
                </Box>
            </Grid>
        </Grid>
    )
}

export default ChartSelections