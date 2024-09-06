import { Layout } from "react-grid-layout";

export const SET_LAYOUT = 'SET_LAYOUT';

export const setLayout = (layout: Layout[]) => ({
  type: SET_LAYOUT,
  payload: layout,
});