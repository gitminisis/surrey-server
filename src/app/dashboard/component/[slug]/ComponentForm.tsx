import React from "react";
import Form from "@rjsf/chakra-ui";
import validator from "@rjsf/validator-ajv8";
type Props = {
  uiSchema?: Object;
  data: Object;
  schema: Object;
  submitHandler: (data: any) => void;
};
import { ArrayFieldTemplateProps, RJSFSchema } from "@rjsf/utils";

const ComponentForm = ({ uiSchema, data, schema, submitHandler }: Props) => {
  return (
    <Form
      formData={data}
      schema={schema}
      uiSchema={{
        data: {
          description: {
            "ui:widget": "textarea",
          },
        },
        children: {
          data: {
            description: {
              "ui:widget": "textarea",
            },
          },
        },
        message: {
          "ui:widget": "textarea",
        },
      }}
      validator={validator}
      onSubmit={({ formData }) => {
        submitHandler(formData);
      }}
    />
  );
};

export default ComponentForm;
