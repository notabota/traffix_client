import dayjs from "dayjs";
import {ResponsiveCalendar} from "@nivo/calendar";

import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

dayjs.extend(isSameOrBefore)

const data = [
    {
        "value": 71,
        "day": "2016-12-08"
    }
]


const Calendar = ({recordsData, chartSubtype, chartOptions}) => {
    const chartData = [];
    const timestampsDict = {}
    const calendarOptions = {...chartOptions}

    if (calendarOptions.beginYear == null) {
        calendarOptions.beginYear = dayjs(recordsData[0].begin_ts);
        for (const record of recordsData) {
            if (dayjs(record.begin_ts).isBefore(calendarOptions.beginYear))
                calendarOptions.beginYear = dayjs(record.begin_ts)
        }
    }
    if (calendarOptions.endYear == null) {
        calendarOptions.endYear = dayjs(recordsData[0].end_ts);
    }

    for (const record of recordsData) {
        const beginTimestamp = dayjs(record.begin_ts);
        const endTimestamp = dayjs(record.end_ts);
        let currentTimestamp = beginTimestamp;
        while (currentTimestamp.isSameOrBefore(endTimestamp, 'day')) {
            const currentTimestampFormat = currentTimestamp.format('YYYY-MM-DD')
            if (currentTimestampFormat in timestampsDict) {
                timestampsDict[currentTimestampFormat] += 1
            } else timestampsDict[currentTimestampFormat] = 1
            currentTimestamp = currentTimestamp.add(1, 'day');
        }
    }
    for (const timestamp in timestampsDict) {
        chartData.push({
            "value": timestampsDict[timestamp],
            "day": timestamp
        })
    }

    const beginYear = calendarOptions.beginYear.year();
    const endYear = calendarOptions.endYear.year();
    const chartArray = [];
    for (let year = endYear; year >= beginYear; year--) {
        chartArray.push(<ResponsiveCalendar
            data={chartData}
            from={`${year}`}
            to={`${year}`}
            emptyColor="#eeeeee"
            colors={['#61cdbb', '#97e3d5', '#e8c1a0', '#f47560']}
            margin={{top: 40, right: 40, bottom: 0, left: 40}}
            yearSpacing={40}
            monthBorderColor="#ffffff"
            dayBorderWidth={2}
            dayBorderColor="#ffffff"
            legends={[
                {
                    anchor: 'bottom-right',
                    direction: 'row',
                    translateY: 36,
                    itemCount: 4,
                    itemWidth: 42,
                    itemHeight: 36,
                    itemsSpacing: 14,
                    itemDirection: 'right-to-left'
                }
            ]}
        />)
    }
    return chartArray;
}

export default Calendar