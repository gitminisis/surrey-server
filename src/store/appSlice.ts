import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
export const layout = {
  SIDE_BAR_WIDTH: 280,
  TOP_BAR_HEIGHT: 64,
};

export const componentLayout = {
  TOP_BAR_HEIGHT: 40,
};

export const auth = {
  AUTH_ACCESS_KEY: "easy_load_access_key",
  AUTH_TOKEN: "easy_load_authToken",
  TENANT: "easy_load_tenant",
  TENANT_ID: "easy_load_tenant_id",
  USER: "opac_user",
};

export const app = {
  VERSION: "easy_load_version",
};

import { RootState } from ".";

export type Tenant = {
  Name: string;
  Id: string;
  Role: string;
};

export type AppVersion = {
  version: string;
  fullVersion: string;
  branch: string;
  commit: string;
  date: string;
};

export type AppSliceState = {
  authenticated: boolean;
  version: AppVersion | null;
  tenant: Tenant | null;
};

export const save = (key: string, item: unknown) =>
  sessionStorage.setItem(
    key,
    typeof item === "string" ? item : JSON.stringify(item)
  );
export const retrieve = <T>(key: string) => {
  const item = sessionStorage.getItem(key);
  if (!item) return null;
  if (item.startsWith("{") || item.startsWith("[")) {
    try {
      return JSON.parse(item) as T;
    } catch {
      return null;
    }
  }
  return item as T;
};

const initialState: AppSliceState = {
  authenticated: retrieve(auth.AUTH_TOKEN) !== null,
  version: retrieve<AppVersion>(app.VERSION),
  tenant: retrieve<Tenant>(auth.TENANT),
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setAuthtenticated: (state, action: PayloadAction<boolean>) => {
      state.authenticated = action.payload;
    },
    setTenant: (state, action: PayloadAction<Tenant | null>) => {
      state.tenant = action.payload;
    },
  },
  extraReducers(builder) {},
});

export const { setAuthtenticated, setTenant } = appSlice.actions;

export const isAuthenticated = (state: RootState) => state.app.authenticated;
export const version = (state: RootState) => state.app.version;
export const tenant = (state: RootState) => state.app.tenant;

export default appSlice.reducer;
