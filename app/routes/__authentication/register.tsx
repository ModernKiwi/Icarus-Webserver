import type { ActionFunction, LinksFunction, LoaderFunction, MetaFunction } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { Form, Link, useActionData, useSearchParams } from '@remix-run/react';
import validator from 'validator';
import { checkEmailExists, checkUsernameExists, createUser } from '~/database/userdb.server';
import { createUserSession, getUsername } from '~/sessions/userSession.server';
import { safeRedirect } from '~/utils';

import { TextInput, cssLinks } from '~/components/inputs/TextInput';

export const links: LinksFunction = () => {
  return [...cssLinks()];
};

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
  const remember = formData.get('remember')?.toString();
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
  const redirectTo = searchParams.get('redirectTo') || '/dashboard';

  return (
    <Form method='post' className='' id='authForm'>
      <div>
        <h2>Register an account</h2>
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
          labelText={'email'}
          inputType={'email'}
          placeholdText={'Email (Optional)'}
          inputCSSType={'midForm'}
        />
        <TextInput
          labelText={'password'}
          inputType={'password'}
          placeholdText={'Password'}
          inputCSSType={'midForm'}
          required
          autoComplete='new-password'
        />
        <TextInput
          labelText={'password-confirm'}
          inputType={'password'}
          placeholdText={'Confirm Password'}
          inputCSSType={'botForm'}
          required
          autoComplete='new-password'
        />
      </div>

      <div className='tempSpacer'>
        <input id='remember' name='remember' type='checkbox' className='' />
        <label htmlFor='remember' className=''>
          Remember me
        </label>
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
