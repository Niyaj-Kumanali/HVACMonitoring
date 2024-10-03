import axios, { AxiosInstance } from 'axios';

export const mongoAPI: AxiosInstance = axios.create({

  baseURL: 'https://hvac.myoorja.in',
  // baseURL: 'http://localhost:2000',
  headers: {
    'Content-Type': 'application/json',
  },
});


// 3.111.205.170
// localhost

export const getLocationByLatsAndLongs = async (latitude: string , longitude: string ) => {
  const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`);
  return response
}
