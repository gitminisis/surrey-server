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
// import { Box, CardActionArea, Stack, CardContent, Card } from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
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
} from "@/store/easyLoadBoxSlice";
import { Card, CardHeader, Box, CardBody } from "@chakra-ui/react";

interface WebcamCaptureProps {
  visible?: boolean | null | undefined;
}

const actions = [
  { action: "takePicture", title: "Take picrure", icon: "addPhoto" },
  { action: "listDevices", title: "List devices", icon: "list" },
];

const VideoRecorder = ({
  visible = true,
}: WebcamCaptureProps): ReactElement => {
  const dispatch = useAppDispatch();
  const action = useAppSelector((state) => state.easyLoadBox.currentAction);
  const selectedCam = useAppSelector(
    (state) => state.easyLoadBox.deviceSelected
  );
  const devices = useAppSelector((state) => state.easyLoadBox.devices);
  const devicesState = useAppSelector(
    (state) => state.easyLoadBox.devicesState
  );
  const mediaFiles = useAppSelector((state) => state.easyLoadBox.mediaFiles);

  const webCamRef = useRef<Webcam>(null);
  useEffect(() => {
    dispatch(setModeActions(actions));
  }, []);

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
    <>
      {devices
        .filter((d) => (selectedCam ? d.deviceId === selectedCam : d.deviceId))
        .map((device, key) => (
          <Fragment key={`media-files-${key}`}>
            <Card onClick={() => handleCamSelect(device)}>
              <CardHeader>
                <Box>
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
                <CardBody>{device.label || `Device ${key + 1}`}</CardBody>
              </CardHeader>
            </Card>
            {selectedCam && (
              <div
                style={{
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
                  <image
                    // component="img"
                    alt="mfkey"
                    style={{ width: "19%", margin: "0.5%", cursor: "pointer" }}
                    key={`media-files-${mfkey}`}
                    src={mf.type === "blob" ? "/video.png" : mf.src}
                    onClick={() => dispatch(removeMediaFile(mf))}
                  />
                ))}
              </div>
            )}
          </Fragment>
        ))}
    </>
  );
};

export default VideoRecorder;
