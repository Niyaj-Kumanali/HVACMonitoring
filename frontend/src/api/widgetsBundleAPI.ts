import { WidgetBundle, Widget, PageData } from '../types/thingsboardTypes';
import thingsboardAPI from './thingsboardAPI';

// Create or Update Widget Bundle
export const saveWidgetsBundle = async (
  bundle: WidgetBundle
) => {
  const response = await thingsboardAPI.post<WidgetBundle>(
    '/widgetsBundle',
    bundle
  );
  return response;
};

// Delete Widget Bundle
export const deleteWidgetsBundle = async (
  widgetsBundleId: string
) => {
  await thingsboardAPI.delete(`/widgetsBundle/${widgetsBundleId}`);
};

// Get Widget Bundle by ID
export const getWidgetsBundleById = async (
  widgetsBundleId: string,
  inlineImages?: boolean
) => {
  const response = await thingsboardAPI.get<WidgetBundle>(
    `/widgetsBundle/${widgetsBundleId}`,
    {
      params: { inlineImages },
    }
  );
  return response;
};

// Update Widgets Bundle Widgets List from Widget Type FQNs
export const updateWidgetsBundleWidgetFqns = async (
  widgetsBundleId: string,
  widgetTypeFqns: string[]
) => {
  await thingsboardAPI.post(
    `/widgetsBundle/${widgetsBundleId}/widgetTypeFqns`,
    widgetTypeFqns
  );
};

// Update Widgets Bundle Widgets Types List
export const updateWidgetsBundleWidgetTypes = async (
  widgetsBundleId: string,
  widgetTypes: Widget[]
) => {
  await thingsboardAPI.post(
    `/widgetsBundle/${widgetsBundleId}/widgetTypes`,
    widgetTypes
  );
};

// Get All Widget Bundles (without pagination, sorting, and search)
export const getAllWidgetsBundles = async () => {
  const response = await thingsboardAPI.get<WidgetBundle[]>(
    '/widgetsBundles'
  );
  return response;
};

// Get Widget Bundles (Paginated, Sorted, Searchable)
export const getWidgetsBundles = async (params: {
  pageSize: number;
  page: number;
  textSearch?: string;
  sortProperty?: string;
  sortOrder?: string;
  tenantOnly?: boolean;
  fullSearch?: boolean;
}) => {
  const response = await thingsboardAPI.get<PageData<WidgetBundle>>(
    '/widgetsBundles',
    {
      params,
    }
  );
  return response;
};
