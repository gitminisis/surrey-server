import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "@/store";

interface DeviceState {
  id: string;
  loading: boolean;
}

export interface MediaDevice {
  readonly deviceId: string;
  readonly groupId: string;
  readonly kind: MediaDeviceKind;
  readonly label: string;
}

export type ModeAction = {
  action: string;
  title: string;
  icon: string;
};

export type MediaFile = {
  id: string;
  uploadId: string | undefined;
  type: string | "blob" | "image";
  mimetype: string;
  title: string;
  src: string;
};

export type EasyLoadBoxSliceState = {
  currentMode: string;
  status: string;
  modeActions: ModeAction[];
  currentAction?: string | null | undefined;
  newMediaFile?: MediaFile | null | undefined;
  mediaFileRemoved?: MediaFile;
  mediaFiles: MediaFile[];
  deviceSelected?: string | null | undefined;
  devices: MediaDevice[];
  devicesState: DeviceState[];
};

const initialState: EasyLoadBoxSliceState = {
  currentMode: "search",
  status: "init",
  modeActions: [],
  currentAction: null,
  newMediaFile: undefined,
  mediaFileRemoved: undefined,
  mediaFiles: [],
  deviceSelected: undefined,
  devices: [],
  devicesState: [],
};

export const get = createAsyncThunk("app/url", async () => {
  // const response = await GetUrl();
  // return response.data;
});

export const easyLoadBoxSlice = createSlice({
  name: "easyloadbox",
  initialState,
  reducers: {
    setMode: (state, action: PayloadAction<string>) => {
      if (!action.payload) return;
      state.currentMode = action.payload;
    },
    setStatus: (state, action: PayloadAction<string>) => {
      state.status = action.payload;
    },
    setModeActions: (state, action: PayloadAction<ModeAction[]>) => {
      state.modeActions = action.payload;
    },
    setModeAction: (
      state,
      action: PayloadAction<string | null | undefined>
    ) => {
      state.currentAction = action.payload;
    },
    addMediaFile: (state, action: PayloadAction<MediaFile>) => {
      state.newMediaFile = action.payload;
      state.mediaFiles = [...state.mediaFiles, action.payload];
    },
    newMediaFileProcessed: (state) => {
      state.newMediaFile = undefined;
    },
    updateMediaFile: (state, action: PayloadAction<MediaFile>) => {
      const files = state.mediaFiles.filter((r) => r.id !== action.payload.id);
      state.mediaFiles = [...files, action.payload];
    },
    removeMediaFile: (state, action: PayloadAction<MediaFile>) => {
      state.mediaFileRemoved = action.payload;
      state.mediaFiles = state.mediaFiles.filter(
        (r) => r.id !== action.payload.id
      );
    },
    removeMediaFileById: (state, action: PayloadAction<string>) => {
      const removed = state.mediaFiles.find(
        (r) => r.id === action.payload || r.uploadId === action.payload
      );
      if (!removed) return;
      state.mediaFiles = state.mediaFiles.filter((r) => r.id !== removed.id);
    },
    webCamSelected: (state, action: PayloadAction<string | undefined>) => {
      state.deviceSelected = action.payload;
    },
    setDevicesList: (state, action: PayloadAction<MediaDevice[]>) => {
      state.devices = action.payload;
    },
    setDevicesState: (state, action: PayloadAction<DeviceState[]>) => {
      state.devicesState = action.payload;
    },
    deviceLoaded: (state, action: PayloadAction<string>) => {
      state.devicesState = state.devicesState.map((d) =>
        d.id === action.payload ? { ...d, loading: false } : d
      );
    },
  },
});

export const {
  setMode,
  setStatus,
  setModeAction,
  setModeActions,
  addMediaFile,
  removeMediaFile,
  removeMediaFileById,
  updateMediaFile,
  newMediaFileProcessed,
  webCamSelected,
  setDevicesList,
  setDevicesState,
  deviceLoaded,
} = easyLoadBoxSlice.actions;

export const mode = (state: RootState) => state.easyLoadBox.currentMode;
export const status = (state: RootState) => state.easyLoadBox.status;
export const action = (state: RootState) => state.easyLoadBox.currentAction;
export const actions = (state: RootState) => state.easyLoadBox.modeActions;
export const recordings = (state: RootState) => state.easyLoadBox.mediaFiles;
export const deviceSelected = (state: RootState) =>
  state.easyLoadBox.deviceSelected;
export const devicesState = (state: RootState) =>
  state.easyLoadBox.devicesState;

export default easyLoadBoxSlice.reducer;
