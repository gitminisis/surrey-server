"use client";
import React from "react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import { Tooltip } from "@chakra-ui/react";
import {
  FiSearch,
  FiUpload,
  FiCamera,
  FiMonitor,
  FiVideo,
} from "react-icons/fi";
type Props = {};

const PageContainer = (props: Props) => {
  return (
    <div>
      <Tabs>
        <TabList>
          <Tab display={"flex"} gap="2">
            <FiSearch /> Search
          </Tab>
          <Tab display={"flex"} gap="2">
            <FiUpload /> Upload file
          </Tab>
          <Tab display={"flex"} gap="2">
            <FiCamera /> Screenshot
          </Tab>
          <Tab display={"flex"} gap="2">
            <FiVideo /> Video record
          </Tab>
          <Tab display={"flex"} gap="2">
            <FiMonitor /> Screen record
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <p>one!</p>
          </TabPanel>
          <TabPanel>
            <p>two!</p>
          </TabPanel>
          <TabPanel>
            <p>three!</p>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
};

export default PageContainer;
