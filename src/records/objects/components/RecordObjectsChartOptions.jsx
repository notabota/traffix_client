import {LineOptionsLinear, LineOptionsTimeStep} from "./ChartOptions/LineOptions";
import {BarOptionsTimeStep} from "./ChartOptions/BarOptions";
import {PieOptionsTimeLinear} from "./ChartOptions/PieOptions";

const RecordObjectsChartOptions = ({chartOptions, onChartOptionsChange, chartType, chartSubtype}) => {
    if (chartType === null || chartSubtype === null) return;
    if (chartType === 'line') {
        if (chartSubtype.id === 0) {
            return <LineOptionsLinear chartOptions={chartOptions}
                                      onChartOptionsChange={onChartOptionsChange}
            />
        }
        if (chartSubtype.id === 1) {
            return <LineOptionsTimeStep chartOptions={chartOptions}
                                        onChartOptionsChange={onChartOptionsChange}
            />
        }
    }
    if (chartType === 'bar') {
        if (chartSubtype.id === 0) {
            return <BarOptionsTimeStep chartOptions={chartOptions}
                                       onChartOptionsChange={onChartOptionsChange}
            />
        }
    }
    if (chartType === 'pie') {
        if (chartSubtype.id === 0) {
            return <PieOptionsTimeLinear chartOptions={chartOptions}
                                         onChartOptionsChange={onChartOptionsChange}
            />
        }
    }
}

export default RecordObjectsChartOptions