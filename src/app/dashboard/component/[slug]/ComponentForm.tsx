import React from "react";
import Form from "@rjsf/chakra-ui";
import validator from "@rjsf/validator-ajv8";
type Props = {
  uiSchema?: Object;
  data: Object;
  schema: Object;
};

const ComponentForm = ({ uiSchema, data, schema }: Props) => {
  console.log({ data, schema });
  return <Form formData={data} schema={schema} validator={validator} />;
};

export default ComponentForm;
