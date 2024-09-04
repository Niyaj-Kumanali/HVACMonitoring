import React, { useEffect, useState } from 'react';
import './myComponent.css';
import { DashboardType, Tenant, User } from '../../types/thingsboardTypes';
import { getCurrentUser } from '../../api/loginApi';

import { saveDashboard } from '../../api/dashboardApi';
import {
  getAllWidgetsBundles,
  getWidgetsBundles,
} from '../../api/widgetsBundleAPI';
import { CreateSignUpUser } from '../../api/signupAPIs';
import { getActivationLink } from '../../api/userApi';
import { getDeviceCredentialsByDeviceId, getFilteredDevices } from '../../api/deviceApi';

const MyComponent: React.FC = () => {
  // State for dashboard creation
  const [dashboardTitle, setDashboardTitle] = useState<string>('');
  const [dashboardError, setDashboardError] = useState<string | null>(null);

  // State for widget bundles
  const [widgetBundles, setWidgetBundles] = useState<any[]>([]);
  const [loadingWidgetBundles, setLoadingWidgetBundles] =
    useState<boolean>(false);
  const [currentWidgetPage, setCurrentWidgetPage] = useState<number>(0);
  const [totalWidgetPages, setTotalWidgetPages] = useState<number>(0);

  const [orgName, setOrgName] = useState('Tenant');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const userBody: User = {
        email: email,
        authority: 'TENANT_ADMIN',
        firstName: firstName,
        lastName: lastName,
        password: password,
        phone: '123456789',
        additionalInfo: {},
      };

      const tenant: Tenant = {
        title: orgName,
      };
      const response = await CreateSignUpUser(tenant, userBody);
      const activationLink = await getActivationLink(response?.data.id?.id);

      console.log(response);
      console.log(activationLink);

      setSuccessMessage(
        'Sign-up successful! Please check your email to activate your account.'
      );
      setFirstName('');
      setLastName('');
      setEmail('');
      setPassword('');
    } catch (error) {
      console.error('Sign-up error', error);
      setErrorMessage('Sign-up failed. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch widget bundles with parameters
  const fetchAllWidgetBundles = async () => {
    try {
      const response = await getAllWidgetsBundles();
      setLoadingWidgetBundles(true);
      setWidgetBundles(response.data || []);
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
      setWidgetBundles(response.data.data || []);
      setTotalWidgetPages(response.data.totalPages ?? 0);
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
    } catch (error) {
      setDashboardError('Failed to create dashboard');
    }
  };

  const handleGetAll = async () => {
    fetchAllWidgetBundles();
    fetchWidgetBundles(currentWidgetPage);
    const currentuser = await getCurrentUser();
    console.log('Current User: \n', currentuser.data);

    const fdevices = await getFilteredDevices('78c9816c-5d45-49ea-8ba7-8524eb65624c')
    console.log(fdevices)

    const deviceInfo = await getDeviceCredentialsByDeviceId("ddebbb60-6aa0-11ef-98f0-3545332af3c6")
    console.log(deviceInfo.data)
  };

  const handlePageChangeWidgets = (page: number) => {
    if (page >= 0 && page < totalWidgetPages) {
      setCurrentWidgetPage(page);
    }
  };

  useEffect(() => {
    fetchAllWidgetBundles(); // Fetch widget bundles on component mount
    fetchWidgetBundles(currentWidgetPage);
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

      <div>
        <h2>Sign Up</h2>
        <form onSubmit={handleSignUp}>
          <div>
            <label>Organization:</label>
            <input
              type="text"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              required
            />
          </div>
          <div>
            <label>First Name:</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Last Name:</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Signing Up...' : 'Sign Up'}
          </button>
        </form>
        {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
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
