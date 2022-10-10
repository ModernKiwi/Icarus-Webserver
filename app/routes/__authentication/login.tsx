import type { ActionFunction, LoaderFunction, MetaFunction } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { Form, Link, useActionData, useSearchParams } from '@remix-run/react';
import * as React from 'react';

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
  // const userEmail = await getUserEmail(request);
  // if (userEmail) return redirect('/dashboard');

  return json({});
};

export const action: ActionFunction = async ({ request }) => {
  // const formData = await request.formData();
  // const email = formData.get('email');
  // const password = formData.get('password');
  // const remember = formData.get('remember');
  // const redirectTo = safeRedirect(formData.get('redirectTo'), '/');
  // if (!validateEmail(email)) {
  //   return json<ActionData>({ errors: { email: 'Email is invalid' } }, { status: 400 });
  // }
  // if (typeof password !== 'string') {
  //   return json<ActionData>({ errors: { password: 'Password is required' } }, { status: 400 });
  // }
  // if (password.length < 8) {
  //   return json<ActionData>({ errors: { password: 'Password is too short' } }, { status: 400 });
  // }
  // const user = await verifyLogin(email, password);
  // if (!user) {
  //   return json<ActionData>({ errors: { email: 'Invalid email or password' } }, { status: 400 });
  // }
  // return createUserSession({
  //   request,
  //   user,
  //   remember: remember === 'on' ? true : false,
  //   redirectTo,
  // });
};

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/dashboard';
  const emailRef = React.useRef<HTMLInputElement>(null);
  const passwordRef = React.useRef<HTMLInputElement>(null);

  return (
    <div className=''>
      <Form method='post' className=''>
        <div>
          <div>
            <label htmlFor='email' className=''>
              Email address
            </label>
            <input
              ref={emailRef}
              id='email'
              required
              autoFocus={true}
              name='email'
              type='email'
              autoComplete='email'
              aria-describedby='email-error'
              placeholder='Email address'
              className=''
            />
          </div>
          <div>
            <label htmlFor='password' className=''>
              Password
            </label>
            <input
              id='password'
              ref={passwordRef}
              name='password'
              type='password'
              autoComplete='current-password'
              aria-describedby='password-error'
              placeholder='Password'
              required
              className=''
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
    </div>
  );
}
