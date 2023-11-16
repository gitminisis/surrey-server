import React from "react";
import Form from "@rjsf/chakra-ui";
import validator from "@rjsf/validator-ajv8";
type Props = {
  uiSchema?: Object;
  data: Object;
  schema: Object;
  submitHandler: (data: any) => void;
};

const ComponentForm = ({ uiSchema, data, schema, submitHandler }: Props) => {
  return (
    <Form
      formData={data}
      schema={schema}
      validator={validator}
      onSubmit={({ formData }) => {
        submitHandler(formData);
      }}
    />
  );
};

export default ComponentForm;
