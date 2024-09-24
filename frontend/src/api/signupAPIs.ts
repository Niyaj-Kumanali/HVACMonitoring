import { Tenant, User } from '../types/thingsboardTypes';
import { login } from './loginApi';
import { deleteTenant, saveTenant } from './tenantAPI';
import thingsboardAPI from './thingsboardAPI';
import { saveUser } from './userApi';

// Activate User by Email Code
export const activateUserByEmailCode = async (
  emailCode: string,
  pkgName?: string
) => {
  await thingsboardAPI.post('/noauth/activateByEmailCode', null, {
    params: { emailCode, pkgName },
  });
};

// Activate Email
export const activateEmail = async (emailCode: string, pkgName?: string) => {
  await thingsboardAPI.get('/noauth/activateEmail', {
    params: { emailCode, pkgName },
  });
};

// Mobile Login
export const mobileLogin = async (pkgName?: string) => {
  await thingsboardAPI.get('/noauth/login', {
    params: { pkgName },
  });
};

// Resend Email Activation
export const resendEmailActivation = async (
  email: string,
  pkgName?: string
) => {
  await thingsboardAPI.post('/noauth/resendEmailActivation', null, {
    params: { email, pkgName },
  });
};

// Sign Up
export const signUp = async (
  data: any // Replace `any` with appropriate type if known
) => {
  const response = await thingsboardAPI.post('/noauth/signup', data);
  return response;
};

// Get Recaptcha Params
export const getRecaptchaParams = async () => {
  // Replace `any` with appropriate type if known
  const response = await thingsboardAPI.get('/noauth/signup/recaptchaParams');
  return response;
};

// Get Recaptcha Public Key
export const getRecaptchaPublicKey = async () => {
  const response = await thingsboardAPI.get(
    '/noauth/signup/recaptchaPublicKey'
  );
  return response;
};

// Accept Privacy Policy
export const acceptPrivacyPolicy = async () => {
  await thingsboardAPI.post('/signup/acceptPrivacyPolicy');
};

// Check Privacy Policy Acceptance
export const privacyPolicyAccepted = async () => {
  const response = await thingsboardAPI.get('/signup/privacyPolicyAccepted');
  return response;
};

// Delete Tenant Account
export const deleteTenantAccount = async () => {
  await thingsboardAPI.delete('/signup/tenantAccount');
};

export const CreateSignUpUser = async (tenant: Tenant, tenantBody: User) => {
  // Ensure the admin is logged in and token is set
  const adminUserName = import.meta.env.VITE_THINGSBOARD_ADMINUSERNAME;
  const adminPassword = import.meta.env.VITE_THINGSBOARD_ADMINUSERPASSWORD;

  if (!adminUserName || !adminPassword) {
    throw new Error('Admin credentials are not set.');
  }

  await login(adminUserName, adminPassword);

  // Create a tenant
  const tenantResponse = await saveTenant(tenant);

  const tenantId = tenantResponse.data.id;

  const tenantUserBody: User = {
    ...tenantBody,
    tenantId: tenantId,
  };

  try {
    // Create a user
    const createdUser = await saveUser(tenantUserBody, false);
    return createdUser;
  } catch (error: any) {
    await deleteTenant(tenantId?.id);
  }
};
