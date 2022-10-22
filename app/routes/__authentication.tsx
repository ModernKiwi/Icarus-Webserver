import type { LinksFunction } from '@remix-run/node';
import { Outlet } from '@remix-run/react';

import authPagesStyle from '~/styles/authPages.css';

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: authPagesStyle }];
};

export default function __authentication() {
  return (
    <div className='' id='siteBodyContainer authBody'>
      <Outlet />
    </div>
  );
}
