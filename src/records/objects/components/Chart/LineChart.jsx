import {ResponsiveLine} from "@nivo/line";
import dayjs from "dayjs";
import {ObjectsProps} from "../../data/ObjectsProps";

const LineChart = ({objectsData, chartSubtype, chartOptions}) => {
    const chartData = [];
    const lineChartOptions = {...chartOptions}

    if (lineChartOptions.begin === null) {
        lineChartOptions.begin = dayjs(objectsData[0].ts)
    }
    if (lineChartOptions.end === null) {
        lineChartOptions.end = dayjs(objectsData.at(-1).ts)
    }
    lineChartOptions.begin = lineChartOptions.begin.valueOf()
    lineChartOptions.end = lineChartOptions.end.valueOf()

    const filteredData = [];
    for (const object of objectsData) {
        if (chartOptions.objects.includes(object.type)) {
            filteredData.push(object)
        }
    }

    if (chartSubtype.id === 0) {
        const objects = {};
        for (const object of filteredData) {
            if (!(object.type in objects)) {
                objects[object.type] = []
            }
        }
        for (const object of filteredData) {
            const objectTs = dayjs(object.ts).valueOf()
            if (objectTs < lineChartOptions.begin) continue

            objects[object.type].push({
                x: new Date(object.ts),
                y: objects[object.type].length + 1
            })

            if (objectTs > lineChartOptions.end) break;
        }
        Object.entries(objects).forEach(([key, value]) => {
            chartData.push({
                id: key,
                data: value
            })
        })

    } else if (chartSubtype.id === 1) {
        if (lineChartOptions.delta === null) lineChartOptions.delta = 30 * 1000;
        else if (lineChartOptions.delta.hour() === 0
            && lineChartOptions.delta.minute() === 0
            && lineChartOptions.delta.second() === 0) return <p> Delta must greater not be 0</p>
        else lineChartOptions.delta =
                (lineChartOptions.delta.hour() * 60 * 60
                    + lineChartOptions.delta.minute() * 60
                    + lineChartOptions.delta.second()) * 1000;

        const objectsCount = {};
        const objects = {};
        let threshold = lineChartOptions.begin + lineChartOptions.delta;
        for (const object of filteredData) {
            if (!(object.type in objects)) {
                objects[object.type] = []
                objectsCount[object.type] = 0
            }
        }
        for (const object of filteredData) {
            const objectTs = dayjs(object.ts).valueOf()
            if (objectTs < lineChartOptions.begin) continue
            while (threshold < objectTs) {
                Object.entries(objectsCount).forEach(([key, value]) => {
                    objects[key].push({
                        x: dayjs(threshold).toDate(),
                        y: value
                    })
                    objectsCount[key] = 0;
                })
                threshold += lineChartOptions.delta;
            }
            objectsCount[object.type] += 1;
            if (objectTs > lineChartOptions.end) break;
        }
        Object.entries(objects).forEach(([key, value]) => {
            chartData.push({
                id: key,
                data: value
            })
        })
    }


    return <ResponsiveLine
        data={chartData}
        colors={(object) => {
            return ObjectsProps[object.id].color
        }}
        margin={{top: 50, right: 110, bottom: 50, left: 60}}
        xScale={{
            format: '%d/%m/%y %H:%M:%S',
            type: 'time',
            useUTC: false
        }}
        xFormat="time:%d/%m/%y %H:%M:%S"
        yScale={{
            type: 'linear',
        }}
        axisBottom={{
            format: "%H:%M:%S",
            legend: "Time",
            legendPosition: 'middle',
            legendOffset: 36,
        }}
        axisLeft={{
            legend: 'Count',
            legendPosition: 'middle',
            legendOffset: -40,
        }}
        pointSize={5}
        pointColor={{theme: 'background'}}
        pointBorderWidth={1}
        pointBorderColor={{from: 'serieColor'}}
        pointLabelYOffset={-12}
        useMesh={true}
        legends={[
            {
                anchor: 'bottom-right',
                direction: 'column',
                justify: false,
                translateX: 100,
                translateY: 0,
                itemsSpacing: 0,
                itemDirection: 'left-to-right',
                itemWidth: 80,
                itemHeight: 20,
                itemOpacity: 0.75,
                symbolSize: 12,
                symbolShape: 'circle',
                symbolBorderColor: 'rgba(0, 0, 0, .5)',
                effects: [
                    {
                        on: 'hover',
                        style: {
                            itemBackground: 'rgba(0, 0, 0, .03)',
                            itemOpacity: 1
                        }
                    }
                ]
            }
        ]}
    />
}

export default LineChart