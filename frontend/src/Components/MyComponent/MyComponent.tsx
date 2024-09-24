import React from 'react';
import './myComponent.css';

const MyComponent: React.FC = () => {
  const handleGetAll = async () => {
    // const response1 = await getWarehouseDevicesAveragesByWarehouseId(
    //   '2b908e56-1fff-46ac-9710-172f67a0beb7'
    // );
    // console.log(response1.data);

    // const resBody = {
    //   id: '2b908e56-1fff-46ac-9710-172f67a0beb7',
    //   keys: {
    //     temperature: 24,
    //     humidity: 50,
    //   },
    // };
    // const response2 = await getWarehouseViolations(resBody);
    // console.log(response2.data);

    // const response = await downloadServerCertificate('http')
    // console.log(response.data)
  };

  return (
    <div className="menu-data mycomponent">
      <h1>MyComponent</h1>
      <button onClick={handleGetAll}>Get Data</button>
    </div>
  );
};

export default MyComponent;
