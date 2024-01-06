import {ResponsiveBar} from '@nivo/bar'
import dayjs from "dayjs";
import {ObjectsProps} from "../../data/ObjectsProps";

const BarChart = ({objectsData, chartSubtype, chartOptions}) => {
    const chartData = [];
    const objectsName = [];
    const barChartOptions = {...chartOptions}
    const objectsTimestamp = {};

    if (barChartOptions.begin === null) {
        barChartOptions.begin = dayjs(objectsData[0].ts)
    }
    if (barChartOptions.end === null) {
        barChartOptions.end = dayjs(objectsData.at(-1).ts)
    }
    barChartOptions.begin = barChartOptions.begin.valueOf()
    barChartOptions.end = barChartOptions.end.valueOf()

    const filteredData = [];
    for (const object of objectsData) {
        if (chartOptions.objects.includes(object.type)) {
            filteredData.push(object)
        }
    }

    if (chartSubtype.id === 0) {
        if (barChartOptions.delta === null) barChartOptions.delta = 30 * 1000;
        else if (barChartOptions.delta.hour() === 0
            && barChartOptions.delta.minute() === 0
            && barChartOptions.delta.second() === 0) return <p> Delta must greater not be 0</p>
        else barChartOptions.delta =
                (barChartOptions.delta.hour() * 60 * 60
                    + barChartOptions.delta.minute() * 60
                    + barChartOptions.delta.second()) * 1000;

        const objectsCount = {};
        let threshold = barChartOptions.begin + barChartOptions.delta;
        for (const object of filteredData) {
            if (!(object.type in objectsCount)) {
                objectsCount[object.type] = 0
                objectsName.push(object.type)
            }
        }
        let timestampIndex = 0;
        for (const object of filteredData) {
            const objectTs = dayjs(object.ts).valueOf()
            if (objectTs < barChartOptions.begin) continue
            while (threshold < objectTs) {
                chartData.push({
                    ...objectsCount,
                    timestamp: dayjs(threshold).format('DD/MM/YY HH:mm:ss'),
                })
                objectsTimestamp[dayjs(threshold).format('DD/MM/YY HH:mm:ss')] = timestampIndex;
                timestampIndex++;
                Object.entries(objectsCount).forEach(([key, value]) => {
                    objectsCount[key] = 0;
                })
                threshold += barChartOptions.delta;
            }
            objectsCount[object.type] += 1;
            if (objectTs > barChartOptions.end) break;
        }
    }

    return <ResponsiveBar
        data={chartData}
        keys={objectsName}
        indexBy="timestamp"
        margin={{top: 50, right: 130, bottom: 50, left: 60}}
        padding={0.3}
        valueScale={{type: 'linear'}}
        indexScale={{type: 'band', round: true}}
        colors={(object) => {
            return ObjectsProps[object.id].color
        }}
        defs={[
            {
                id: 'dots',
                type: 'patternDots',
                background: 'inherit',
                color: '#38bcb2',
                size: 4,
                padding: 1,
                stagger: true
            },
            {
                id: 'lines',
                type: 'patternLines',
                background: 'inherit',
                color: '#eed312',
                rotation: -45,
                lineWidth: 6,
                spacing: 10
            }
        ]}
        borderColor={{
            from: 'color',
            modifiers: [
                [
                    'darker',
                    1.6
                ]
            ]
        }}
        axisTop={null}
        axisRight={null}
        // axisBottom={null}
        axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Timestamp',
            legendPosition: 'middle',
            legendOffset: 42,
            truncateTickAt: 0,
            format: (timestamp) => {
                if (Object.keys(objectsTimestamp).length < 5) return timestamp;
                if (objectsTimestamp[timestamp] % (Object.keys(objectsTimestamp).length / 5 >> 0) === 0) return timestamp;
                else return '';
            }
        }}
        axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Count',
            legendPosition: 'middle',
            legendOffset: -40,
            truncateTickAt: 0
        }}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor={{
            from: 'color',
            modifiers: [
                [
                    'darker',
                    1.6
                ]
            ]
        }}
        legends={[
            {
                dataFrom: 'keys',
                anchor: 'bottom-right',
                direction: 'column',
                justify: false,
                translateX: 120,
                translateY: 0,
                itemsSpacing: 2,
                itemWidth: 100,
                itemHeight: 20,
                itemDirection: 'left-to-right',
                itemOpacity: 0.85,
                symbolSize: 20,
                effects: [
                    {
                        on: 'hover',
                        style: {
                            itemOpacity: 1
                        }
                    }
                ]
            }
        ]}
        role="application"
        ariaLabel="Bar chart"
        barAriaLabel={e => e.id + ": " + e.formattedValue + " in country: " + e.indexValue}
    />
}

export default BarChart