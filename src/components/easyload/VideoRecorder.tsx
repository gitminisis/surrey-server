"use client";
import React, {
  ReactElement,
  useRef,
  useEffect,
  useCallback,
  Fragment,
} from "react";
import VideoLogo from "/video.png";
import Webcam from "react-webcam";
import LoadingOverlay from "react-loading-overlay-ts";
import moment from "moment";
import { Box, CardActionArea, Stack, CardContent, Card } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  setModeAction,
  setModeActions,
  addMediaFile,
  webCamSelected,
  removeMediaFile,
  setDevicesList,
  setDevicesState,
  deviceLoaded,
  MediaDevice,
} from "../app/easyLoadBoxSlice";

interface WebcamCaptureProps {
  visible?: boolean | null | undefined;
}

const actions = [
  { action: "takePicture", title: "Take picrure", icon: "addPhoto" },
  { action: "listDevices", title: "List devices", icon: "list" },
];

const WebcamCapture = ({
  visible = true,
}: WebcamCaptureProps): ReactElement => {
  const dispatch = useAppDispatch();
  const action = useAppSelector((state) => state.easyLoadBox.currentAction);
  const mode = useAppSelector((state) => state.easyLoadBox.currentMode);
  const selectedCam = useAppSelector(
    (state) => state.easyLoadBox.deviceSelected
  );
  const devices = useAppSelector((state) => state.easyLoadBox.devices);
  const devicesState = useAppSelector(
    (state) => state.easyLoadBox.devicesState
  );
  const mediaFiles = useAppSelector((state) => state.easyLoadBox.mediaFiles);

  const webCamRef = useRef<Webcam>(null);

  useEffect(
    () => () => {
      dispatch(setModeActions([]));
    },
    []
  );

  useEffect(() => {
    if (mode === "photo") {
      dispatch(setModeActions(actions));
    }
  }, [mode]);

  useEffect(() => {
    switch (action) {
      case "takePicture":
        {
          const src = webCamRef.current?.getScreenshot();
          const date = moment().format("LLL");
          const camName = devices.find(
            (d) => d.deviceId === selectedCam
          )?.label;

          if (src)
            dispatch(
              addMediaFile({
                id: crypto.randomUUID(),
                uploadId: undefined,
                src,
                title: `${camName} ${date}.jpg`,
                type: "image",
                mimetype: "image/jpg",
              })
            );

          dispatch(setModeAction(null));
        }
        break;
      case "listDevices":
        dispatch(webCamSelected());
        break;
      default:
        break;
    }
  }, [action]);

  const handleDevices = useCallback((mediaDevices: MediaDevice[]) => {
    const videoInputs = mediaDevices
      .filter(({ kind }: MediaDevice) => kind === "videoinput")
      .map((vi) => ({
        deviceId: vi.deviceId,
        kind: vi.kind,
        groupId: vi.groupId,
        label: vi.label,
      }));
    dispatch(setDevicesList(videoInputs));
    dispatch(
      setDevicesState([
        ...videoInputs.map((i) => ({ id: i.deviceId, loading: true })),
        { id: "selected", loading: true },
      ])
    );
  }, []);

  useEffect(() => {
    if (!selectedCam)
      navigator.mediaDevices.enumerateDevices().then(handleDevices);
  }, []);

  const isLoading = (id: string) =>
    devicesState.find((s) => s.id === id)?.loading || false;
  const handleCamSelect = (device: MediaDevice) => {
    if (selectedCam || isLoading(device.deviceId)) return;
    dispatch(webCamSelected(device.deviceId));
  };

  return (
    <Box
      sx={{
        width: "100%",
        display: visible ? "flex" : "none",
        justifyContent: "center",
        backgroundColor: "background.paper",
      }}
    >
      <Stack
        alignItems="center"
        direction="column"
        sx={{ px: 1, width: "100%", overflow: "auto" }}
      >
        {devices
          .filter((d) =>
            selectedCam ? d.deviceId === selectedCam : d.deviceId
          )
          .map((device, key) => (
            <Fragment key={`media-files-${key}`}>
              <Card
                sx={{
                  width: "100%",
                  height: "20%",
                  borderRadius: 0.4,
                  my: 0.5,
                }}
                onClick={() => handleCamSelect(device)}
              >
                <CardActionArea
                  sx={{
                    display: "flex",
                    height: "100%",
                    width: "100%",
                    justifyContent: "start",
                  }}
                >
                  <Box
                    sx={{
                      width: "35%",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <LoadingOverlay active={isLoading(device.deviceId)} spinner>
                      <Webcam
                        ref={selectedCam ? webCamRef : null}
                        audio={false}
                        videoConstraints={{ deviceId: device.deviceId }}
                        onUserMedia={() =>
                          dispatch(deviceLoaded(device.deviceId))
                        }
                      />
                    </LoadingOverlay>
                  </Box>
                  <CardContent
                    sx={{
                      display: "flex",
                      flexGrow: 1,
                      justifyContent: "center",
                    }}
                  >
                    {device.label || `Device ${key + 1}`}
                  </CardContent>
                </CardActionArea>
              </Card>
              {selectedCam && (
                <Box
                  sx={{
                    width: "100%",
                    height: "80%",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "flex-start",
                    alignContent: "flex-start",
                    flexWrap: "wrap",
                    overflow: "auto",
                  }}
                >
                  {mediaFiles.map((mf, mfkey) => (
                    <Box
                      component="img"
                      sx={{ width: "19%", m: "0.5%", cursor: "pointer" }}
                      key={`media-files-${mfkey}`}
                      src={mf.type === "blob" ? VideoLogo : mf.src}
                      onClick={() => dispatch(removeMediaFile(mf))}
                    />
                  ))}
                </Box>
              )}
            </Fragment>
          ))}
      </Stack>
    </Box>
  );
};

export default WebcamCapture;
