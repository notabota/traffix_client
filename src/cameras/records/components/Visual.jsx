import Box from "@mui/system/Box";
import Grid from "@mui/material/Unstable_Grid2";
import Chart from "./Chart";
import ChartSelections from "./ChartSelections";
import ChartOptions from "./ChartOptions";
import {useState} from "react";
import {SubtypeOptions} from "../data/Options";
import {useQuery} from "@tanstack/react-query";
import {RecordsProps} from "../data/RecordsProps";
import {useParams} from "react-router-dom";

const Visual = () => {
    const {cameraID} = useParams();

    const [chartType, setChartType] = useState('table')
    const [chartSubtype, setChartSubtype] = useState(SubtypeOptions['table'][0])
    const [chartOptions, setChartOptions] = useState({})


    const onChartTypeChange = (event, newChartType) => {
        setChartType(newChartType)
        setChartSubtype(SubtypeOptions[newChartType][0])
        setChartOptions({})
    }

    const onChartSubtypeChange = (event, newChartSubtype) => {
        setChartSubtype(newChartSubtype)
        setChartOptions({})
    }

    const onChartOptionsChange = (newChartOptions) => {
        setChartOptions({...newChartOptions})
    }

    const {
        data = [],
        isLoading,
    } = useQuery({
        refetchInterval: (query) => {
            return query.state.error ? 0 : 10 * 1000
        },
        queryKey: [
            'table-data',
        ],
        queryFn: async () => {
            const fetchURL = new URL(
                import.meta.env.VITE_API_HOST
            );

            const headers = new Headers();
            // headers.append('pragma', 'no-cache');
            // headers.append('cache-control', 'no-cache');
            headers.append('Content-Type', 'application/json')

            const query = `
                    query Camera($cameraId: ID!) {
                      camera(id: $cameraId) {
                        records {
                          id
                          name
                          begin_ts
                          end_ts
                          description
                        }
                        id
                        name
                        lat
                        lng
                        camera_type
                        counting_state
                        url
                        description
                      }
                    }
                `
            const variables = {
                cameraId: cameraID,
                sort: "end_ts:desc",
            }
            const options = {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({query, variables})
            };
            const response = await fetch(fetchURL.href, options);
            const json = await response.json();
            return json['data'];
        },
    });

    if (isLoading) {
        return <span>Loading...</span>
    }

    let recordsData, cameraData;
    if (data['camera'] !== null) ({records: recordsData, ...cameraData} = data['camera'])
    else return <h1>Invalid record ID</h1>
    // const cameraData = data['record'];
    // const recordsData = cameraData['objects'];

    const ChartLayout = () => {
        if (chartType === null) return <h1> Select chart type</h1>
        if (chartSubtype === null) return <h1> Select chart subtype</h1>
        return <Chart recordsData={recordsData}
                      chartType={chartType} chartSubtype={chartSubtype} chartOptions={chartOptions}
        />
    }

    const ChartProperties = () => {
        if (chartType === 'table') return;
        return <ChartOptions
            chartOptions={chartOptions}
            onChartOptionsChange={onChartOptionsChange}
            chartType={chartType}
            chartSubtype={chartSubtype}
        />
    }

    return <>
        <Box sx={{height: '70vh', overflow: 'scroll'}}>
            <ChartLayout/>
        </Box>
        <Grid container sx={{
            paddingTop: '30px',
        }}>
            <Grid container xs={4} direction='column'>
                <ChartSelections
                    chartType={chartType} onChartTypeChange={onChartTypeChange}
                    chartSubtype={chartSubtype} onChartSubtypeChange={onChartSubtypeChange}
                />
            </Grid>
            <Grid container xs={8} sx={{
                alignItems: 'center'
            }}>
                <Grid xs={10}>
                    <Box
                    >
                        <ChartProperties/>
                    </Box>
                </Grid>
            </Grid>
        </Grid>
    </>
}

export default Visual