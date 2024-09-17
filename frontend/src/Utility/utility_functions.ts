import {v4 as uuid4} from 'uuid'

export const uuid = () => {
  return uuid4()
}

export const formatNumber = (num: number) => {
  const formatter = new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short',
  });

  return formatter.format(num);
};
