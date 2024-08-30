import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import './myComponent.css';
import {
  Device,
  DashboardType,
  User,
  DeviceQueryParams,
  PageData,
  DashboardQueryParams,
  Customer,
} from '../../types/thingsboardTypes';
import { getCurrentUser } from '../../api/loginApi';

import { getTenantDevices } from '../../api/deviceApi';
import { getTenantDashboards, saveDashboard } from '../../api/dashboardApi';
import { getActivationLink, getUsers, saveUser } from '../../api/userApi';
import {
  getAllWidgetsBundles,
  getWidgetsBundles,
} from '../../api/widgetsBundleAPI';
import { getDeviceProfileNames } from '../../api/deviceProfileAPIs';
import {
  createOrUpdateCustomer,
  getCustomers,
  getTenantCustomerByTitle,
} from '../../api/customerAPI';
import { getTenantById } from '../../api/tenantAPI';
import { acceptPrivacyPolicy, getRecaptchaParams, getRecaptchaPublicKey, privacyPolicyAccepted, signUp } from '../../api/signupAPIs';

const MyComponent: React.FC = () => {
  // State for dashboard creation
  const [dashboardTitle, setDashboardTitle] = useState<string>('');
  const [dashboardError, setDashboardError] = useState<string | null>(null);

  const [IsSendActivationMail, setIsSendActivationMail] =
    useState<boolean>(false);
  const [userError, setUserError] = useState<string | null>(null);

  // State for devices
  const [devices, setDevices] = useState<Device[]>([]);
  const [loadingDevices, setLoadingDevices] = useState<boolean>(false);

  // State for dashboards
  const [dashboards, setDashboards] = useState<DashboardType[]>([]);
  const [loadingDashboards, setLoadingDashboards] = useState<boolean>(false);

  // State for users
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState<boolean>(false);

  // State for widget bundles
  const [widgetBundles, setWidgetBundles] = useState<any[]>([]);
  const [loadingWidgetBundles, setLoadingWidgetBundles] =
    useState<boolean>(false);
  const [currentWidgetPage, setCurrentWidgetPage] = useState<number>(0);
  const [totalWidgetPages, setTotalWidgetPages] = useState<number>(0);

  const [deviceProfileNames, setDeviceProfileNames] = useState<any[]>([]);

  const [title, setTitle] = useState<string>('');
  const [email, setEmail] = useState<string>('');

  const [tenant, setTenant] = useState<User | null>(null);

  // Fetch widget bundles with parameters
  const fetchAllWidgetBundles = async () => {
    try {
      const response = await getAllWidgetsBundles();
      setLoadingWidgetBundles(true);
      setWidgetBundles(response || []);
    } catch (error) {
      console.error('Failed to fetch widget bundles', error);
    } finally {
      setLoadingWidgetBundles(false);
    }
  };

  // Fetch widget bundles with parameters
  const fetchWidgetBundles = async (page: number) => {
    try {
      setLoadingWidgetBundles(true);
      const params = {
        pageSize: 10,
        page: page,
      };
      const response = await getWidgetsBundles(params);
      setWidgetBundles(response.data || []);
      setTotalWidgetPages(response.totalPages ?? 0);
      // console.log(response.data)
    } catch (error) {
      console.error('Failed to fetch widget bundles', error);
    } finally {
      setLoadingWidgetBundles(false);
    }
  };

  // Handle dashboard creation
  const handleCreateDashboard = async () => {
    try {
      const newDashboard: DashboardType = {
        title: dashboardTitle,
      };
      await saveDashboard(newDashboard);
      setDashboardTitle('');
      alert('Dashboard created successfully!');
      fetchDashboards(0); // Optionally refetch dashboards
    } catch (error) {
      setDashboardError('Failed to create dashboard');
    }
  };

  // Handle user creation
  const handleCreateUser = async () => {
    try {
      const currentuser: User = await getCurrentUser();
      const tenant = await getTenantById(currentuser.tenantId?.id);
      setTenant(tenant);
      const newUser: User = {
        email: email,
        authority: 'TENANT_ADMIN',
        firstName: '',
        lastName: '',
        phone: '',
        additionalInfo: {},
      };
      const user = await saveUser(newUser, IsSendActivationMail);
      console.log(user);
      const activationlink = await getActivationLink(user.id?.id);
      console.log(activationlink);
      alert('User created successfully!');
      fetchUsers(0);
    } catch (error: any) {
      setUserError('Failed to create user: ' + error.message); // Display error message
    }
  };

  // Fetch devices
  const fetchDevices = async (page: number) => {
    try {
      setLoadingDevices(true);

      const params: DeviceQueryParams = {
        pageSize: 10,
        page: page,
        type: 'default',
        textSearch: '',
        sortProperty: 'name',
        sortOrder: 'ASC',
      };

      const response: PageData<Device> = await getTenantDevices(params);
      setDevices(response.data ?? []);
    } catch (error) {
      console.error('Failed to fetch devices', error);
    } finally {
      setLoadingDevices(false);
    }
  };

  // Fetch devices
  const fetchDeviceProfileNames = async (activeOnly: boolean) => {
    try {
      const names = await getDeviceProfileNames(activeOnly);
      setDeviceProfileNames(names);
    } catch (error) {
      console.error('Failed to load device profile names');
    }
  };

  // Fetch dashboards
  const fetchDashboards = async (page: number) => {
    try {
      setLoadingDashboards(true);

      const params: DashboardQueryParams = {
        pageSize: 10, // Adjust as needed
        page: page,
        textSearch: '', // Adjust as needed or remove if not searching
        sortProperty: 'title', // Adjust as needed or remove if not sorting
        sortOrder: 'ASC', // Adjust as needed or remove if not sorting
      };

      const response: PageData<DashboardType> = await getTenantDashboards(
        params
      );
      setDashboards(response.data ?? []);
    } catch (error) {
      console.error('Failed to fetch dashboards', error);
    } finally {
      setLoadingDashboards(false);
    }
  };

  // Fetch users
  const fetchUsers = async (page: number) => {
    setUserError(null);
    try {
      setLoadingUsers(true);
      const params = {
        pageSize: 10,
        page: page,
      };
      const response: PageData<User> = await getUsers(params);

      setUsers(response.data || []);
    } catch (error) {
      console.error('Failed to fetch users', error);
      setUserError('Failed to fetch users');
    } finally {
      setLoadingUsers(false);
    }
  };

  // Fetch Customers
  const fetchCustomers = async (page: number) => {
    try {
      const params = {
        pageSize: 10,
        page: page,
      };
      const response: PageData<Customer> = await getCustomers(params);

      setUsers(response.data || []);
    } catch (error) {
      console.error('Failed to fetch users', error);
    }
  };

  const initializeRecaptcha = async () => {
    try {
      // You can choose to use either recaptcha params or public key based on your implementation
      const recaptchaParams = await getRecaptchaParams();
      console.log('Recaptcha Params:', recaptchaParams);
  
      // or
      const recaptchaPublicKey = await getRecaptchaPublicKey();
      console.log('Recaptcha Public Key:', recaptchaPublicKey);
    } catch (error) {
      console.error('Error fetching Recaptcha details:', error);
    }
  };

  const registerNewUser = async () => {
    const userData = {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@company.com",
      password: "secretPassword",
      recaptchaResponse: "string", // Replace with actual response from Recaptcha widget
      pkgName: "string",
      appSecret: "string" // Optional depending on your setup
    };
    console.log(userData)
  
    try {
      // const response = await signUp(userData);
      // console.log('Sign up response:', response.data);
  
      // Step 3: Accept Privacy Policy (if required)
      const policyAccepted = await privacyPolicyAccepted();
      if (!policyAccepted) {
        await acceptPrivacyPolicy();
        console.log('Privacy Policy Accepted');
      } else {
        console.log('Privacy Policy already accepted');
      }
    } catch (error) {
      console.error('Error during sign up:', error);
    }
  };
  const handleGetAll = async () => {
    fetchDevices(0);
    fetchDashboards(0);
    fetchUsers(0);
    fetchAllWidgetBundles();
    fetchWidgetBundles(currentWidgetPage);
    fetchDeviceProfileNames(false);
    const currentuser = await getCurrentUser();
    console.log('Current User: \n', currentuser);
    fetchCustomers(0);

    initializeRecaptcha()
    registerNewUser()


    

  };

  const handlePageChangeWidgets = (page: number) => {
    if (page >= 0 && page < totalWidgetPages) {
      setCurrentWidgetPage(page);
    }
  };

  const handleCustomerSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const cust: Customer = {
        title: title,
      };

      const currentuser: User = await getCurrentUser();

      let customer = undefined;
      try {
        customer = await createOrUpdateCustomer(cust);
      } catch (error) {
        customer = await getTenantCustomerByTitle(title);
      }
      const newUser: User = {
        authority: 'CUSTOMER_USER',
        email: email,
        firstName: '',
        lastName: '',
        phone: '',
        additionalInfo: {},
        customerId: {
          id: customer.id?.id || '',
          entityType: 'CUSTOMER',
        },
        tenantId: {
          id: currentuser.id?.id || '',
          entityType: 'TENANT',
        },
      };
      const user: User = await saveUser(newUser, false);
      console.log(user);
      const activationlink = await getActivationLink(user.id?.id);
      console.log(activationlink);
      alert('Customer created successfully!');
      fetchUsers(0);
    } catch (error: any) {
      console.error('Failed to create customer: ' + error.message); // Display error message
    }
  };

  useEffect(() => {
    fetchDevices(0);
    fetchDashboards(0);
    fetchUsers(0);
    fetchAllWidgetBundles(); // Fetch widget bundles on component mount
    fetchWidgetBundles(currentWidgetPage);
    fetchDeviceProfileNames(false);
  }, []);

  useEffect(() => {
    fetchWidgetBundles(currentWidgetPage);
  }, [currentWidgetPage]);

  return (
    <div className="menu-data mycomponent">
      <h1>MyComponent</h1>
      <button onClick={handleGetAll}>Get Data</button>

      {/* Create Dashboard */}
      <div>
        <h2>Create Dashboard</h2>
        <input
          type="text"
          value={dashboardTitle}
          onChange={(e) => setDashboardTitle(e.target.value)}
          placeholder="Dashboard Title"
        />
        <button onClick={handleCreateDashboard}>Create Dashboard</button>
        {dashboardError && <p>{dashboardError}</p>}
      </div>

      {/* Create User */}
      <div>
        <h2>Create Tenant User</h2>
        <input
          type="text"
          placeholder="Tenant"
          value={tenant ? tenant.name : ''}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setEmail(e.target.value)
          }
        />
        <label>
          <input
            type="checkbox"
            checked={IsSendActivationMail}
            onChange={(e) => setIsSendActivationMail(e.target.checked)}
          />
          Send Activation Mail
        </label>
        <button onClick={handleCreateUser}>Create User</button>
        {userError && <p>{userError}</p>}
      </div>

      <div>
        <h2>Create Customer User</h2>
        <form onSubmit={handleCustomerSubmit}>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setTitle(e.target.value)
            }
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
          />
          <label>
            <input
              type="checkbox"
              checked={IsSendActivationMail}
              onChange={(e) => setIsSendActivationMail(e.target.checked)}
            />
            Send Activation Mail
          </label>
          <button type="submit">Save Customer</button>
        </form>
      </div>

      {/* Devices List */}
      <div>
        <h2>Devices</h2>
        {loadingDevices ? (
          <p>Loading devices...</p>
        ) : (
          <ul>
            {devices.map((device, index) => (
              <li key={index}>{device.name}</li>
            ))}
          </ul>
        )}
      </div>

      {/* Device Profiles List */}
      <div>
        <h2>Device Profiles</h2>
        <ul>
          {deviceProfileNames.map((deviceProfile) => (
            <li key={deviceProfile.id.id}>{deviceProfile.name}</li>
          ))}
        </ul>
        )
      </div>

      {/* Dashboards List */}
      <div>
        <h2>Dashboards</h2>
        {loadingDashboards ? (
          <p>Loading dashboards...</p>
        ) : (
          <ul>
            {dashboards.map((dashboard, index) => (
              <li key={index}>{dashboard.title}</li>
            ))}
          </ul>
        )}
      </div>

      {/* Users List */}
      <div>
        <h2>Users</h2>
        {loadingUsers ? (
          <p>Loading users...</p>
        ) : users.length > 0 ? (
          <ul>
            {users.map((user) => (
              <li key={user.id?.id}>
                {user.email}({user.authority})
              </li>
            ))}
          </ul>
        ) : (
          <p>No users found.</p>
        )}
      </div>

      {/* Widget Bundles List */}
      <div>
        <h2>Widget Bundles</h2>
        {loadingWidgetBundles ? (
          <p>Loading widget bundles...</p>
        ) : (
          <ul>
            {widgetBundles.map((bundle) => (
              <li key={bundle.id.id}>{bundle.name}</li>
            ))}
          </ul>
        )}

        {/* Pagination */}
        <button
          onClick={() => handlePageChangeWidgets(currentWidgetPage - 1)}
          disabled={currentWidgetPage <= 0}
        >
          Previous
        </button>
        <span>
          {currentWidgetPage + 1} / {totalWidgetPages}
        </span>
        <button
          onClick={() => handlePageChangeWidgets(currentWidgetPage + 1)}
          disabled={currentWidgetPage >= totalWidgetPages - 1}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default MyComponent;
