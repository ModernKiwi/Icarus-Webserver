import { createCookieSessionStorage, redirect } from '@remix-run/node';

export interface IUserSession {
  username: string;
  admin: boolean;
}

// const { getSession, commitSession, destroySession } = createCookieSessionStorage({
const storage = createCookieSessionStorage({
  // a Cookie from `createCookie` or the CookieOptions to create one
  cookie: {
    name: '__userCookie',

    // all of these are optional
    // domain: 'modern.kiwi',
    // Expires can also be set (although maxAge overrides it when used in combination).
    // Note that this method is NOT recommended as `new Date` creates only one date on each server deployment, not a dynamic date in the future!
    //
    // expires: new Date(Date.now() + 60_000),
    httpOnly: true,
    maxAge: 0,
    path: '/',
    sameSite: 'lax',
    secrets: ['s3cret1'],
    secure: false,
  },
});

//  Private functions?
function getUserSession(request: Request) {
  return storage.getSession(request.headers.get('__userCookie'));
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
