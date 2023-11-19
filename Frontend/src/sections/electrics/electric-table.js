import PropTypes from 'prop-types';
import {
    Box,
    Card,
    CardActions,
    CardHeader,
    Divider,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow
} from '@mui/material';
import { Scrollbar } from 'src/components/scrollbar';
import { use, useEffect, useState } from 'react';

export const ElectricTable = (props) => {
    const { electrics = [], sx } = props;

    const [data, setData] = useState([]);
    const [numSort, setNumSort] = useState(true);
    const [propertySort, setPropertySort] = useState(false);
    const [consumptionSort, setConsumptionSort] = useState(false);
    const [currentSort, setCurrentort] = useState(false);
    const [daySort, setDaySort] = useState(false);
    const [balanceSort, setBalanceSort] = useState(false);

    useEffect(() => {
        setData(electrics);
    }, [electrics])

    useEffect(() => {

        let result = [].concat(electrics);

        if (numSort) {
            result.sort((a, b) => a.number > b.number ? 1 : -1)
        } else {
            result.sort((a, b) => a.number > b.number ? -1 : 1)
        }

        setData(result);
    }, [numSort])

    useEffect(() => {

        let result = [].concat(electrics);

        if (propertySort) {
            result.sort((a, b) => a.property > b.property ? 1 : -1)
        } else {
            result.sort((a, b) => a.property > b.property ? -1 : 1)
        }

        setData(result);
    }, [propertySort])

    useEffect(() => {

        let result = [].concat(electrics);

        if (consumptionSort) {
            result.sort((a, b) => parseFloat(a.last_used) > parseFloat(b.last_used) ? 1 : -1)
        } else {
            result.sort((a, b) => parseFloat(a.last_used) > parseFloat(b.last_used) ? -1 : 1)
        }

        setData(result);
    }, [consumptionSort])

    useEffect(() => {

        let result = [].concat(electrics);

        if (currentSort) {
            result.sort((a, b) => parseFloat(a.unit_rate) > parseFloat(b.unit_rate) ? 1 : -1)
        } else {
            result.sort((a, b) => parseFloat(a.unit_rate) > parseFloat(b.unit_rate) ? -1 : 1)
        }

        setData(result);
    }, [currentSort])

    useEffect(() => {

        let result = [].concat(electrics);

        if (daySort) {
            result.sort((a, b) => parseFloat(a.standingCharge) > parseFloat(b.standingCharge) ? 1 : -1)
        } else {
            result.sort((a, b) => parseFloat(a.standingCharge) > parseFloat(b.standingCharge) ? -1 : 1)
        }

        setData(result);
    }, [daySort])

    useEffect(() => {

        let result = [].concat(electrics);

        if (balanceSort) {
            result.sort((a, b) => parseFloat(a.balance) > parseFloat(b.balance) ? 1 : -1)
        } else {
            result.sort((a, b) => parseFloat(a.balance) > parseFloat(b.balance) ? -1 : 1)
        }

        setData(result);
    }, [balanceSort])

    return (
        <Card sx={sx}>
            <CardHeader title="Octopus Balances" />
            <Scrollbar sx={{ flexGrow: 1 }}>
                <Box sx={{ minWidth: 800 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell style={{ "cursor": "pointer" }} onClick={() => setNumSort(!numSort)}>
                                    Account Number
                                </TableCell>
                                <TableCell style={{ "cursor": "pointer" }} onClick={() => setPropertySort(!propertySort)}>
                                    Proeprty Address
                                </TableCell>
                                <TableCell style={{ "cursor": "pointer" }} onClick={() => setConsumptionSort(!consumptionSort)}>
                                    Consumption - 12 mons
                                </TableCell>
                                <TableCell style={{ "cursor": "pointer" }} onClick={() => setCurrentort(!currentSort)}>
                                    £/Kwh
                                </TableCell>
                                <TableCell style={{ "cursor": "pointer" }} onClick={() => setDaySort(!daySort)}>
                                    £/day
                                </TableCell>
                                <TableCell style={{ "cursor": "pointer", "minWidth": "130px" }} onClick={() => setBalanceSort(!balanceSort)}>
                                    Balance
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.map((electric, index) => {

                                return (
                                    <TableRow
                                        hover
                                        key={index}
                                    >
                                        <TableCell>
                                            {electric.number}
                                        </TableCell>
                                        <TableCell>
                                            {electric.property}
                                        </TableCell>
                                        <TableCell>
                                            {Number(parseInt(electric.last_used)).toLocaleString('en', {
                                                minimumFractionDigits: 0
                                            })}
                                        </TableCell>
                                        <TableCell>
                                            {Number(electric.unit_rate).toLocaleString('en', {
                                                minimumFractionDigits: 2
                                            })}
                                        </TableCell>
                                        <TableCell>
                                            {Number(electric.standingCharge).toLocaleString('en', {
                                                minimumFractionDigits: 2
                                            })}
                                        </TableCell>
                                        <TableCell>
                                            {Number(electric.balance) < 0 ? ('-£' + Number(-electric.balance).toLocaleString('en', {
                                                minimumFractionDigits: 2
                                            })) : ('£' + Number(electric.balance).toLocaleString('en', {
                                                minimumFractionDigits: 2
                                            }))}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </Box>
            </Scrollbar>
            <Divider />
            <CardActions sx={{ justifyContent: 'flex-end' }}>

            </CardActions>
        </Card>
    );
};

ElectricTable.prototype = {
    electrics: PropTypes.array,
    sx: PropTypes.object
};
