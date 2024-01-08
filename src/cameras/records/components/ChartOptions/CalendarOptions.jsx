import Grid from "@mui/material/Unstable_Grid2";
import Box from "@mui/system/Box";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
import {DateTimePicker} from "@mui/x-date-pickers/DateTimePicker";
import {TimePicker} from "@mui/x-date-pickers/TimePicker";
import {useState} from "react";
import {RecordsProps} from '../../data/RecordsProps'

export const CalendarOptionsYears = ({chartOptions, onChartOptionsChange}) => {
    const [beginYear, setBeginYear] = useState(chartOptions.beginYear);
    const [endYear, setEndYear] = useState(chartOptions.endYear);

    const onBeginYearChange = (newBeginYear) => {
        setBeginYear(newBeginYear);
        onChartOptionsChange({
            ...chartOptions,
            beginYear: newBeginYear,
        });
    };

    const onEndYearChange = (newEndYear) => {
        setEndYear(newEndYear);
        onChartOptionsChange({
            ...chartOptions,
            endYear: newEndYear,
        });
    };

    return (
        <Grid container direction='column' spacing={2}>
            <Grid>
                <Box>
                </Box>
            </Grid>
            <Grid container>
                <Grid xs={4}>
                    <Box>
                        <DateTimePicker
                            views={['year']}
                            value={beginYear}
                            disableFuture
                            onChange={onBeginYearChange}
                            slotProps={{
                                field: {
                                    clearable: true,
                                },
                            }}
                        />
                    </Box>
                </Grid>
                <Grid xs={4}>
                    <Box>
                        <DateTimePicker
                            views={['year']}
                            value={endYear}
                            disableFuture
                            onChange={onEndYearChange}
                            slotProps={{
                                field: {
                                    clearable: true,
                                },
                            }}
                        />
                    </Box>
                </Grid>
            </Grid>
        </Grid>
    );
}