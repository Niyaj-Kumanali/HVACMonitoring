import { useDispatch } from 'react-redux';
import thingsboardAPI from './thingsboardAPI';
import { set_Accesstoken } from '../Redux/Action/Action';

export const login = async (
  username: string,
  password: string
): Promise<string> => {
  const dispatch = useDispatch();
  const response = await thingsboardAPI.post<{ token: string }>('/auth/login', {
    username,
    password,
  });
  const token = response.data.token;
  localStorage.setItem('token', token);
  dispatch(set_Accesstoken(token));
  return token;
};

// Existing logout function
export const logout = async (): Promise<void> => {
  await thingsboardAPI.post('/auth/logout');
  localStorage.removeItem('token');
};

// New API functions

// Change Password for Current User
export const changePassword = async (
  currentPassword: string,
  newPassword: string
): Promise<void> => {
  await thingsboardAPI.post('/auth/changePassword', {
    currentPassword,
    newPassword,
  });
};

// Get Current User
export const getCurrentUser = async (): Promise<any> => {
  const response = await thingsboardAPI.get('/auth/user');
  return response.data;
};

// Check Activate User Token
export const checkActivateToken = async (
  activateToken: string
): Promise<void> => {
  await thingsboardAPI.get('/noauth/activate', {
    params: { activateToken },
  });
};

// Activate User
export const activateUser = async (
  activateToken?: string,
  sendActivationMail?: boolean
): Promise<void> => {
  await thingsboardAPI.post('/noauth/activate', null, {
    params: { activateToken, sendActivationMail },
  });
};

// Reset Password
export const resetPassword = async (
  resetToken: string,
  password: string
) => {
  const response = await thingsboardAPI.post('/noauth/resetPassword', { resetToken, password });
  return response;
};

// Check Password Reset Token
export const checkResetToken = async (resetToken: string) => {
  const response = await thingsboardAPI.get('/noauth/resetPassword', {
    params: { resetToken },
  });
  return response
};

// Request Reset Password Email
export const requestResetPasswordByEmail = async (
  email: string
) => {
  const response = await thingsboardAPI.post('/noauth/resetPasswordByEmail', { email });
  return response;
};

// Get User Password Policy
export const getUserPasswordPolicy = async (): Promise<any> => {
  const response = await thingsboardAPI.get('/noauth/userPasswordPolicy');
  return response.data;
};
