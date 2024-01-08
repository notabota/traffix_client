import Grid from "@mui/material/Unstable_Grid2";
import Box from "@mui/system/Box";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
import {DateTimePicker} from "@mui/x-date-pickers/DateTimePicker";
import {TimePicker} from "@mui/x-date-pickers/TimePicker";
import {useState} from "react";
import {ObjectsProps} from '../../data/ObjectsProps'

export const BarOptionsTimeStep = ({chartOptions, onChartOptionsChange}) => {
    const [objects, setObjects] = useState(chartOptions.objects);
    const [begin, setBegin] = useState(chartOptions.begin);
    const [end, setEnd] = useState(chartOptions.end);
    const [delta, setDelta] = useState(chartOptions.delta);

    const onObjectsChange = (event, newObjects) => {
        setObjects(newObjects);
        onChartOptionsChange({
            ...chartOptions,
            objects: newObjects,
        });
    };

    const onBeginChange = (newBegin) => {
        setBegin(newBegin);
        onChartOptionsChange({
            ...chartOptions,
            begin: newBegin,
        });
    };

    const onEndChange = (newEnd) => {
        setEnd(newEnd);
        onChartOptionsChange({
            ...chartOptions,
            end: newEnd,
        });
    };

    const onDeltaChange = (newDelta) => {
        setDelta(newDelta);
        onChartOptionsChange({
            ...chartOptions,
            delta: newDelta,
        });
    };

    const objectsToggleButtons = []
    Object.entries(ObjectsProps).forEach(([key, value]) => {
        objectsToggleButtons.push(
            <ToggleButton value={key}>
                {key}
            </ToggleButton>
        )
    })

    return (
        <Grid container direction='column' spacing={2}>
            <Grid>
                <Box>
                    <ToggleButtonGroup
                        value={objects}
                        onChange={onObjectsChange}
                        aria-label="text alignment"
                        fullWidth
                    >
                        {objectsToggleButtons}
                    </ToggleButtonGroup>
                </Box>
            </Grid>
            <Grid container>
                <Grid xs={4}>
                    <Box>
                        <DateTimePicker
                            views={['year', 'month', 'day', 'hours', 'minutes', 'seconds']}
                            ampm={false}
                            value={begin}
                            onChange={onBeginChange}
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
                            views={['year', 'month', 'day', 'hours', 'minutes', 'seconds']}
                            ampm={false}
                            value={end}
                            onChange={onEndChange}
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
                        <TimePicker views={['hours', 'minutes', 'seconds']}
                                    ampm={false}
                                    value={delta}
                                    onChange={onDeltaChange}
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