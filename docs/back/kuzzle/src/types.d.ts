import { EmbeddedSDK, mDeleteResponse } from "kuzzle";

export type Item = {
  id: string;
  _id?: string;
  content?: { [key: string]: any };
  states?: { [key: string]: any };
  user?: User;
  _kuzzle_info?: {
    author: string;
    createdAt: number;
    updater: string | null;
    updatedAt: number | null;
  };
  history?: {
    timestamp: number
    item: Item
  }[]
};

export type User = {
  [ket: string]: any;
  user: {
    id: string;
    dbClass: string
    role?: {
      value: string;
      label: string;
    }
    profileIds: string[]
    credentials: {
      local: {
        username: string
        notSecret?: string
      }
    },
  };
};

export type FetchProps = FetchScheme & {
  sdk: EmbeddedSDK;
  dbName: string;
}

export type FetchScheme = {
  dbClass: string;
  filters?: { [key: string]: any };
  sorts?: { [key: string]: "asc" | "desc" }[];
  size?: number;
  searchAfter?: string[];
  getUsers?: boolean;
  aggregations?: any;
  history?: number
};

export type SearchScheme = BaseFetchScheme & {
  searchFields?: string[]
};

export type BaseFetchScheme = {
  dbClass: string;
  order?: number;
  filters?: Filters
  filtersFunc?: string
  filtersEvalFunc?: FiltersFunction
  sorts?: { [key: string]: "asc" | "desc" }[];
  size?: number;
  refs?: string[];
  backRefs?: string[];
  getUsers?: boolean;
  aggregations?: any;
  searchFields?: string[];
  searchAfter?: string[];
};

export type Filters = { [key: string]: any }
export type FiltersFunction = (data: Data) => { [key: string]: any }

export type Data = { [dbClass: string | undefined]: FetchResult }

export type FetchResult = {
  items?: Item[];
  fetched?: number;
  total?: number;
  aggregations?: { [key: string]: any }
  error?: string
}

export type MutateProps = MutateScheme & {
  sdk: EmbeddedSDK;
  dbName: string;
}

export type MutateScheme = {
  dbClass: string
  order?: number;
  items?: Item[]
  itemsFunc?: string
  itemsEvalFunc?: ItemsFunction
  silent?: boolean
  history?: boolean
};

export type ItemsFunction = (items: Item[], data: MutateData) => Item[]
export type MutateData = { [dbClass: string | undefined]: MutateResult }

export type MutateResult = {
  items?: Item[];
  count?: number;
  error?: string
}

export type DeleteProps = DeleteScheme & {
  sdk: EmbeddedSDK;
  dbName: string;
}

export type DeleteScheme = {
  dbClass: string
  ids?: string[]
  idsFunc?: string
  idsEvalFunc?: IdsFunction
};

export type IdsFunction = (ids: string[], data: DeleteData) => string[]
export type DeleteData = { [dbClass: string | undefined]: DeleteResult }

export type DeleteResult = {
  response?: mDeleteResponse
  count?: number;
  error?: string
}