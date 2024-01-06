import L from 'leaflet'
import MarkerIcon from 'leaflet/dist/images/marker-icon.png'
import MarkerShadow from 'leaflet/dist/images/marker-shadow.png'
import Box from "@mui/system/Box";
import 'leaflet/dist/leaflet.css'
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    LayersControl,
    Circle,
    Rectangle,
    LayerGroup,
    FeatureGroup
} from 'react-leaflet'
import {useState} from 'react'

import MarkerContent from './MarkerContent'
import MapSearch from './MapSearch'
import MapOptions from "./MapOptions";
import MapSelections from "./MapSelections";
import Markers from "./Markers";

const MapLayer = () => {

    const [map, setMap] = useState(null);
    const [camera, setCamera] = useState(null);

    const onCameraChange = (event, newCamera) => {
        setCamera(newCamera)
        console.log(map)
        map.flyTo(center, 16)
    }

    const center = {
        lat: 16.074117,
        lng: 108.216099
    }

    const GetMyLocation = () => {
        const getMyLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                    console.log([position.coords.latitude, position.coords.longitude])
                })
            } else {
                console.log("Geolocation is not supported by this browser.")
            }
        }

        return (
            <div className="get-my-location">
                <button onClick={getMyLocation}>Get My Location</button>
            </div>
        )
    }

    return (
        <div>
            <Box>
                <MapContainer style={{
                    height: '100vh',
                    width: '100vw',
                    top: '0',
                    zIndex: '-1',
                    position: 'absolute'
                }} center={center} zoom={16} ref={setMap}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <LayersControl position="topright">
                        <LayersControl.Overlay checked name="Camera">
                            {Markers()}
                        </LayersControl.Overlay>
                        <LayersControl.Overlay checked name="Khu vực">
                            <LayerGroup>
                                <Circle
                                    center={center}
                                    pathOptions={{fillColor: 'blue'}}
                                    radius={200}
                                />
                                <Circle
                                    center={center}
                                    pathOptions={{fillColor: 'red'}}
                                    radius={100}
                                    stroke={false}
                                />
                                <LayerGroup>
                                    <Circle
                                        center={center}
                                        pathOptions={{color: 'green', fillColor: 'green'}}
                                        radius={100}
                                    />
                                </LayerGroup>
                            </LayerGroup>
                        </LayersControl.Overlay>
                    </LayersControl>
                </MapContainer>
            </Box>
            <Box sx={{
                position: 'absolute',
                zIndex: '1',
                left: '80px',
                top: '15px',
                background: "white"
            }}>
                <MapSearch camera={camera} onCameraChange={onCameraChange}/>
            </Box>
            <Box sx={{
                position: 'absolute',
                zIndex: '1',
                left: '100px',
                bottom: '0px',
            }}>
                <MapOptions/>
            </Box>
            <Box sx={{
                position: 'absolute',
                zIndex: '1',
                right: '25px',
                bottom: '25px',
            }}>
                <MapSelections/>
            </Box>
        </div>
    )
}

export default MapLayer