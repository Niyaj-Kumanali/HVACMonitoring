import { Layout } from "react-grid-layout";
import { chartTypes } from "../Components/Add-Widget/AddWidget";

// Device types
export interface Device {
  id?: { id: string, entityType: string };
  name?: string;
  type?: string;
  label?: string; // Optional: A user-friendly label for the device
  description?: string; // Optional: A description of the device
  credentials?: any; // Optional: Device credentials if applicable
  tenantId?: { id: string, entityType: string };
  customerId?: { id: string, entityType: string };
  additionalInfo?: any;
  active?: boolean;
  deviceProfileName?: string,
  sensors?: string[]

}

// Device Profile types
export interface DeviceProfile {
  id?: { id: string, entityType: string };
  name?: string;
  description?: string; // Optional: Description of the device profile
}

// Dashboard types
export interface DashboardType {
  id?: { id: string, entityType: string };
  title?: string;
  description?: string; // Optional: Description of the dashboard
  createdTime?: string; // Optional: ISO 8601 format
  updatedTime?: string; // Optional: ISO 8601 format
  tenantId?: { id: string, entityType: string };
  customerId?: { id: string, entityType: string };
  additionalInfo?: Object;
}

export interface DashboardInfo {
  id?: { id: string, entityType: string };
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
  id?: { id: string, entityType: string };
  name?: string;
  type?: string;
  title?: string; // Optional: Title of the widget
  bundleAlias?: string;
  configuration?: any; // Optional: Widget-specific configuration
  isSystemType?: boolean;
}

// Widget Configuration
export interface WidgetConfig {
  id?: { id: string, entityType: string };
  type?: string;
  settings?: any; // Optional: Settings for the widget
  layout?: any; // Optional: Layout configuration for the widget
}

// Widget Bundle types
export interface WidgetBundle {
  id?: { id: string, entityType: string };
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
  id?: { id: string, entityType: string }
  customerId?: { id: string, entityType: string };
  tenantId?: { id: string, entityType: string };
  firstName?: string;
  lastName?: string;
  email?: string;
  name?: string;
  authority?: string;
  additionalInfo?: {
    lastLoginTs?: number;
  };
  phone?: string;
  password?: string;
}

// Customer types
export interface Customer {
  id?: { id: string, entityType: string }
  title: string; // Title of the customer
  address?: string; // Optional: Address of the customer
  phone?: string; // Optional: Contact phone number for the customer
  country?: string; // Optional: Country of the customer
  state?: string; // Optional: State of the customer
  city?: string; // Optional: City of the customer
  zip?: string; // Optional: ZIP code of the customer
  tenantId?: { id: string, entityType: string }; // ID of the tenant the customer belongs to
  name?: string; // Optional: Name of the customer
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
  id?: { id: string, entityType: string };
  title: string;
  additionalInfo?: object;
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

export interface TelemetryData {
  [key: string]: { ts: number; value: number }[];
}

export interface WidgetLayout extends Layout {
  selectedDevice?: string; // Add this field
  selectedSensors?: string[]; // Add this field
  chart?: chartTypes;
}

export interface LayoutState {
  [dashboardId: string]: WidgetLayout[]; // Store layouts based on dashboardId
}

export interface WarehouseDimensions {
  length: string;
  width: string;
  height: string;
}


export interface dgset {
  dgset_id ?: string;
  dgset_name: string;
  fuel_capacity: string;
  fuel_type: string;
  max_output_current: number;
  motor_type: string;
  output_connector_type: string;
  output_voltage: number;
  userId: string

}

export interface grid {
  grid_id ?: string;               // Unique identifier for the grid
  grid_name: string;             // Name of the grid
  max_output_current: number;     // Maximum output current (e.g., 200)
  output_connector_type: string;  // Type of output connector (e.g., "Type 1")
  output_voltage: number;        // Output voltage (e.g., 400)
  userId: string

}

export interface LevelSlots {
  [level: number]: number[]; // Dynamic keys for levels with an array of numbers
}

export interface RoomType {
  room_id?: string;
  room_no: string;
  room_name: string;
  racks: number;
  power_point: string;
  slot: number;
  level_slots: LevelSlots;
  userId: string,
  warehouseId ?: string
}


export interface WarehouseData {
  warehouse_name: string;
  latitude: string;
  longitude: string;
  warehouse_dimensions: WarehouseDimensions;
  energy_resource: string;
  cooling_units: string | null;
  sensors: string | null;
  rooms: RoomType[];
  dgset: dgset[];
  grid: grid[];
  powerSource: boolean;
  userId: string;
  email: string;
  devices?: string[]
}

export interface VehicleDimensions {
  length: string;
  width: string;
  height: string;
}

export interface DriverDetails {
  driver_name: string;
  driver_contact_no: string;
  licence_id: string;
}

export interface VehicleData {
  vehicle_number: string;
  vehicle_name: string;
  vehicle_dimensions: VehicleDimensions;
  Driver_details: DriverDetails;
  cooling_units: string | null; // Set as string or null
  sensors: string | null; // Set as string or null
  userId: string;
  email: string;
}

export interface Warehouse {
  _id: string;
  warehouse_id: string;
  warehouse_name: string;
  location: string;
  latitude: string;
  longitude: string;
  userId: string;
  email: string;
}

export interface LocationInfo {
  display_name: string;
}