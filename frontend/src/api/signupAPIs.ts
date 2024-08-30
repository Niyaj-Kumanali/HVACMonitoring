import axios from 'axios';
import thingsboardAPI from './thingsboardAPI';



// Activate User by Email Code
export const activateUserByEmailCode = async (
  emailCode: string,
  pkgName?: string
): Promise<void> => {
  await thingsboardAPI.post('/noauth/activateByEmailCode', null, {
    params: { emailCode, pkgName },
  });
};

// Activate Email
export const activateEmail = async (
  emailCode: string,
  pkgName?: string
): Promise<void> => {
  await thingsboardAPI.get('/noauth/activateEmail', {
    params: { emailCode, pkgName },
  });
};

// Mobile Login
export const mobileLogin = async (
  pkgName?: string
): Promise<void> => {
  await thingsboardAPI.get('/noauth/login', {
    params: { pkgName },
  });
};

// Resend Email Activation
export const resendEmailActivation = async (
  email: string,
  pkgName?: string
): Promise<void> => {
  await thingsboardAPI.post('/noauth/resendEmailActivation', null, {
    params: { email, pkgName },
  });
};

// Sign Up
export const signUp = async (
  data: any // Replace `any` with appropriate type if known
): Promise<any> => {
  const response = await thingsboardAPI.post('/noauth/signup', data);
  return response
};

// Get Recaptcha Params
export const getRecaptchaParams = async (): Promise<any> => { // Replace `any` with appropriate type if known
  const response = await thingsboardAPI.get('/noauth/signup/recaptchaParams');
  return response.data;
};

// Get Recaptcha Public Key
export const getRecaptchaPublicKey = async (): Promise<string> => {
  const response = await thingsboardAPI.get('/noauth/signup/recaptchaPublicKey');
  return response.data;
};

// Accept Privacy Policy
export const acceptPrivacyPolicy = async (): Promise<void> => {
  await thingsboardAPI.post('/signup/acceptPrivacyPolicy');
};

// Check Privacy Policy Acceptance
export const privacyPolicyAccepted = async (): Promise<boolean> => {
  const response = await thingsboardAPI.get('/signup/privacyPolicyAccepted');
  return response.data;
};

// Delete Tenant Account
export const deleteTenantAccount = async (): Promise<void> => {
  await thingsboardAPI.delete('/signup/tenantAccount');
};
