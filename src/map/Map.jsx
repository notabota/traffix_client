import {
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query';

import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import './styles.css'
import MapLayer from "./components/MapLayer";

const queryClient = new QueryClient();

const Records = () => {
    return <QueryClientProvider client={queryClient}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <MapLayer/>
        </LocalizationProvider>
    </QueryClientProvider>
}

export default Records;