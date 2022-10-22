import { Outlet } from '@remix-run/react';

export default function Index() {
  return (
    <div className='' id='siteBodyContainer'>
      <Outlet />
    </div>
  );
}
