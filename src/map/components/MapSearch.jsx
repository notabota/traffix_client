import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

export default function MapSearch({camera, onCameraChange}) {
    return (
        <Autocomplete
            fullWidth
            options={top100Films}
            value={camera}
            onChange={onCameraChange}
            sx={{width: 300}}
            renderInput={(params) =>
                <TextField variant="filled" {...params} label="Cam Search"/>}
            isOptionEqualToValue={(option, value) => option.id === value.id}
        />
    );
}

// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
const top100Films = [
    {
        label: 'Chung cư 12T1',
        lat: 16.091181,
        lng: 108.232445
    },
];