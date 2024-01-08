import * as d3 from 'd3-scale-chromatic';

const objectsColorScheme = d3.schemeSet2;

export const RecordsProps = {
    car: {
        color: objectsColorScheme[0]
    },
    motorcycle: {
        color: objectsColorScheme[1]
    }
}