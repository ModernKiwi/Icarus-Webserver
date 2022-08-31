import { Outlet } from '@remix-run/react';

export default function __authentication() {
  return (
    <div className=''>
      <div className=''>
        <Outlet />
      </div>
    </div>
  );
}
