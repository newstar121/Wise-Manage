import PropTypes from 'prop-types';
import * as React from 'react';
import {
    Box,
    Card,
    CardActions,
    CardHeader,
    Checkbox,
    Divider,
    FormControlLabel
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Scrollbar } from 'src/components/scrollbar';
import { useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import wiseService from 'src/service/wiseService';

import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";
import debounce from "lodash/debounce";
import { Label } from '@mui/icons-material';

export const CharityTable = (props) => {

    const { sx } = props;

    const [data, setData] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [pageSize, setPageSize] = React.useState(50);
    const [total, setTotal] = React.useState(0);
    const [isNew, setIsNew] = React.useState(false);
    const [sort, setSort] = React.useState({
        reg_charity_number: -1
    });

    const [search, setSearch] = React.useState('');

    useEffect(() => {

        try {

            wiseService.getCharity({ page_num: page, page_count: pageSize, search: search, isNew: isNew, sort: sort }).then((response) => {
                setData(response.data);
                setTotal(response.total);
            });

        } catch (error) {
            console.log(error);
        }

    }, [page, pageSize, isNew, sort])

    const columns = [
        {
            field: 'reg_charity_number',
            headerName: 'Charity number',
            sortable: true,
            width: 150
        },
        {
            field: 'charity_name',
            headerName: 'Charity name',
            sortable: true,
            width: 400
        },
        {
            field: 'reg_status',
            headerName: 'Status',
            sortable: true,
            width: 130,
            valueGetter: (params) => params.row.reg_status == 'R' ? 'Registered' : 'Removed'
        },
        {
            field: 'income',
            headerName: 'Income',
            sortable: true,
            width: 130,
            valueGetter: (params) =>
                '£' + Number(params.row.income).toLocaleString('en', {
                    minimumFractionDigits: 0
                }),
        },
        {
            field: 'reporting',
            headerName: 'Reporting',
            sortable: true,
            width: 200,
            valueGetter: (params) => params.row.reporting
        },
    ];

    const handleChangeRowsPerPage = (event) => {

        setPageSize(parseInt(event.target.value) || 50);
        setPage(0);

    };

    const handleChangePage = (event, newPage) => {

        setPage(newPage);

    };

    const debouncedHandleSearch = React.useCallback(debounce(handleSearch, 500), []);

    function handleSearch(query) {
        // fetch search results from API or database
        try {

            wiseService.getCharity({ page_num: 0, page_count: pageSize, search: query, isNew: isNew, sort: sort }).then((response) => {
                setData(response.data);
                setTotal(response.total);
            });

            setSearch(query);

        } catch (error) {
            console.log(error);
        }
    }

    const handleSort = (field) => {

        let _sort = {};
        if (sort[field] == 1 || sort[field] == -1) _sort[field] = sort[field] == 1 ? -1 : 1;
        else _sort[field] = 1;

        setSort(_sort);

    }

    return (
        <Card sx={sx} style={{ paddingTop: 0, paddingBottom: 0 }} >
            <CardHeader title="Charities Search" />
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ marginLeft: 20, marginRight: 20 }}>

                    <TextField
                        id="search-bar"
                        className="text"
                        onInput={(e) => {
                            debouncedHandleSearch(e.target.value)
                        }}
                        // label="Enter Charity Name"
                        variant="outlined"
                        placeholder="Search..."
                        size="small"
                    />

                    <IconButton type="submit" aria-label="search">
                        <SearchIcon style={{ fill: "blue" }} />
                    </IconButton>

                </div>

                <FormControlLabel
                    style={{ marginRight: 20 }}
                    control={<Checkbox
                        checked={isNew}
                        onChange={(event) => {
                            setIsNew(event.target.checked);
                        }}
                    />}
                    label="New Charities"
                />
                <span style={{ color: 'blue' }}>{(total || 0) + " Matches found"}</span>

            </div>
            <Scrollbar sx={{ flexGrow: 1 }}>
                <Box sx={{ width: '100%' }}>
                    <Paper sx={{ width: '100%' }}>
                        <TableContainer>
                            <Table
                                sx={{ minWidth: 750 }}
                            >
                                <TableHead>
                                    <TableRow>
                                        <TableCell style={{ "cursor": "pointer", width: '150px' }} onClick={() => handleSort('reg_charity_number')}>
                                            Charity number
                                        </TableCell>
                                        <TableCell style={{ "cursor": "pointer", width: '400px' }} onClick={() => handleSort('charity_name')}>
                                            Charity name
                                        </TableCell>
                                        <TableCell style={{ "cursor": "pointer", width: '130px' }} onClick={() => handleSort('reg_status')}>
                                            Status
                                        </TableCell>
                                        <TableCell style={{ "cursor": "pointer", width: '130px' }} onClick={() => handleSort('income')}>
                                            Income
                                        </TableCell>
                                        <TableCell style={{ "cursor": "pointer", width: '200px' }} onClick={() => handleSort('reporting')}>
                                            Reporting
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {data?.map((row, index) => {

                                        return (
                                            <TableRow
                                                hover
                                                key={index}
                                            >
                                                <TableCell>
                                                    {row.reg_charity_number}
                                                </TableCell>
                                                <TableCell>
                                                    {row.charity_name}
                                                </TableCell>
                                                <TableCell>
                                                    {row.reg_status == 'R' ? 'Registered' : 'Removed'}
                                                </TableCell>
                                                <TableCell>
                                                    {'£' + Number(row.income || 0).toLocaleString('en', {
                                                        minimumFractionDigits: 2
                                                    })}
                                                </TableCell>
                                                <TableCell style={row.reporting == 'New' ? { color: 'red' } : {}}>
                                                    {row.reporting}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25, 50]}
                            component="div"
                            count={total || 0}
                            rowsPerPage={pageSize || 50}
                            page={page || 0}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </Paper>

                    {/* <DataGrid
                        getRowId={(row) => row._id}
                        rows={charity.data || []}
                        columns={columns}
                        initialState={{
                            pagination: {
                                paginationModel: { page: 0, pageSize: 50 },
                            },
                        }}
                        localeText={
                            {
                                noRowsLabel: 'There is no data to display.'
                            }
                        }
                        rowCount={charity.total || 0}
                        pageSizeOptions={[50]}
                        paginationMode='server'
                    /> */}
                </Box>
            </Scrollbar>
            <Divider />
            <CardActions sx={{ justifyContent: 'flex-end' }}>

            </CardActions>
        </Card>
    );
};

CharityTable.prototype = {
    charity: PropTypes.array,
    sx: PropTypes.object
};
