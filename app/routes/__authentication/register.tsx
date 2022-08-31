import type { ActionFunction, LoaderFunction, MetaFunction } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { Form, Link, useActionData, useSearchParams } from '@remix-run/react';
import * as React from 'react';

export default function RegisterPage() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/dashboard';
  const emailRef = React.useRef<HTMLInputElement>(null);
  const passwordRef = React.useRef<HTMLInputElement>(null);

  return (
    <div className=''>
      <Form method='post' className=''>
        <div className=''>
          <div className=''>
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
              autoComplete='new-password'
              aria-describedby='password-error'
              placeholder='Password'
              required
              className=''
            />
          </div>
          <div>
            <label htmlFor='password-confirm' className=''>
              Password
            </label>
            <input
              id='password-confirm'
              ref={passwordRef}
              name='password-confirm'
              type='password'
              autoComplete='new-password'
              aria-describedby='password-error'
              placeholder='Confirm Password'
              required
              className=''
            />
          </div>
        </div>

        <div className=''>
          <div className='flex items-center'>
            <input id='remember-me' name='remember-me' type='checkbox' className='' />
            <label htmlFor='remember-me' className=''>
              Remember me
            </label>
          </div>
        </div>

        <div>
          <input type='hidden' name='redirectTo' value={redirectTo} />
          <button type='submit' className=''>
            Submit
          </button>
        </div>
      </Form>
    </div>
  );
}
