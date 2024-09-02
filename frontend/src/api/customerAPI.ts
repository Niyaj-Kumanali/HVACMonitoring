import { AxiosResponse } from 'axios';
import thingsboardAPI from './thingsboardAPI'; // Assuming you have thingsboardAPI instance setup
import { Customer, PageData } from '../types/thingsboardTypes';

// Customer API Methods
export const createOrUpdateCustomer = async (
  customer: Customer
) => {
  const response: AxiosResponse<Customer> = await thingsboardAPI.post<Customer>(
    '/customer',
    customer
  );
  return response;
};

export const getCustomerById = async (
  customerId: string
) => {
  const response: AxiosResponse<Customer> = await thingsboardAPI.get<Customer>(
    `/customer/${customerId}`
  );
  return response;
};

export const deleteCustomer = async (customerId: string) => {
  const response = await thingsboardAPI.delete(`/customer/${customerId}`);
  return response
};

export const getShortCustomerInfoById = async (
  customerId: string
) => {
  const response: AxiosResponse<Partial<Customer>> = await thingsboardAPI.get<
    Partial<Customer>
  >(`/customer/${customerId}/shortInfo`);
  return response;
};

export const getCustomerTitleById = async (
  customerId: string
) => {
  const response: AxiosResponse<string> = await thingsboardAPI.get<string>(
    `/customer/${customerId}/title`
  );
  return response;
};

export const getCustomers = async (params: {
  pageSize: number;
  page: number;
  textSearch?: string;
  sortProperty?: string;
  sortOrder?: string;
}) => {
  const response: AxiosResponse<PageData<Customer>> = await thingsboardAPI.get<
    PageData<Customer>
  >('/customers', {
    params,
  });
  return response;
};

export const getTenantCustomerByTitle = async (
  customerTitle: string
) => {
  const response: AxiosResponse<Customer> = await thingsboardAPI.get<Customer>(
    '/tenant/customers',
    {
      params: {
        customerTitle,
      },
    }
  );
  return response;
};
