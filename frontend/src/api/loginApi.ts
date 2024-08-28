import { useDispatch } from "react-redux";
import { User } from "../types/thingsboardTypes";
import thingsboardAPI from "./thingsboardAPI";
import { set_Accesstoken } from "../Redux/Action/Action";

export const login = async (
  username: string,
  password: string
): Promise<string> => {
  const dispatch = useDispatch();
  const response = await thingsboardAPI.post<{ token: string }>(
    '/auth/login',
    { username, password }
  );
  const token = response.data.token;
  localStorage.setItem('token', token);
  dispatch(set_Accesstoken(token));
  return token;
};

// Existing logout function
export const logout = (): void => {
  localStorage.removeItem('token');
};

// New API functions

// Change Password
export const changePassword = async (
  currentPassword: string,
  newPassword: string
): Promise<void> => {
  await thingsboardAPI.post('/auth/changePassword', {
    currentPassword,
    newPassword
  });
};

// Get Current User
export const getCurrentUser = async (): Promise<User> => {
  const response = await thingsboardAPI.get<User>('/auth/user');
  return response.data;
};

// Check Activate Token
export const checkActivateToken = async (activateToken: string): Promise<void> => {
  await thingsboardAPI.get(`/noauth/activate`, { params: { activateToken } });
};

// Activate User
export const activateUser = async (activateToken: string, sendActivationMail: boolean): Promise<void> => {
  await thingsboardAPI.post(`/noauth/activate`, { activateToken, sendActivationMail });
};

// Reset Password
export const resetPassword = async (newPassword: string, resetToken: string): Promise<void> => {
  await thingsboardAPI.post('/noauth/resetPassword', { newPassword, resetToken });
};

// Check Reset Token
export const checkResetToken = async (resetToken: string): Promise<void> => {
  await thingsboardAPI.get('/noauth/resetPassword', { params: { resetToken } });
};

// Request Reset Password Email
export const requestResetPasswordEmail = async (email: string): Promise<void> => {
  await thingsboardAPI.post('/noauth/resetPasswordByEmail', { email });
};

// Get User Password Policy
export const getUserPasswordPolicy = async (): Promise<any> => {
  const response = await thingsboardAPI.get('/noauth/userPasswordPolicy');
  return response.data;
};
