import type { LinksFunction } from '@remix-run/node';
import styles from '~/styles/Index.css';

import { Calendar, links as calendarLinks } from '~/components/Calendar';

export const links: LinksFunction = () => {
  return [...calendarLinks(), { rel: 'stylesheet', href: styles }];
};

export default function Index() {
  return (
    <div className='devIndicator'>
      <Calendar />
    </div>
  );
}
