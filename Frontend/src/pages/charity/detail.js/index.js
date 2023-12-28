import Head from 'next/head';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { useRouter } from 'next/router';
import {
  Tabs,
  Tab,
  Box,
  Typography
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import wiseService from 'src/service/wiseService';
import moment from 'moment';
import { differenceInDays } from 'date-fns';

const CharityDetailPage = () => {

  const router = useRouter();

  if (!router.query) return;

  const [currentTabIndex, setCurrentTabIndex] = useState(0);

  const handleTabChange = (e, tabIndex) => {

    setCurrentTabIndex(tabIndex);

  };

  const [overviewData, setOverviewData] = useState({});

  const [allDetails, setAllDetails] = useState({});

  const [allGovernance, setAllGovernance] = useState({});

  const [trustee, setTrustee] = useState([]);

  const [financialHistoryColumn, setFinancialHistoryColumn] = useState([]);
  const [financialHistoryRow, setFinancialHistoryRow] = useState([]);

  const [accountsReturn, setAccountsReturn] = useState([]);
  const [governingDoc, setGoverningDoc] = useState({});
  const [contactInfo, setContactInfo] = useState({});

  useEffect(() => {

    wiseService.getCharityOverview(router.query).then((response) => {
      setOverviewData(response);
    });

    wiseService.getAllDetails(router.query).then((response) => {
      setAllDetails(response);

      let trustees = [];
      for (let i = 0; i < response?.trustee_names.length; i++) {
        trustees.push(Object.assign({}, response.trustee_names[i], { id: i }));
      }
      setTrustee(trustees);

    });

    wiseService.getAllGovernance(router.query).then((response) => {
      setAllGovernance(response);
    });

    wiseService.getFinancialHistory(router.query).then((response) => {
      setFinancialHistoryColumn(response.column);
      setFinancialHistoryRow(response.row);
    });

    wiseService.getAccountsReturn(router.query).then((response) => {
      setAccountsReturn(response);
    });

    wiseService.getGoverningDoc(router.query).then((response) => {
      setGoverningDoc(response);
    });

    wiseService.getContactinfo(router.query).then((response) => {
      setContactInfo(response);
    });

  }, [router.query]);

  const renderChild = (type) => {

    const result = [];

    for (let i = 0; i < allDetails?.who_what_where?.length; i++) {

      if (allDetails.who_what_where[i].classification_type == type) {
        result.push(<Typography variant='p'>
          {allDetails.who_what_where[i].classification_desc || ''}
        </Typography>);
      }
    }

    return <div style={{ display: 'flex', flexDirection: 'column' }}>{result}</div>

  }

  return (
    <>
      <Head>
        <title>
          Charity Detail Page
        </title>
      </Head>

      <Tabs
        value={currentTabIndex}
        onChange={handleTabChange}
        textColor="secondary"
        indicatorColor="secondary"
        aria-label="secondary tabs example"
        style={{ marginLeft: '10px' }}
      >
        <Tab value={0} label="Charity overview" />
        <Tab value={1} label="What, who, how, where" />
        <Tab value={2} label="Governance" />
        <Tab value={3} label="Trustees" />
        <Tab value={4} label="Financial history" />
        <Tab value={5} label="Accounts and annual returns" />
        <Tab value={6} label="Governing document" />
        <Tab value={7} label="Contact information" />
      </Tabs>

      {/* Overview */}
      {currentTabIndex === 0 && (
        <Box sx={{ p: 3 }}>
          <Typography variant='h5'>Activities-how the charity spends its money</Typography>
          <Typography variant='p'>
            {overviewData?.activities || ''}
          </Typography>
          <Typography variant='h5'>Income and expenditure</Typography>
          <Typography variant='p'>
            {'Data for financial year ending ' + overviewData ? moment(overviewData?.latest_acc_fin_year_end_date).format('DD MMMM YYYY') : ''}
          </Typography>
          <Typography variant='h5'>{'Total income: ' + '£' + Number(overviewData?.latest_income || 0).toLocaleString('en', {
            minimumFractionDigits: 2
          })}
          </Typography>
          <Typography variant='h5'>{'Total expenditure: ' + '£' + Number(overviewData?.latest_expenditure || 0).toLocaleString('en', {
            minimumFractionDigits: 2
          })}
          </Typography>

          <Typography variant='h5'>{(overviewData?.trustees || 0) + 'Trustee(s)'}</Typography>
          <Typography variant='h5'>{(overviewData?.volunteers || 0) + 'Volunteer(s)'}</Typography>
        </Box>
      )}

      {/* What, Who, How, Where */}
      {currentTabIndex === 1 && (
        <Box sx={{ p: 3 }}>
          <Typography variant='h5'>What the charity does:</Typography>
          {renderChild('What')}
          <Typography variant='h5'>Who the charity helps:</Typography>
          {renderChild('Who')}
          <Typography variant='h5'>How the charity helps:</Typography>
          {renderChild('How')}
          <Typography variant='h5'>Where the charity operates:</Typography>
          {renderChild('Where')}
        </Box>
      )}

      {/* Governance */}
      {currentTabIndex === 2 && (
        <Box sx={{ p: 3 }}>
          <Typography variant='h5'>Registration history:</Typography>
          {(allGovernance?.charityregistrationhistory || []).map((item) => <Typography variant='p'>{item?.event_group == 'Registration' ? moment(item.reg_date).format('DD MMMM YYYY') + ' : ' + item?.reg_desc : ''}</Typography>)}
          <Typography variant='h5'>Organisation type:</Typography>
          <Typography variant='p'>
            {allGovernance?.charity_type}
          </Typography>
          <Typography variant='h5'>Other names:</Typography>
          {allGovernance?.charityothernames.map((item) => <Typography variant='p'>{item?.other_name}</Typography>)}
          {(!allGovernance?.charityothernames || allGovernance.charityothernames.length == 0) && (
            <Typography variant='p'>
              No other names
            </Typography>
          )}
          <Typography variant='h5'>Company number:</Typography>
          <Typography variant='p'>
            {allGovernance?.charity_co_reg_number || ''}
          </Typography>
          <Typography variant='h5'>Gift aid:</Typography>
          <Typography variant='p'>
            {allGovernance?.gift_aid ? 'There is Gift aid' : 'Not recognised by HMRC for gift aid'}
          </Typography>

          <Typography variant='h5'>Other regulators:</Typography>
          <Typography variant='p'>
            No information available
          </Typography>

          <Typography variant='h5'>Policies:</Typography>
          <Typography variant='p'>
            {(allGovernance?.policies || []).map((item) => <Typography variant='p'></Typography>)}
          </Typography>

          <Typography variant='h5'>Land and property:</Typography>
          <Typography variant='p'>
            {allGovernance?.has_land ? 'There is land' : 'This charity does not own and/or lease land or property'}
          </Typography>

        </Box>
      )}

      {/* Trustees */}
      {currentTabIndex === 3 && (
        <Box sx={{ p: 3 }}>
          <Typography variant='h5' style={{ marginBottom: '10px' }}>Trustees</Typography>
          <Typography> are the people responsible for controlling the work, management and administration of the charity on behalf of its beneficiaries. Generally trustees are treasurer, chair, board member etc. The trustees are responsible for keeping this list up to date and can do this by updating their details as they happen through the online service</Typography>
          <Typography variant='h5' style={{ marginBottom: '10px', marginTop: '20px' }}>{overviewData?.trustees || 0}Trustee(s)</Typography>
          <DataGrid
            getRowId={(row) => row.id}
            rows={trustee || []}
            columns={[
              {
                field: 'trustee_name',
                headerName: 'Name',
                width: 200
              },
              {
                field: 'id',
                headerName: 'Role',
                valueGetter: (row) => {
                  return row.row.id == 0 ? 'Chair' : 'Trustee'
                },
                width: 150,
              },
              {
                field: 'date',
                headerName: 'Date of appointment',
                width: 150
              },
              {
                field: 'record',
                headerName: 'Other trusteeships',
                valueGetter: (row) => 'None on record',
                width: 150
              },
              {
                field: 'report',
                headerName: 'Reporting status of other trusteeships',
                width: 250
              },
            ]}
            localeText={
              {
                noRowsLabel: 'There is no trustees.'
              }
            }
          />
        </Box>
      )}

      {/* Financial History */}
      {currentTabIndex === 4 && (
        <Box sx={{ p: 3 }}>
          <DataGrid
            getRowId={(row) => row['Income/Expenditure']}
            rows={financialHistoryRow || []}
            columns={
              (financialHistoryColumn || []).map((item, index) => {
                return {
                  field: item,
                  headerName: item,
                  width: index == 0 ? 300 : 150
                }
              })
            }
            localeText={
              {
                noRowsLabel: 'There is no financial histories.'
              }
            }
          />
        </Box>
      )}

      {/* Accounts and annual returns */}
      {currentTabIndex === 5 && (
        <Box sx={{ p: 3 }}>
          <Typography>This table shows the charity's record of submitting annual returns, accounts and trustees' annual report (TAR) for the last five financial periods.</Typography>
          <DataGrid
            getRowId={(row) => row.id}
            rows={accountsReturn || []}
            columns={[
              {
                field: 'title',
                headerName: 'Title',
                width: 200
              },
              {
                field: 'reporting_period_year_end',
                headerName: 'Reporting year',
                valueGetter: (row) => {
                  return moment(row?.row?.reporting_period_year_end).format('DD MMMM YYYY')
                },
                width: 150,
              },
              {
                field: 'date_received',
                headerName: 'Date received',
                valueGetter: (row) => {
                  return moment(row?.row?.date_received).format('DD MMMM YYYY')
                },
                width: 150
              },
              {
                field: 'date_due',
                headerName: 'Received',
                valueGetter: (row) => {
                  const diff_days = moment(row?.row?.date_received).diff(moment(row?.row?.date_due), 'days');
                  return diff_days > 0 ? diff_days + 'days late' : 'On time'
                },
                width: 150
              },
              {
                field: 'download',
                headerName: 'Download',
                valueGetter: (row) => {
                  return row?.row.title == 'Accounts and TAR' ? 'Download' : ''
                },
                width: 100
              },
            ]}
            localeText={
              {
                noRowsLabel: 'There is no accounts and annual returns.'
              }
            }
          />
        </Box>
      )}

      {/* Governance document*/}
      {currentTabIndex === 6 && (
        <Box sx={{ p: 3 }}>
          <Typography variant='h5'>Governing document:</Typography>
          <Typography variant='p'>Details of the type of governing document the charity has and when it was established. It is not the full text of the charity's governing document.</Typography>
          <Typography variant='p'>{governingDoc?.governing_document_description || ''}</Typography>
          <Typography variant='h5'>Charitable objects:</Typography>
          <Typography variant='p'>{governingDoc?.charitable_objects || ''}</Typography>
          <Typography variant='h5'>Area of benefit:</Typography>
          <Typography variant='p'>The area the charity can operate in, as set out in its governing document.</Typography>
          <Typography variant='p'>{governingDoc?.area_of_benefit || ''}</Typography>
        </Box>
      )}

      {/* Contact information*/}
      {currentTabIndex === 7 && (
        <Box sx={{ p: 3 }}>
          <Typography variant='h5'>Address:</Typography>
          <Typography variant='p'>{contactInfo?.contact_address || 'No information available'}</Typography>
          <Typography variant='h5'>Phone:</Typography>
          <Typography variant='p'>{contactInfo?.phone || 'No information available'}</Typography>
          <Typography variant='h5'>Email:</Typography>
          <Typography variant='p'>{contactInfo?.email || 'No information available'}</Typography>
          <Typography variant='h5'>Website:</Typography>
          <Typography variant='p'>{contactInfo?.web || 'No information available'}</Typography>
        </Box>
      )}
    </>
  );
};

CharityDetailPage.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default CharityDetailPage;
