"use client";
import React, { useEffect, useState } from "react";

import ComponentForm from "./ComponentForm";
import { API_MAP } from "@/lib/api_map";
import { useToast } from "@chakra-ui/react";

const Component = ({ params }: { params: { slug: string } }) => {
  const toast = useToast();
  const { slug } = params;
  const API_MAP_PATH = API_MAP[slug];
  const dataPath = API_MAP_PATH.data;
  const schemaPath = API_MAP_PATH.schema;
  const [data, setData] = useState<any[]>([]);
  const [schema, setSchema] = useState<any[]>([]);

  useEffect(() => {
    fetch(dataPath)
      .then((res) => res.json())
      .then((res) => setData(res));
    fetch(schemaPath)
      .then((res) => res.json())
      .then((res) => {
        setSchema(res);
      });
  }, []);

  const updateData = (update: any, index: number) => {
    const newData = [...data];
    newData[index] = update;
    let formData = new FormData();
    formData.append("data", JSON.stringify(newData));
    fetch(dataPath, {
      method: "POST",
      body: JSON.stringify({
        data: newData,
      }),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          toast({
            title: res.title,
            description: res.message,
            status: "success",
            duration: 3000,
            isClosable: true,
          });
          setData(JSON.parse(res.data));
        }
      });
    setData(newData);
  };
  return (
    <div>
      {data.length > 0 &&
        schema.length > 0 &&
        data.map((e, i) => (
          <ComponentForm
            key={i}
            data={e}
            schema={schema[i]}
            submitHandler={(update) => {
              updateData(update, i);
            }}
          />
        ))}
    </div>
  );
};

export default Component;
