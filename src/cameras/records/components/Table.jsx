import {useMemo, useState} from "react";
import * as ExcelJS from "exceljs";
import Box from "@mui/material/Box";
import TimestampRangePicker from "./TimestampRangePicker";
import {MaterialReactTable, useMaterialReactTable} from "material-react-table";
import {Button} from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import dayjs from 'dayjs';
import FileSaver from 'file-saver';
import StatisticsTable from './StatisticsTable'
import {RecordsProps} from "../data/RecordsProps";
import TimestampPicker from "../../../records/components/TimestampPicker";

const Table = ({recordsData}) => {

    const onExportRows = (rows) => {
        const rowData = rows.map((row) => row.original);
        onExportData(rowData)
    };

    const onExportData = (data) => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Records');
        const worksheetColumns = []
        columns.forEach((column) => {
            worksheetColumns.push(
                {
                    header: column.header,
                    key: column.id,
                }
            )
            if (column.type === 'datetime') {
                data.forEach((row) => {
                    row[column.id] = dayjs(row[column.id]).format('DD/MM/YY HH:mm:ss')
                })
            }
        })
        worksheet.columns = worksheetColumns;
        worksheet.addRows(data)

        // write to a new buffer
        const blobType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        workbook.xlsx.writeBuffer().then(data => {
            const blob = new Blob([data], {type: blobType});
            FileSaver.saveAs(blob, 'hey.xlsx');
        });
    };

    const [date, setDate] = useState();

    const onDateChange = (props, newDate) => {
        setDate(newDate);
        props.column.setFilterValue(newDate)
    }

    const columns = useMemo(
        () => [
            {
                accessorKey: 'name',
                header: 'Name',
            },
            {
                accessorKey: 'begin_ts',
                type: 'datetime',
                header: 'Begin',
                accessorFn: (row) => new Date(row.begin_ts),
                Cell: ({cell}) => dayjs(cell.getValue()).format('DD/MM/YY HH:mm:ss'),
                sortingFn: 'datetime',
                filterFn: 'greaterThanOrEqualTo',
                Filter: (props) => <TimestampPicker {...props} onDateChange={onDateChange}/>,
            },
            {
                header: 'End',
                type: 'datetime',
                accessorKey: 'end_ts',
                accessorFn: (row) => new Date(row.end_ts),
                Cell: ({cell}) => dayjs(cell.getValue()).format('DD/MM/YY HH:mm:ss'),
                sortingFn: 'datetime',
                filterFn: 'lessThanOrEqualTo',
                Filter: (props) => <TimestampPicker {...props} onDateChange={onDateChange}/>,
            }
        ],
        [],
        //end
    );

    const table = useMaterialReactTable({
        columns,
        data: recordsData,
        renderTopToolbarCustomActions: () => (
            <Box
                sx={{
                    display: 'flex',
                    gap: '16px',
                    padding: '8px',
                    flexWrap: 'wrap',
                }}
            >
                <Button
                    // export all data that is currently in the table (ignore pagination, sorting, filtering, etc.)
                    onClick={() => onExportData(recordsData)}
                    startIcon={<FileDownloadIcon/>}
                >
                    Export All Data
                </Button>
                <Button
                    disabled={table.getPrePaginationRowModel().rows.length === 0}
                    // export all rows, including from the next page, (still respects filtering and sorting)
                    onClick={() =>
                        onExportRows(table.getPrePaginationRowModel().rows)
                    }
                    startIcon={<FileDownloadIcon/>}
                >
                    Export All Rows
                </Button>
                <Button
                    disabled={table.getRowModel().rows.length === 0}
                    // export all rows as seen on the screen (respects pagination, sorting, filtering, etc.)
                    onClick={() => onExportRows(table.getRowModel().rows)}
                    startIcon={<FileDownloadIcon/>}
                >
                    Export Page Rows
                </Button>
                <Button
                    disabled={
                        !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
                    }
                    //only export selected rows
                    onClick={() => onExportRows(table.getSelectedRowModel().rows)}
                    startIcon={<FileDownloadIcon/>}
                >
                    Export Selected Rows
                </Button>
            </Box>
        ),
        initialState: {showColumnFilters: true},
        enableFacetedValues: true,
        filterFns: {
            timestampFilterFn: (row, id, filterValue) => {
                const begin = Date.parse(filterValue[0]);
                const end = Date.parse(filterValue[1]);
                const value = Date.parse(row.getValue(id))
                if (isNaN(begin) && isNaN(end)) return true
                if (isNaN(begin)) return value <= end
                if (isNaN(end)) return value >= begin
                return begin <= value && value <= end
            },
        },
        enableRowSelection: true,
        muiFilterTextFieldProps: {
            variant: 'outlined',
        },
        enableColumnResizing: true,
        layoutMode: 'grid', //instead of the default "grid-no-grow" when column resizing is enabled
    });

    return <Box>
        <MaterialReactTable table={table}/>
        <StatisticsTable table={table}/>
    </Box>;
};

export default Table