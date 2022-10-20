import type { ActionFunction, LinksFunction, LoaderFunction, MetaFunction } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { Form, Link, useActionData, useSearchParams } from '@remix-run/react';
import * as React from 'react';
import validator from 'validator';
import { checkUsernameExists, getUserSecure } from '~/database/userdb.server';
import { createUserSession, destroyUserSession } from '~/sessions/userSession.server';

import loginFormStyle from '~/styles/loginForm.css';
import { safeRedirect } from '~/utils';

export const meta: MetaFunction = () => {
  return {
    title: 'Logout',
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
  const redirectTo = safeRedirect(formData.get('redirectTo'), '/');

  return await destroyUserSession(request);
};

export default function LogoutPage() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/';

  return (
    <Form method='post' className='' id='authForm'>
      <div>
        <h2>Sign out</h2>
      </div>

      <input type='hidden' name='redirectTo' value={redirectTo} />
      <button type='submit' className=''>
        Sign out
      </button>
    </Form>
  );
}
