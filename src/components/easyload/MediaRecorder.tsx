import React, { ReactElement, useEffect, useRef, useState } from 'react';
import moment from 'moment';
import { useReactMediaRecorder } from 'react-media-recorder';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import {
  addMediaFile,
  setModeActions,
  setStatus,
} from '@/store/easyLoadBoxSlice';

interface MediaRecorderProps {
  visible?: boolean | null | undefined;
  screen?: boolean | undefined;
  video?: boolean | undefined;
  audio?: boolean | undefined;
  askPermissionOnMount?: boolean | undefined;
}

const actions = [
  { action: 'startRecording', title: 'Start recording', icon: 'play' },
  { action: 'stopRecording', title: 'Stop recording', icon: 'stop' },
];

const MediaRecorder = ({
  screen,
  video,
  audio,
  askPermissionOnMount,
}: MediaRecorderProps): ReactElement => {
  const dispatch = useAppDispatch();
  const action = useAppSelector((state) => state.easyLoadBox.currentAction);
  const mode = useAppSelector((state) => state.easyLoadBox.currentMode);
  const [preview, setPreview] = useState<boolean | undefined>(true);
  const { status, startRecording, stopRecording, mediaBlobUrl, previewStream } =
    useReactMediaRecorder({ screen, video, audio, askPermissionOnMount });

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(
    () => () => {
      dispatch(setModeActions([]));
      dispatch(setStatus(''));
    },
    []
  );

  useEffect(() => {
    if (mode === 'video' || mode === 'screen') {
      dispatch(setModeActions(actions));
    }
  }, [mode]);

  useEffect(() => {
    if (videoRef.current && preview) {
      videoRef.current.srcObject = previewStream;
    }
  }, [previewStream]);

  useEffect(() => {
    if (mediaBlobUrl) {
      const date = moment().format('LLL');
      let title;
      let mimetype;

      if (video || screen) {
        title = screen ? `screen-${date}.mp4` : `camera-${date}.mp4`;
        mimetype = 'video/mp4';
      } else {
        title = `sound-${date}.wav`;
        mimetype = 'audio/wav';
      }

      dispatch(
        addMediaFile({
          id: crypto.randomUUID(),
          uploadId: undefined,
          src: mediaBlobUrl,
          title,
          type: 'blob',
          mimetype,
        })
      );
    }
  }, [mediaBlobUrl]);

  useEffect(() => {
    switch (action) {
      case 'startRecording': {
        startRecording();
        setPreview(true);
        break;
      }
      case 'stopRecording': {
        stopRecording();
        setPreview(false);
        break;
      }
      default:
        break;
    }
  }, [action]);

  useEffect(() => {
    if (status !== 'recording') dispatch(setStatus('preview'));
    else dispatch(setStatus('recording'));
  }, [status]);

  return (
    <>
      {preview === true && (
        <video
          ref={videoRef}
          style={{ width: '100%', height: '100%' }}
          controls
          autoPlay
        />
      )}
      {preview === false && (
        <video
          style={{ width: '100%', height: '100%' }}
          src={mediaBlobUrl}
          controls
          autoPlay
        />
      )}
    </>
  );
};

export default MediaRecorder;
