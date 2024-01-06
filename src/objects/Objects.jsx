import {
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query';

import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import ObjectsTable from "./components/ObjectsTable";

const queryClient = new QueryClient();

const Objects = () => (
    <QueryClientProvider client={queryClient}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <ObjectsTable/>
        </LocalizationProvider>
    </QueryClientProvider>
);

export default Objects;