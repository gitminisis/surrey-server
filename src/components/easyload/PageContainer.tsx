'use client';
import React, { useEffect } from 'react';
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import { Tooltip } from '@chakra-ui/react';
import {
  FiSearch,
  FiUpload,
  FiCamera,
  FiMonitor,
  FiVideo,
} from 'react-icons/fi';
import Upload from './Upload';
import { Authorize } from '@/lib/upload';
import VideoRecorder from './VideoRecorder';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import {
  setDevicesList,
  setDevicesState,
  setMode,
  setModeAction,
} from '@/store/easyLoadBoxSlice';
import MediaRecorder from './MediaRecorder';
type Props = {};

const PageContainer = ({}: Props) => {
  useEffect(() => {
    Authorize().then((res) => {});
  }, []);

  const dispatch = useAppDispatch();
  const mode = useAppSelector((state) => state.easyLoadBox.currentMode);
  useEffect(() => {
    resetState();
  }, []);
  const resetState = () => {
    dispatch(setModeAction(''));
    dispatch(setMode(''));
  };
  return (
    <div>
      <Tabs
        onChange={(index) => {
          if (index === 2) {
            dispatch(setMode('photo'));
          } else if (index === 3) {
            dispatch(setMode('video'));
          } else if (index === 4) {
            dispatch(setMode('screen'));
          } else {
            dispatch(setMode('search'));
          }
        }}
      >
        <TabList>
          <Tab display={'flex'} gap="2">
            <FiSearch /> Search
          </Tab>
          <Tab display={'flex'} gap="2">
            <FiUpload /> Upload file
          </Tab>
          <Tab display={'flex'} gap="2">
            <FiCamera /> Screenshot
          </Tab>
          <Tab display={'flex'} gap="2">
            <FiVideo /> Video record
          </Tab>
          <Tab display={'flex'} gap="2">
            <FiMonitor /> Screen record
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <p>one!</p>
          </TabPanel>
          <TabPanel>
            <Upload />
          </TabPanel>
          <TabPanel>{mode === 'photo' && <VideoRecorder />}</TabPanel>
          <TabPanel>
            {mode === 'video' && (
              <MediaRecorder
                video={true}
                audio={true}
                askPermissionOnMount={true}
              />
            )}
          </TabPanel>
          <TabPanel>
            {mode === 'screen' && (
              <MediaRecorder screen={true} askPermissionOnMount={true} />
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
};

export default PageContainer;
