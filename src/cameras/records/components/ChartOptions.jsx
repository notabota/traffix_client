import {CalendarOptionsYears} from "./ChartOptions/CalendarOptions";

const ChartOptions = ({chartOptions, onChartOptionsChange, chartType, chartSubtype}) => {
    if (chartType === null || chartSubtype === null) return;
    if (chartType === 'calendar') {
        if (chartSubtype.id === 0) {
            return <CalendarOptionsYears chartOptions={chartOptions}
                                         onChartOptionsChange={onChartOptionsChange}
            />
        }
    }
}

export default ChartOptions