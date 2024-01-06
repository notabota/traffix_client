import {DateTimePicker} from "@mui/x-date-pickers/DateTimePicker";

const TimestampPicker = ({date, onDateChange, ...props}) => {
    return (
        <DateTimePicker
            views={['year', 'month', 'day', 'hours', 'minutes', 'seconds']}
            value={date}
            ampm={false} autoOk
            allowKeyboardControl
            format="DD-MM-YY HH:mm:ss"
            onChange={(event) => {
                onDateChange(props, event)
            }}
            slotProps={{
                field: {
                    clearable: true,
                    onClear: () => {
                        onDateChange(props, null)
                    },
                },
            }}
            sx={{width: '100%'}}
        />
    );
};

export default TimestampPicker