// Device types
export interface Device {
  id?: {id: string, entityType: string};
  name?: string;
  type?: string;
  label?: string; // Optional: A user-friendly label for the device
  description?: string; // Optional: A description of the device
  credentials?: any; // Optional: Device credentials if applicable
  tenantId?: {id: string, entityType: string};
  customerId?: {id: string, entityType: string};
  additionalInfo?: Object;
  active?:boolean;
  deviceProfileName?:string,
  
}

// Device Profile types
export interface DeviceProfile {
  id?: {id: string, entityType: string};
  name?: string;
  description?: string; // Optional: Description of the device profile
}

// Dashboard types
export interface DashboardType {
  id?: {id: string, entityType: string};
  title?: string;
  description?: string; // Optional: Description of the dashboard
  createdTime?: string; // Optional: ISO 8601 format
  updatedTime?: string; // Optional: ISO 8601 format
  tenantId?: {id: string, entityType: string};
  customerId?: {id: string, entityType: string};
  additionalInfo?: Object;
}

export interface DashboardInfo {
  id?: {id: string, entityType: string};
  title?: string;
  description?: string;
  createdTime?: string;
  updatedTime?: string;
}

export interface DashboardQueryParams {
  pageSize: number;
  page: number;
  textSearch?: string;
  sortProperty?: string;
  sortOrder?: 'ASC' | 'DESC';
}

// Widget types
export interface Widget {
  id?: {id: string, entityType: string};
  name?: string;
  type?: string;
  title?: string; // Optional: Title of the widget
  bundleAlias?: string;
  configuration?: any; // Optional: Widget-specific configuration
  isSystemType?: boolean;
}

// Widget Configuration
export interface WidgetConfig {
  id?: {id: string, entityType: string};
  type?: string;
  settings?: any; // Optional: Settings for the widget
  layout?: any; // Optional: Layout configuration for the widget
}

// Widget Bundle types
export interface WidgetBundle {
  id?: {id: string, entityType: string};
  name?: string;
  alias?: string;
  description?: string;
  title?: string;
  image?: string; // Assuming inline images are base64 encoded strings
  widgets?: Widget[]; // Optional, can be an array of Widgets
}

// Interface for WidgetTypeFQN (Fully Qualified Name)
export interface WidgetTypeFQN {
  alias?: string;
  bundleAlias?: string;
  name?: string;
  type?: string;
}

// Device Query Parameters
export interface DeviceQueryParams {
  pageSize?: number;
  page?: number;
  type?: string;
  textSearch?: string;
  sortProperty?: 'createdTime' | 'name' | 'deviceProfileName' | 'label' | 'customerTitle';
  sortOrder?: 'ASC' | 'DESC';
}

// Page Data
export interface PageData<T> {
  [x: string]: any;
  data?: T[];
  totalPages?: number;
  totalElements?: number;
  hasNext?: boolean;
}

// User types
export interface User {
  id?: {id: string, entityType: string}
  customerId?: {id: string, entityType: string};
  tenantId?: {id: string, entityType: string};
  firstName?: string;
  lastName?: string;
  email?: string;
  name?: string;
  authority?: string;
  additionalInfo?: Object;
  phone?: string;
}

// Customer types
export interface Customer {
  id?: {id: string, entityType: string}
  title: string; // Title of the customer
  address?: string; // Optional: Address of the customer
  phone?: string; // Optional: Contact phone number for the customer
  country?: string; // Optional: Country of the customer
  state?: string; // Optional: State of the customer
  city?: string; // Optional: City of the customer
  zip?: string; // Optional: ZIP code of the customer
  tenantId?: {id: string, entityType: string}; // ID of the tenant the customer belongs to
}

export interface UserSettings {
  settingsId?: string;
  userId?: string;
  settings?: any;
}

export interface MobileSessionData {
  data: any[]; // Assuming data is always present
  totalPages: number;
  totalElements: number;
  hasNext: boolean;
}




// Tenant types
export interface Tenant {
  id?: {id: string, entityType: string};
  title: string;
  additionalInfo?: Object;
}

export interface TelemetryQueryParams {
  keys: string,
  startTs: number,
  endTs: number,
  intervalType?: 'MILISECONDS' | 'WEEK' | 'WEEK_ISO' | 'MONTH' | 'QUARTER',
  interval?: number,
  timeZone?: string,
  limit?: number,
  agg?: 'MIN' | 'MAX' | 'SUM' | 'AVG' | 'COUNT' | 'NONE',
  orderBy?: 'ASC' | 'DESC',
  useStrictDataTypes?: boolean
}