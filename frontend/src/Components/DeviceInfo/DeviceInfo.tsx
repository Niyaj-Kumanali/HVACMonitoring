import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

const DeviceInfo: React.FC = () => {
  const { deviceId } = useParams();

  useEffect(()=> {
    
  }, [deviceId])
  return <div>DeviceInfo</div>;
};

export default DeviceInfo;
