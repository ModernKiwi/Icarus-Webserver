import { createCookieSessionStorage } from '@remix-run/node'; // or cloudflare/deno
import { redirect } from '@remix-run/node';

const storage = createCookieSessionStorage({
  cookie: {
    name: '__session',
    // domain: "modern.kiwi",
    path: '/',
    sameSite: 'lax',
    httpOnly: true,
    secure: true,
    maxAge: 0,
  },
});

function getUserSession(request: Request) {
  return storage.getSession(request.headers.get('__session'));
}

export async function createUserSession(
  username: string,
  isAdmin: boolean,
  remember: boolean,
  redirectTo: string
) {
  const session = await storage.getSession();

  session.set('username', username);
  session.set('isAdmin', isAdmin);

  return redirect(redirectTo, {
    headers: {
      'Set-Cookie': await storage.commitSession(session, {
        maxAge: remember
          ? 60 * 60 * 24 * 30 // 30 days
          : undefined,
      }),
    },
  });
}

export async function destroyUserSession(request: Request) {
  const session = await getUserSession(request);

  return redirect('/', {
    headers: {
      'Set-Cookie': await storage.destroySession(session),
    },
  });
}

//  Util functions
export async function getUsername(request: Request) {
  const session = await getUserSession(request);
  const username = session.get('username');
  if (!username || typeof username !== 'string') return null;
  return username;
}
