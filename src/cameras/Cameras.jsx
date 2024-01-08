import {
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query';

import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import CamerasTable from "./components/CamerasTable";

const queryClient = new QueryClient();

const Cameras = () => (
    <QueryClientProvider client={queryClient}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <CamerasTable/>
        </LocalizationProvider>
    </QueryClientProvider>
);

export default Cameras;