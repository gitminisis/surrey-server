"use client";
import React, { useEffect, useState } from "react";

import ComponentForm from "./ComponentForm";
import { API_MAP } from "@/lib/api_map";
type Props = {};
const uiSchema = {
  tasks: {
    items: {
      details: {
        "ui:widget": "textarea",
      },
    },
  },
};
const data = {
  title: "My current tasks",
  tasks: [
    {
      title: "My first task",
      details:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      done: true,
    },
    {
      title: "My second task",
      details:
        "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur",
      done: false,
    },
  ],
};
const schema = {
  title: "A list of tasks",
  type: "object",
  required: ["title"],
  properties: {
    title: {
      type: "string",
      title: "Task list title",
    },
    tasks: {
      type: "array",
      title: "Tasks",
      items: {
        type: "object",
        required: ["title"],
        properties: {
          title: {
            type: "string",
            title: "Title",
            description: "A sample title",
          },
          details: {
            type: "string",
            title: "Task details",
            description: "Enter the task details",
          },
          done: {
            type: "boolean",
            title: "Done?",
            default: false,
          },
        },
      },
    },
  },
};
const Component = ({ params }: { params: { slug: string } }) => {
  const { slug } = params;
  const API_MAP_PATH = API_MAP[slug];
  const [data, setData] = useState([]);
  const [schema, setSchema] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const dataPath = API_MAP_PATH.data;
    const schemaPath = API_MAP_PATH.schema;
    fetch(dataPath)
      .then((res) => res.json())
      .then((res) => setData(res));
    fetch(schemaPath)
      .then((res) => res.json())
      .then((res) => {
        setSchema(res);
      });
  }, []);
  console.log({ data, schema });
  return (
    <div>
      {data.length > 0 &&
        schema.length > 0 &&
        data.map((e, i) => (
          <ComponentForm key={i} data={e} schema={schema[i]} />
        ))}
    </div>
  );
};

export default Component;
