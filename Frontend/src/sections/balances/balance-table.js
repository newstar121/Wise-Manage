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

export const BalanceTable = (props) => {
    const { balances = [], sx } = props;

    return (
        <Card sx={sx}>
            <CardHeader title="WISE Balances" />
            <Scrollbar sx={{ flexGrow: 1 }}>
                <Box sx={{ minWidth: 800 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    {/* Profile ID */}
                                    Profile Name
                                </TableCell>
                                <TableCell>
                                    Balance ID
                                </TableCell>
                                <TableCell>
                                    Type
                                </TableCell>
                                <TableCell align='right'>
                                    Balance
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {balances.map((balance, index) => {

                                return (
                                    <TableRow
                                        hover
                                        key={index}
                                    >
                                        <TableCell>
                                            {/* {balance.profileId} */}
                                            {balance.fullName}
                                        </TableCell>
                                        <TableCell>
                                            {balance.balanceId}
                                        </TableCell>
                                        <TableCell>
                                            {balance.type}
                                        </TableCell>
                                        <TableCell align='right'>
                                            {(balance.currency == 'GBP' ? '£' : (balance.currency === 'USD' ? '$' : balance.currency === 'EUR' ? '€' : balance.currency === 'CNY' ? '¥' : balance.currency)) + balance.balance}
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

BalanceTable.prototype = {
    balances: PropTypes.array,
    sx: PropTypes.object
};
