import * as React from 'react';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import PhotoCameraFrontIcon from '@mui/icons-material/PhotoCameraFront';
import SdStorageIcon from '@mui/icons-material/SdStorage';
import CommuteIcon from '@mui/icons-material/Commute';
import ShareIcon from '@mui/icons-material/Share';
import {useNavigate} from "react-router-dom";

export default function MapOptions() {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const navigate = useNavigate();

    const actions = [
        {
            icon: <PhotoCameraFrontIcon/>, name: 'Cameras', onClick: () => {
                window.open('/cameras', '_blank')
            }
        },
        {
            icon: <SdStorageIcon/>, name: 'Records', onClick: () => {
                window.open('/records', '_blank')
            }
        },
        {icon: <CommuteIcon/>, name: 'Objects', onClick: () => {
                window.open('/objects', '_blank')
            }},
        {
            icon: <ShareIcon/>, name: 'Share', onClick: () => {

            }
        },
    ];


    return (
        <SpeedDial
            ariaLabel="SpeedDial controlled open example"
            sx={{position: 'absolute', bottom: 16, right: 16}}
            icon={<SpeedDialIcon/>}
            onClose={handleClose}
            onOpen={handleOpen}
            open={open}
        >
            {actions.map((action) => (
                <SpeedDialAction
                    key={action.name}
                    icon={action.icon}
                    tooltipTitle={action.name}
                    onClick={action.onClick}
                />
            ))}
        </SpeedDial>
    );
}