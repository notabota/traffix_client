import Box from "@mui/system/Box";
import Grid from "@mui/material/Unstable_Grid2";
import Chart from "./Chart";
import ChartSelections from "./ChartSelections";
import ChartOptions from "./ChartOptions";
import {useState} from "react";
import {SubtypeOptions} from "../data/Options";
import {useQuery} from "@tanstack/react-query";
import {ObjectsProps} from "../data/ObjectsProps";
import {useParams} from "react-router-dom";

const Visual = () => {
    const {recordID} = useParams();

    const [chartType, setChartType] = useState('table')
    const [chartSubtype, setChartSubtype] = useState(SubtypeOptions['table'][0])
    const [chartOptions, setChartOptions] = useState({
        objects: Object.keys(ObjectsProps),
    })


    const onChartTypeChange = (event, newChartType) => {
        setChartType(newChartType)
        setChartSubtype(SubtypeOptions[newChartType][0])
        setChartOptions({
            objects: Object.keys(ObjectsProps),
        })
    }

    const onChartSubtypeChange = (event, newChartSubtype) => {
        setChartSubtype(newChartSubtype)
        setChartOptions({
            objects: Object.keys(ObjectsProps),
        })
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
                    query Record($recordId: ID!, $sort: String) {
                      record(id: $recordId) {
                        objects(sort: $sort) {
                          id
                          speed
                          ts
                          type
                        }
                        id
                        name
                        begin_ts
                        end_ts
                        description
                      }
                    }
                `
            const variables = {
                recordId: recordID,
                sort: "ts:asc"
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

    let objectsData, recordData;
    if (data['record'] !== null) ({objects: objectsData, ...recordData} = data['record'])
    else return <h1>Invalid record ID</h1>
    // const recordData = data['record'];
    // const objectsData = recordData['objects'];

    const ChartLayout = () => {
        if (chartType === null) return <h1> Select chart type</h1>
        if (chartSubtype === null) return <h1> Select chart subtype</h1>
        return <Chart objectsData={objectsData}
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