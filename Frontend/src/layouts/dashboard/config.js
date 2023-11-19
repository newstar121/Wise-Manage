import ChartBarIcon from '@heroicons/react/24/solid/ChartBarIcon';
import CogIcon from '@heroicons/react/24/solid/CogIcon';
import DeviceTabletIcon from '@heroicons/react/24/solid/DeviceTabletIcon';
import LockClosedIcon from '@heroicons/react/24/solid/LockClosedIcon';
import ShoppingBagIcon from '@heroicons/react/24/solid/ShoppingBagIcon';
import UserIcon from '@heroicons/react/24/solid/UserIcon';
import UserPlusIcon from '@heroicons/react/24/solid/UserPlusIcon';
import UsersIcon from '@heroicons/react/24/solid/UsersIcon';
import XCircleIcon from '@heroicons/react/24/solid/XCircleIcon';
import { SvgIcon } from '@mui/material';

export const items = {
  admin: [
    {
      title: 'Transactions',
      path: '/transactions',
      icon: (
        <SvgIcon fontSize="small">
          <ChartBarIcon />
        </SvgIcon>
      )
    },
    {
      title: 'Balances',
      path: '/balances',
      icon: (
        <SvgIcon fontSize="small">
          <DeviceTabletIcon />
        </SvgIcon>
      )
    },
    {
      title: 'Octopus',
      path: '/electrics',
      icon: (
        <SvgIcon fontSize="small">
          <LockClosedIcon />
        </SvgIcon>
      )
    },
    {
      title: 'Charity',
      path: '/charity',
      icon: (
        <SvgIcon fontSize="small">
          <CogIcon />
        </SvgIcon>
      )
    }
  ],
  staff: [
    {
      title: 'Transactions',
      path: '/transactions',
      icon: (
        <SvgIcon fontSize="small">
          <ChartBarIcon />
        </SvgIcon>
      )
    },
    {
      title: 'Octopus',
      path: '/electrics',
      icon: (
        <SvgIcon fontSize="small">
          <LockClosedIcon />
        </SvgIcon>
      )
    },
    {
      title: 'Charity',
      path: '/charity',
      icon: (
        <SvgIcon fontSize="small">
          <CogIcon />
        </SvgIcon>
      )
    }
  ]

};
