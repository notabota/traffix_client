import {useMemo, useState} from "react";
import * as ExcelJS from "exceljs";
import {keepPreviousData, useQuery} from "@tanstack/react-query";
import {MaterialReactTable, useMaterialReactTable} from "material-react-table";
import {Box, Button, IconButton, Tooltip} from "@mui/material";
import DatasetIcon from "@mui/icons-material/Dataset";
import RefreshIcon from "@mui/icons-material/Refresh";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import TimestampPicker from "./TimestampPicker";
import dayjs from 'dayjs'
import FileSaver from 'file-saver';

const openInNewTab = url => {
    window.open(url, '_blank', 'noopener,noreferrer');
};

const RecordsTable = () => {
    // manage our own state for stuff we want to pass to the API
    const [columnFilters, setColumnFilters] = useState([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [sorting, setSorting] = useState([]);
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });

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

        console.log(worksheet)

        // write to a new buffer
        const blobType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        workbook.xlsx.writeBuffer().then(data => {
            const blob = new Blob([data], {type: blobType});
            FileSaver.saveAs(blob, 'hey.xlsx');
        });
    };

    // consider storing this code in a custom hook (i.e useFetchUsers)
    const {
        data = [],
        isError,
        isRefetching,
        isLoading,
        refetch,
    } = useQuery({
        refetchInterval: 1000,
        queryKey: [
            'table-data',
            // columnFilters, //refetch when columnFilters changes
            // globalFilter, //refetch when globalFilter changes
            // pagination.pageIndex, //refetch when pagination.pageIndex changes
            // pagination.pageSize, //refetch when pagination.pageSize changes
            // sorting, //refetch when sorting changes
        ],
        queryFn: async () => {
            const query = `
                query Record {
                  records {
                    id
                    name
                    description
                    begin_ts
                    end_ts
                  }
                }
            `
            const variables = {}

            const fetchURL = new URL(
                import.meta.env.VITE_API_HOST
            );

            const headers = new Headers();
            // headers.append('pragma', 'no-cache');
            // headers.append('cache-control', 'no-cache');
            headers.append('Content-Type', 'application/json')

            const options = {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({query, variables})
            };

            const response = await fetch(fetchURL.href, options);
            const json = await response.json();
            console.log(json)
            return json['data']['records'];
        },

        placeholderData: keepPreviousData, //don't go to 0 rows when refetching or paginating to next page
    });

    const [date, setDate] = useState(null);

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
                enableGlobalFilter: false,
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
                enableGlobalFilter: false,
            }
        ],
        [],
        //end
    );

    const table = useMaterialReactTable({
        columns,
        data,
        isFullScreen: true,
        enableRowActions: true,
        renderRowActions: function ({row}) {
            return (
                <Box>
                    <IconButton onClick={() => {
                        console.log(row)
                        openInNewTab('/records/' + row.original.id)
                    }
                    }>
                        <DatasetIcon/>
                    </IconButton>
                </Box>
            )
        },
        renderTopToolbarCustomActions: () => (
            <Box
                sx={{
                    display: 'flex',
                    gap: '16px',
                    padding: '8px',
                    flexWrap: 'wrap',
                }}
            >
                <Tooltip arrow title="Refresh Data">
                    <IconButton onClick={() => refetch()}>
                        <RefreshIcon/>
                    </IconButton>
                </Tooltip>
                <Button
                    //export all data that is currently in the table (ignore pagination, sorting, filtering, etc.)
                    onClick={() => onExportData(data)}
                    startIcon={<FileDownloadIcon/>}
                >
                    Export All Data
                </Button>
                <Button
                    disabled={table.getPrePaginationRowModel().rows.length === 0}
                    //export all rows, including from the next page, (still respects filtering and sorting)
                    onClick={() =>
                        onExportRows(table.getPrePaginationRowModel().rows)
                    }
                    startIcon={<FileDownloadIcon/>}
                >
                    Export All Rows
                </Button>
                <Button
                    disabled={table.getRowModel().rows.length === 0}
                    //export all rows as seen on the screen (respects pagination, sorting, filtering, etc.)
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
        // manualFiltering: true, //turn off built-in client-side filtering
        // manualPagination: true, //turn off built-in client-side pagination
        // manualSorting: true, //turn off built-in client-side sorting
        muiToolbarAlertBannerProps: isError
            ? {
                color: 'error',
                children: 'Error loading data',
            }
            : undefined,
        // onColumnFiltersChange: setColumnFilters,
        // onGlobalFilterChange: setGlobalFilter,
        // onPaginationChange: setPagination,
        // onSortingChange: setSorting,
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
        state: {
            // columnFilters,
            // globalFilter,
            // sorting,
            // pagination,
            isLoading,
            showAlertBanner: isError,
            showProgressBars: isRefetching,
        }
    });

    return <MaterialReactTable table={table}/>;
};

export default RecordsTable