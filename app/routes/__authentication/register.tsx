import type { ActionFunction, LinksFunction, LoaderFunction, MetaFunction } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { Form, Link, useActionData, useSearchParams } from '@remix-run/react';
import validator from 'validator';
import { checkEmailExists, checkUsernameExists, createUser } from '~/database/userdb.server';
import { createUserSession, getUsername } from '~/sessions/userSession.server';
import { safeRedirect } from '~/utils';

interface IFormErrors {
  username?: string;
  email?: string;
  password?: string;
}

export const loader: LoaderFunction = async ({ request }) => {
  const username = await getUsername(request);
  if (username) return redirect('/');
  return json({});
};

export const action: ActionFunction = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  const username = formData.get('username')?.toString();
  const email = formData.get('email')?.toString();
  const password = formData.get('password')?.toString();
  const passwordCopy = formData.get('password-confirm')?.toString();
  const remember = formData.get('remember-me')?.toString();
  const redirectTo = safeRedirect(formData.get('redirectTo'), '/');

  // Verify required data
  if (!username) return json({ errors: { username: 'Username Missing' } }, { status: 400 });
  if (!password) return json({ errors: { password: 'Password Missing' } }, { status: 400 });
  if (!passwordCopy) return json({ errors: { password: 'Password Missing' } }, { status: 400 });

  //  Check if valid details
  if (!validator.isAlphanumeric(username))
    return json({ errors: { username: 'Username is not Alphanumeric' } }, { status: 400 });
  if (await checkUsernameExists(username))
    return json({ errors: { username: 'Username already taken' } }, { status: 400 });
  if (email && !validator.isEmail(email))
    return json({ errors: { email: 'Email is not valid' } }, { status: 400 });
  if (email && (await checkEmailExists(email)))
    return json({ errors: { email: 'Email already taken' } }, { status: 400 });
  if (password !== passwordCopy)
    return json({ errors: { password: 'Passwords did not match' } }, { status: 400 });

  const user = await createUser(username, password, email);

  return createUserSession(
    user.username,
    user.account?.admin || false,
    remember == 'on' ? true : false,
    redirectTo
  );
};

export default function RegisterPage() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/';

  return (
    <Form method='post' className='' id='authForm'>
      <div>
        <h2>Register an account</h2>
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
            Email address (Optional)
          </label>
          <input
            id='email'
            name='email'
            type='email'
            autoComplete='email'
            aria-describedby='email-error'
            placeholder='Email address (Optional)'
            className='midForm'
          />
        </div>
        <div className='inputBlock'>
          <label htmlFor='password' className='sr-only'>
            Password
          </label>
          <input
            id='password'
            name='password'
            type='password'
            autoComplete='new-password'
            aria-describedby='password-error'
            placeholder='Password'
            required
            className='midForm'
          />
        </div>
        <div className='inputBlock'>
          <label htmlFor='password-confirm' className='sr-only'>
            Password Confirm
          </label>
          <input
            id='password-confirm'
            name='password-confirm'
            type='password'
            autoComplete='new-password'
            aria-describedby='password-error'
            placeholder='Confirm Password'
            required
            className='botForm'
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
  );
}
