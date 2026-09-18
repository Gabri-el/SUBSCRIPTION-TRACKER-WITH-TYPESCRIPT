import { z } from 'zod';

const userSignUpSchema = z.object({
  name: z
    .string( 'User Name is required' )
    .trim()
    .min(2, 'User Name must be at least 2 characters')
    .max(50, 'User Name must be at most 50 characters'),

  email: z
    .string('User Email is required' )
    .trim()
    .toLowerCase()
    .email('Please fill a valid email address'),

  password: z
    .string( 'User Password is required' )
    .min(6, 'User Password must be at least 6 characters'),
});


const userLoginSchema = z.object({
  email: z
    .string('User Email is required' )
    .trim()
    .toLowerCase()
    .email('Please fill a valid email address'),

  password: z
    .string( 'User Password is required' )

});


export  {userLoginSchema, userSignUpSchema};

