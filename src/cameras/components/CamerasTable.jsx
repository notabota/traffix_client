import {useMemo, useState} from "react";
import * as ExcelJS from "exceljs";
import {keepPreviousData, useQuery} from "@tanstack/react-query";
import {MaterialReactTable, useMaterialReactTable} from "material-react-table";
import {Box, Button, IconButton, Tooltip} from "@mui/material";
import DatasetIcon from "@mui/icons-material/Dataset";
import RefreshIcon from "@mui/icons-material/Refresh";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import dayjs from 'dayjs'
import FileSaver from 'file-saver';

const openInNewTab = url => {
    window.open(url, '_blank', 'noopener,noreferrer');
};

const CamerasTable = () => {
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
        ],
        queryFn: async () => {
            const query = `
                query Cameras {
                  cameras {
                    id
                    lat
                    lng
                    name
                    url
                    description
                    counting_state
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
            return json['data']['cameras'];
        },

        placeholderData: keepPreviousData, //don't go to 0 rows when refetching or paginating to next page
    });

    const columns = useMemo(
        () => [
            {
                accessorKey: 'name',
                header: 'Name',
            },
            {
                accessorKey: 'lat',
                header: 'Lat',
                type: 'number',
            },
            {
                accessorKey: 'lng',
                header: 'Lng',
                type: 'number',
            },
            {
                accessorKey: 'counting_state',
                header: 'Counting State',
                filterVariant: 'select',
                // Cell: ({cell}) => (
                //     <Box
                //         display="flex"
                //         justifyContent="center"
                //         alignItems="center"
                //         component="span"
                //         sx={(theme) => ({
                //             backgroundColor: cell.getValue() ? theme.palette.success.light : theme.palette.error.light,
                //             borderRadius: '0.25rem',
                //             color: '#fff',
                //             maxWidth: '9ch',
                //             p: '0.25rem',
                //             width: '9ch',
                //             fontWeight: 'bold'
                //         })}
                //     >
                //         {cell.getValue() ? 'True' : 'False'}
                //     </Box>
                // ),
            },
            {
                accessorKey: 'url',
                header: 'URL',
            },
            {
                accessorKey: 'description',
                header: 'Description',
            },
        ],
        [],
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
                        openInNewTab('/cameras/' + row.original.id)
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
        muiToolbarAlertBannerProps: isError
            ? {
                color: 'error',
                children: 'Error loading data',
            }
            : undefined,
        enableFacetedValues: true,
        enableRowSelection: true,
        muiFilterTextFieldProps: {
            variant: 'outlined',
        },
        enableColumnResizing: true,
        layoutMode: 'grid',
        state: {
            isLoading,
            showAlertBanner: isError,
            showProgressBars: isRefetching,
        }
    });

    return <MaterialReactTable table={table}/>;
};

export default CamerasTable