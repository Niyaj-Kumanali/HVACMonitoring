import { AxiosResponse } from 'axios';
import thingsboardAPI from './thingsboardAPI'; // Assuming you have thingsboardAPI instance setup
import { Customer, PageData } from '../types/thingsboardTypes';

// Customer API Methods
export const createOrUpdateCustomer = async (
  customer: Customer
): Promise<Customer> => {
  const response: AxiosResponse<Customer> = await thingsboardAPI.post<Customer>('/customer', customer);
  return response.data;
};

export const getCustomerById = async (
  customerId: string
): Promise<Customer> => {
  const response: AxiosResponse<Customer> = await thingsboardAPI.get<Customer>(`/customer/${customerId}`);
  return response.data;
};

export const deleteCustomer = async (customerId: string): Promise<void> => {
  await thingsboardAPI.delete(`/customer/${customerId}`);
};

export const getShortCustomerInfoById = async (
  customerId: string
): Promise<Partial<Customer>> => {
  const response: AxiosResponse<Partial<Customer>> = await thingsboardAPI.get<Partial<Customer>>(`/customer/${customerId}/shortInfo`);
  return response.data;
};

export const getCustomerTitleById = async (
  customerId: string
): Promise<string> => {
  const response: AxiosResponse<string> = await thingsboardAPI.get<string>(`/customer/${customerId}/title`);
  return response.data;
};

export const getCustomers = async (params: {
  pageSize: number;
  page: number;
  textSearch?: string;
  sortProperty?: string;
  sortOrder?: string;
}): Promise<PageData<Customer>> => {
  const response: AxiosResponse<PageData<Customer>> = await thingsboardAPI.get<PageData<Customer>>('/customers', {
    params,
  });
  return response.data;
};

export const getTenantCustomerByTitle = async (
  customerTitle: string
): Promise<Customer> => {
  const response: AxiosResponse<Customer> = await thingsboardAPI.get<Customer>('/tenant/customers', {
    params: {
      customerTitle,
    },
  });
  return response.data;
};
