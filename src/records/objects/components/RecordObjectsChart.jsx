import {useQuery} from "@tanstack/react-query";
import LineChart from "./Chart/LineChart";
import BarChart from "./Chart/BarChart";
import PieChart from "./Chart/PieChart";
import RecordObjectsTable from "./RecordObjectsTable";

const RecordObjectsChart = ({objectsData, chartType, chartSubtype, chartOptions}) => {
    if (chartType === 'line') {
        return <LineChart objectsData={objectsData} chartSubtype={chartSubtype} chartOptions={chartOptions}/>;
    }
    if (chartType === 'bar') {
        return <BarChart objectsData={objectsData} chartSubtype={chartSubtype} chartOptions={chartOptions}/>;
    }
    if (chartType === 'pie') {
        return <PieChart objectsData={objectsData} chartSubtype={chartSubtype} chartOptions={chartOptions}/>;
    }
    if (chartType === 'table') {
        return <RecordObjectsTable objectsData={objectsData}/>;
    }
};

export default RecordObjectsChart