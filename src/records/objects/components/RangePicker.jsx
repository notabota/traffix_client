import Box from "@mui/material/Box";
import {DateTimePicker} from "@mui/x-date-pickers/DateTimePicker";

const RangePicker = ({begin, onBeginChange, end, onEndChange, ...props}) => {
    return (
        <Box
            sx={{
                display: 'grid',
                gap: '1rem',
                gridTemplateColumns: '1fr 1fr',
            }}
        >
            <DateTimePicker
                views={['year', 'month', 'day', 'hours', 'minutes', 'seconds']}
                value={begin}
                ampm={false} autoOk
                allowKeyboardControl
                format="DD-MM-YY HH:mm:ss"
                onChange={(event) => {
                    onBeginChange(event);
                    props.column.setFilterValue([event, end])
                }}
                slotProps={{
                    field: {
                        clearable: true,
                        onClear: () => {
                            props.column.setFilterValue([null, end])
                        },
                    },
                }}
                sx={{width: '100%'}}
            />
            <DateTimePicker
                views={['year', 'month', 'day', 'hours', 'minutes', 'seconds']}
                value={end}
                ampm={false} autoOk
                allowKeyboardControl
                format="DD-MM-YY HH:mm:ss"
                onChange={(event) => {
                    onEndChange(event);
                    props.column.setFilterValue([begin, event])
                }}
                slotProps={{
                    field: {
                        clearable: true,
                        onClear: () => {
                            props.column.setFilterValue([begin, null])
                        },
                    },
                }}
                sx={{width: '100%'}}
            />
        </Box>
    );
};

export default RangePicker