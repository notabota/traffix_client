import {ResponsivePie} from '@nivo/pie'
import dayjs from "dayjs";
import {ObjectsProps} from "../..//data/ObjectsProps";

const PieChart = ({objectsData, chartSubtype, chartOptions}) => {
    const chartData = [];
    const objectsName = [];
    const pieChartOptions = {...chartOptions}
    const objectsTimestamp = {};

    if (pieChartOptions.begin === null) {
        pieChartOptions.begin = dayjs(objectsData[0].ts)
    }
    if (pieChartOptions.end === null) {
        pieChartOptions.end = dayjs(objectsData.at(-1).ts)
    }
    pieChartOptions.begin = pieChartOptions.begin.valueOf()
    pieChartOptions.end = pieChartOptions.end.valueOf()

    const filteredData = [];
    for (const object of objectsData) {
        if (chartOptions.objects.includes(object.type)) {
            filteredData.push(object)
        }
    }

    if (chartSubtype.id === 0) {
        const objectsCount = {};
        for (const object of filteredData) {
            if (!(object.type in objectsCount)) {
                objectsCount[object.type] = 0
                objectsName.push(object.type)
            }
        }
        for (const object of filteredData) {
            const objectTs = dayjs(object.ts).valueOf()
            if (objectTs < pieChartOptions.begin) continue
            objectsCount[object.type] += 1;
            if (objectTs > pieChartOptions.end) break;
        }

        Object.entries(objectsCount).forEach(([key, value]) => {
            chartData.push({
                id: key,
                label: key,
                value: value
            })
        })
    }

    return <ResponsivePie
        data={chartData}
        colors={(object) => {
            return ObjectsProps[object.id].color
        }}
        margin={{top: 40, right: 80, bottom: 80, left: 80}}
        innerRadius={0.5}
        padAngle={0.7}
        cornerRadius={3}
        activeOuterRadiusOffset={8}
        borderWidth={1}
        borderColor={{
            from: 'color',
            modifiers: [
                [
                    'darker',
                    0.2
                ]
            ]
        }}
        arcLinkLabelsSkipAngle={10}
        arcLinkLabelsTextColor="#333333"
        arcLinkLabelsThickness={2}
        arcLinkLabelsColor={{from: 'color'}}
        arcLabelsSkipAngle={10}
        arcLabelsTextColor={{
            from: 'color',
            modifiers: [
                [
                    'darker',
                    2
                ]
            ]
        }}
        legends={[
            {
                anchor: 'bottom',
                direction: 'row',
                justify: false,
                translateX: 0,
                translateY: 56,
                itemsSpacing: 0,
                itemWidth: 100,
                itemHeight: 18,
                itemTextColor: '#999',
                itemDirection: 'left-to-right',
                itemOpacity: 1,
                symbolSize: 18,
                symbolShape: 'circle',
                effects: [
                    {
                        on: 'hover',
                        style: {
                            itemTextColor: '#000'
                        }
                    }
                ]
            }
        ]}
    />
}

export default PieChart