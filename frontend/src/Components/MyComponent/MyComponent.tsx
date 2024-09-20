import React, { useEffect, useState } from 'react';
import './myComponent.css';

import {
  getAllWidgetsBundles,
  getWidgetsBundles,
} from '../../api/widgetsBundleAPI';

import { getWarehouseDevicesAveragesByWarehouseId, getWarehouseViolations } from '../../api/telemetryAPIs';

const MyComponent: React.FC = () => {
  // State for widget bundles
  const [widgetBundles, setWidgetBundles] = useState<any[]>([]);
  const [loadingWidgetBundles, setLoadingWidgetBundles] =
    useState<boolean>(false);
  const [currentWidgetPage, setCurrentWidgetPage] = useState<number>(0);
  const [totalWidgetPages, setTotalWidgetPages] = useState<number>(0);

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

  const handleGetAll = async () => {
    const response1 = await getWarehouseDevicesAveragesByWarehouseId('2b908e56-1fff-46ac-9710-172f67a0beb7')
    console.log(response1.data)

    const resBody = {
      "id": "2b908e56-1fff-46ac-9710-172f67a0beb7",
      "keys": {
        "temperature": 24,
        "humidity": 50
      }
    }
    const response2 = await getWarehouseViolations(resBody)
    console.log(response2.data)

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
