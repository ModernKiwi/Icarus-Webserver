import type { LinksFunction, MetaFunction } from '@remix-run/node';
import {
  Links,
  LiveReload,
  Meta,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react';
import rootStyles from '~/styles/root.css';
import navlinkStyles from '~/styles/navlinks.css';
import indexStyles from '~/styles/index.css';

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'ModernKiwi Website',
  viewport: 'width=device-width,initial-scale=1',
});

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: rootStyles },
    { rel: 'stylesheet', href: navlinkStyles },
    { rel: 'stylesheet', href: indexStyles },
  ];
};

interface ILink {
  url: string;
  text: string;
  end: boolean;
}

const navURLs: ILink[] = [
  { url: '/', text: 'Home', end: true },
  { url: '/calendar', text: 'Calendar', end: false },
  { url: '/login', text: 'login', end: false },
  { url: '/register', text: 'Register', end: false },
  { url: '/logout', text: 'Logout', end: false },
];

export default function App() {
  return (
    <html lang='en'>
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <div id='siteContainer'>
          <div id='siteHeader'>
            <img src='./weblogo.svg' alt='ModernKiwi Logo' />
            <div>
              <nav>
                {navURLs.map((link, index) => (
                  <NavLink
                    key={index}
                    to={link.url}
                    className={({ isActive }) => (isActive ? 'navLink navLinkCurrent' : 'navLink')}
                    end
                  >
                    {link.text}
                  </NavLink>
                ))}
              </nav>
            </div>
          </div>
          <div id='siteBody'>
            <Outlet />
          </div>
        </div>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
