import { useState, useEffect } from 'react'
import Head from 'next/head';
import { Box, Container, Unstable_Grid2 as Grid } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import wiseService from 'src/service/wiseService';
import { ElectricTable } from 'src/sections/electrics/electric-table';

const ElectricityPage = () => {

  const [electrics, setElectrics] = useState([]);

  useEffect(() => {

    const prefetch = async()=> {
      try {
        
        const response = await wiseService.getElectrics();
        setElectrics(response);
        
      } catch (error) {
        console.log(error);
      }
    };
    
    if(!electrics.length) prefetch();
  }, [])



  return (
    <>
      <Head>
        <title>
          Electricity
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
              <ElectricTable
                electrics={electrics}
                sx={{ height: '100%' }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

ElectricityPage.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default ElectricityPage;
