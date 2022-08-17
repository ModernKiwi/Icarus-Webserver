import type { LinksFunction } from '@remix-run/node';
import styleSheet from './Index.css';

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: styleSheet }];
};

export default function Index() {
  return <div className='test'></div>;
}
