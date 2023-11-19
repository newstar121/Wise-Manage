import { useState, useEffect } from 'react'
import Head from 'next/head';
import { Box, Container, Unstable_Grid2 as Grid } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import info from 'src/service/consts';
import { BalanceTable } from 'src/sections/balances/balance-table';
import wiseService from 'src/service/wiseService';

const BalancePage = () => {

  const [balances, setBalances] = useState([]);

  useEffect(() => {

    const prefetch = async()=> {
      try {
        
        const response = await wiseService.getBalances();
        setBalances(response);
        
      } catch (error) {
        console.log(error);
      }
    };
    
    if(!balances.length) prefetch();
  }, [])



  return (
    <>
      <Head>
        <title>
          Balances
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 1
        }}
      >
        <Container maxWidth="xl">
          <Grid container>
          </Grid>
          <Grid
            container
            spacing={3}
            mt={1}
          >
            <Grid
              xs={12}
            >
              <BalanceTable
                balances={balances}
                sx={{ height: '100%' }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

BalancePage.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default BalancePage;
