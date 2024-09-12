// import { v1 as uuidv1 } from 'uuid';

// export const generateUUIDv1 = () => {
//   return uuidv1();
// };

export const formatNumber = (num: number) => {
  const formatter = new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short',
  });

  return formatter.format(num);
};
