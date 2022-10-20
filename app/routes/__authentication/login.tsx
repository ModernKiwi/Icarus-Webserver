import type { ActionFunction, LinksFunction, LoaderFunction, MetaFunction } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { Form, Link, useActionData, useSearchParams } from '@remix-run/react';
import * as React from 'react';
import validator from 'validator';
import { checkUsernameExists, getUserSecure } from '~/database/userdb.server';
import { createUserSession } from '~/sessions/userSession.server';

import { safeRedirect } from '~/utils';

export const meta: MetaFunction = () => {
  return {
    title: 'Login',
  };
};

interface ActionData {
  errors?: {
    email?: string;
    password?: string;
  };
}

export const loader: LoaderFunction = async ({ request }) => {
  return json({});
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const username = formData.get('username')?.toString();
  const password = formData.get('password')?.toString();
  const remember = formData.get('remember-me')?.toString();
  const redirectTo = safeRedirect(formData.get('redirectTo'), '/');

  // Verify required data
  if (!username) return json({ errors: { username: 'Username Missing' } }, { status: 400 });
  if (!password) return json({ errors: { password: 'Password Missing' } }, { status: 400 });

  //  Check if valid details
  if (!validator.isAlphanumeric(username))
    return json({ errors: { username: 'Username is not Alphanumeric' } }, { status: 400 });
  if (!(await checkUsernameExists(username)))
    return json({ errors: { username: 'Username not found' } }, { status: 400 });

  //Log user in
  const user = await getUserSecure(username, password);

  if (user === null)
    return json({ errors: { password: 'Credentials incorrect' } }, { status: 400 });

  return createUserSession(
    user.username,
    user.account?.admin || false,
    remember == 'on' ? true : false,
    redirectTo
  );
};

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/';

  return (
    <Form method='post' className='' id='authForm'>
      <div>
        <h2>Sign in</h2>
      </div>
      <div className='' id='formInputBlock'>
        <div className='inputBlock'>
          <label htmlFor='username' className='sr-only'>
            Username
          </label>
          <input
            id='username'
            required
            autoFocus={true}
            name='username'
            type='text'
            aria-describedby='username-error'
            placeholder='Uername'
            className='topForm'
          />
        </div>
        <div className='inputBlock'>
          <label htmlFor='email' className='sr-only'>
            Password
          </label>
          <input
            id='password'
            name='password'
            type='password'
            autoComplete='current-password'
            aria-describedby='password-error'
            placeholder='Password'
            required
            className='botForm'
          />
        </div>
      </div>

      <input type='hidden' name='redirectTo' value={redirectTo} />
      <button type='submit' className=''>
        Log in
      </button>

      <div className=''>
        <input id='remember' name='remember' type='checkbox' className='' />
        <label htmlFor='remember-me' className=''>
          Remember me
        </label>
      </div>
      <div className=''>
        Don't have an account?{' '}
        <Link
          className=''
          to={{
            pathname: '/register',
            search: searchParams.toString(),
          }}
        >
          Sign up
        </Link>
      </div>
    </Form>
  );
}
