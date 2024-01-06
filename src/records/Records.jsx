import {
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query';

import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import RecordsTable from "./components/RecordsTable";

const queryClient = new QueryClient();

const Records = () => (
    <QueryClientProvider client={queryClient}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <RecordsTable/>
        </LocalizationProvider>
    </QueryClientProvider>
);

export default Records;