import {
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query';

import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import Visual from "./components/Visual";

const queryClient = new QueryClient();

const RecordObjects = () => (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
        <QueryClientProvider client={queryClient}>
            <Visual/>
        </QueryClientProvider>
    </LocalizationProvider>
);

export default RecordObjects;