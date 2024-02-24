import { Button, Label, TextInput } from 'flowbite-react';
import React from 'react';
import { Link } from 'react-router-dom';

export default function SignUp() {
  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row gap-5">
        <div className="flex-1 hidden md:inline">
          <img src="../../../public/images/blog-signup-image.jpg" alt="blog image" />
        </div>
        <div className="flex-1">
          <form className='flex flex-col gap-4'>
            <div>
              <Label value='Your username' />
              <TextInput type='text' placeholder='Username ...' id='username' />
            </div>
            <div>
              <Label value='Your email' />
              <TextInput type='email' placeholder='name@company.com' id='email' />
            </div>
            <div>
              <Label value='Your password' />
              <TextInput type='password' placeholder='Password' id='password' />
            </div>
            <Button gradientDuoTone="purpleToPink" type="submit">Sign Up</Button>
            <div className="flex gap-2 text-sm mt-5">
              <span>Have an account? </span>
              <Link to="/sign-in" className="text-blue-500">Sign In</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
