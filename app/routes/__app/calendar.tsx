/* eslint-disable @typescript-eslint/no-unused-vars */
import type { LinksFunction } from '@remix-run/node';
import styles from '~/styles/Index.css';

import { Calendar, links as calendarLinks } from '~/components/calendar/Calendar';
import { Fragment } from 'react';

export const links: LinksFunction = () => {
  return [...calendarLinks(), { rel: 'stylesheet', href: styles }];
};

export default function Index() {
  const date1 = new Date(2022, 6, 1);
  const date2 = new Date(2022, 7, 1);
  const date3 = new Date(2022, 8, 1);

  return (
    <Fragment>
      <Calendar />
      {/* <Calendar targetDate={date1} /> */}
      {/* <Calendar targetDate={date2} /> */}
      {/* <Calendar targetDate={date3} /> */}
    </Fragment>
  );
}
