import {useMemo, useState} from "react";
import * as ExcelJS from "exceljs";
import Box from "@mui/material/Box";
import RangePicker from "./RangePicker";
import {MaterialReactTable, useMaterialReactTable} from "material-react-table";
import {Button} from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import dayjs from 'dayjs';
import FileSaver from 'file-saver';
import StatisticsTable from './StatisticsTable'
import {ObjectsProps} from "../data/ObjectsProps";

const Table = ({objectsData}) => {
    // manage our own state for stuff we want to pass to the API
    // const [columnFilters, setColumnFilters] = useState([]);
    // const [globalFilter, setGlobalFilter] = useState('');
    // const [sorting, setSorting] = useState([]);
    // const [pagination, setPagination] = useState({
    //     pageIndex: 0,
    //     pageSize: 10,
    // });

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

    const [begin, setBegin] = useState();
    const [end, setEnd] = useState();

    const onBeginChange = (newBegin) => {
        setBegin(newBegin)
    }

    const onEndChange = (newEnd) => {
        setEnd(newEnd)
    }

    const columns = useMemo(
        () => [
            {
                accessorKey: 'type',
                header: 'Type',
                filterVariant: 'select',
                Cell: ({cell}) => (
                    <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        component="span"
                        sx={() => ({
                            backgroundColor: ObjectsProps[cell.getValue()].color,
                            borderRadius: '0.25rem',
                            color: '#fff',
                            p: '0.25rem',
                            width: '20ch',
                            fontWeight: 'bold'
                        })}
                    >
                        {cell.getValue()}
                    </Box>
                ),

            },
            {
                accessorKey: 'ts',
                type: 'datetime',
                header: 'Appear',
                accessorFn: (row) => new Date(row.ts),
                Cell: ({cell}) => dayjs(cell.getValue()).format('DD/MM/YY HH:mm:ss'),
                sortingFn: 'datetime',
                filterFn: 'timestampFilterFn',
                Filter: (props) => <RangePicker
                    {...props}
                    begin={begin} end={end}
                    onBeginChange={onBeginChange} onEndChange={onEndChange}
                />,
                size: 600
            },
            {
                accessorKey: 'speed',
                header: 'Speed',
                filterVariant: 'range',
                size: 200,
                Cell: ({cell}) => (
                    <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        component="span"
                        sx={(theme) => ({
                            backgroundColor: theme.palette.success.light,
                            borderRadius: '0.25rem',
                            color: '#fff',
                            maxWidth: '9ch',
                            p: '0.25rem',
                            width: '9ch',
                            fontWeight: 'bold'
                        })}
                    >
                        {Math.round((parseFloat(cell.getValue()) + Number.EPSILON) * 100) / 100}
                    </Box>
                ),
            },
        ],
        [],
        //end
    );

    const table = useMaterialReactTable({
        columns,
        data: objectsData,
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
                    onClick={() => onExportData(objectsData)}
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