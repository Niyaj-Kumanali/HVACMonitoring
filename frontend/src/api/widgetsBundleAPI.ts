import { WidgetBundle, Widget, PageData } from '../types/thingsboardTypes';
import thingsboardAPI from './thingsboardAPI';

// Create or Update Widget Bundle
export const saveWidgetsBundle = async (
  bundle: WidgetBundle
): Promise<WidgetBundle> => {
  const response = await thingsboardAPI.post<WidgetBundle>(
    '/widgetsBundle',
    bundle
  );
  return response.data;
};

// Delete Widget Bundle
export const deleteWidgetsBundle = async (
  widgetsBundleId: string
): Promise<void> => {
  await thingsboardAPI.delete(`/widgetsBundle/${widgetsBundleId}`);
};

// Get Widget Bundle by ID
export const getWidgetsBundleById = async (
  widgetsBundleId: string,
  inlineImages?: boolean
): Promise<WidgetBundle> => {
  const response = await thingsboardAPI.get<WidgetBundle>(
    `/widgetsBundle/${widgetsBundleId}`,
    {
      params: { inlineImages },
    }
  );
  return response.data;
};

// Update Widgets Bundle Widgets List from Widget Type FQNs
export const updateWidgetsBundleWidgetFqns = async (
  widgetsBundleId: string,
  widgetTypeFqns: string[]
): Promise<void> => {
  await thingsboardAPI.post(
    `/widgetsBundle/${widgetsBundleId}/widgetTypeFqns`,
    widgetTypeFqns
  );
};

// Update Widgets Bundle Widgets Types List
export const updateWidgetsBundleWidgetTypes = async (
  widgetsBundleId: string,
  widgetTypes: Widget[]
): Promise<void> => {
  await thingsboardAPI.post(
    `/widgetsBundle/${widgetsBundleId}/widgetTypes`,
    widgetTypes
  );
};

// Get All Widget Bundles (without pagination, sorting, and search)
export const getAllWidgetsBundles = async (): Promise<WidgetBundle[]> => {
  const response = await thingsboardAPI.get<WidgetBundle[]>(
    '/widgetsBundles'
  );
  return response.data;
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
}): Promise<PageData<WidgetBundle>> => {
  const response = await thingsboardAPI.get<PageData<WidgetBundle>>(
    '/widgetsBundles',
    {
      params,
    }
  );
  return response.data;
};
