import { useState, useEffect } from 'react'
import Head from 'next/head';
import { Box, Container, Unstable_Grid2 as Grid } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
// import wiseService from 'src/service/wiseService';
import { CharityTable } from 'src/sections/charity/charity';

const CharityPage = () => {

  return (
    <>
      <Head>
        <title>
          Charity List
        </title>
      </Head>

      <CharityTable
        sx={{ height: '100%' }}
      />

    </>
  );
};

CharityPage.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default CharityPage;
