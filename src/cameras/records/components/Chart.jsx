import Calendar from "./Chart/Calendar";
import Table from "./Table";

const Chart = ({recordsData, chartType, chartSubtype, chartOptions}) => {
    if (chartType === 'calendar') {
        return <Calendar recordsData={recordsData} chartSubtype={chartSubtype} chartOptions={chartOptions}/>;
    }
    if (chartType === 'table') {
        return <Table recordsData={recordsData}/>;
    }
};

export default Chart