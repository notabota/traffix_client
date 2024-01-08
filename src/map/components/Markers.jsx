import {Box} from "@mui/material";
import {Marker, Popup} from "react-leaflet";
import MarkerContent from "./MarkerContent";
import {useQuery} from "@tanstack/react-query";

const Markers = () => {
    const {
        data = [],
        isError,
        isRefetching,
        isLoading,
        refetch,
    } = useQuery({
        refetchInterval: (query) => {
    return query.state.error ? 0 : 10 * 1000
},
        queryKey: [
            'markers-data',
        ],
        queryFn: async () => {
            const query = `
                query Query {
                  cameras {
                    name
                    camera_type
                    url_type
                    lat
                    lng
                    counting_state
                    url
                    description
                  }
                }
            `
            const variables = {}

            const fetchURL = new URL(
                import.meta.env.VITE_API_HOST
            );

            const headers = new Headers();
            headers.append('Content-Type', 'application/json')

            const options = {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({query, variables})
            };

            const response = await fetch(fetchURL.href, options);
            const json = await response.json();
            return json['data']['cameras'];
        },
    });
    if (isLoading) return null;
    const markers = []
    for (let camera of data) {
        markers.push(
            <Marker position={{
                lat: camera.lat,
                lng: camera.lng
            }}>
                <Popup maxWidth="1000">
                    <Box>
                        <MarkerContent camera={camera}/>
                    </Box>
                </Popup>
            </Marker>
        )
    }
    return markers;
};

export default Markers