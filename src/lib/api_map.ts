type IAPI_MAP = {
  data: string;
  schema: string;
};
// the key is reference to src\components\dashboard\Sidebar.tsx LINKITEMS
export const API_MAP: { [key: string]: IAPI_MAP } = {
  "union-home": {
    data: "/api/file/union-home",
    schema: "/api/schema/union-home",
  },
  "description-home": {
    data: "/api/file/description-home",
    schema: "/api/schema/description-home",
  },
  "collections-home": {
    data: "/api/file/collections-home",
    schema: "/api/schema/collections-home",
  },
  "detail-page": {
    data: "/api/file/detail-fields",
    schema: "/api/schema/detail-fields",
  },
  faq: {
    data: "/api/file/union-home",
    schema: "",
  },
  announcement: {
    data: "/api/file/union-home",
    schema: "",
  },
};
