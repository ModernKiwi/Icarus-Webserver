import type { ActionFunction, LinksFunction, LoaderFunction, MetaFunction } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { Form, Link, useActionData, useSearchParams } from '@remix-run/react';
import * as React from 'react';
import validator from 'validator';
import { checkUsernameExists, getUserSecure } from '~/database/userdb.server';
import { createUserSession } from '~/sessions/userSession.server';

import { safeRedirect } from '~/utils';

import { TextInput, cssLinks } from '~/components/inputs/TextInput';

export const links: LinksFunction = () => {
  return [...cssLinks()];
};

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
  const remember = formData.get('remember')?.toString();
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
  const redirectTo = searchParams.get('redirectTo') || '/dashboard';

  return (
    <Form method='post' className='' id='authForm'>
      <div>
        <h2>Sign in</h2>
      </div>
      <div className='' id='formInputBlock'>
        <TextInput
          labelText={'username'}
          inputType={'text'}
          placeholdText={'Username'}
          inputCSSType={'topForm'}
          required
          autoComplete='username'
        />
        <TextInput
          labelText={'password'}
          inputType={'password'}
          placeholdText={'Password'}
          inputCSSType={'botForm'}
          required
          autoComplete='current-password'
        />
      </div>

      <input type='hidden' name='redirectTo' value={redirectTo} />
      <button type='submit' className=''>
        Log in
      </button>

      <div className='tempSpacer'>
        <input id='remember' name='remember' type='checkbox' className='' />
        <label htmlFor='remember' className=''>
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
