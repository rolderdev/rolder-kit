import { Kuzzle } from "kuzzle-sdk";
import { QueryClient } from "@tanstack/react-query";
import { Dayjs } from "dayjs";

type Rolder = {
  states: {
    backend: "notInitialized" | "initializing" | "initialized";
    debug: number;
    signedIn?: boolean;
    devMode: boolean;
  };
  env: {
    rolderKit?: string;
    project?: string;
    projectVersion?: string;
    backendVersion?: string;
    dbName?: string;
  };
  params: {
    sessionTimeout?: string;
    defaults?: {
      dateFormat: string;
    };
    colorScheme?: "light" | "dark";
    creds?: {
      name: string;
      data: any;
    }[];
  };
  dbClasses?: {
    [x: string]: DbClass;
  };
  libs: {
    Kuzzle?: Kuzzle;
    queryClient?: QueryClient;
    mantine?: {
      MantineError(
        title: string,
        message?: string,
        autoClose?: boolean | number
      ): void;
    };
    dayjs?: Dayjs;
    mutate?(props: {
      action: "create" | "update" | "delete";
      scheme: any;
    }): any;
    [name: string]: any;
  };
  utils: any;
  user?: any;
};

export type DbClass = {
  version: string;
  states: {
    [naem: string]: {
      value: string;
      label: string;
      order?: number;
      color?: string;
    };
  };
};

export type Item = {
  id: string;
  content?: { [key: string]: any };
  states?: { [key: string]: any };
  _kuzzle_info?: {
    author: string;
    createdAt: number;
    updater: string | null;
    updatedAt: number | null;
  };
  user?: User["user"];
};
    id: string
    dbClass?: string
    content?: { [key: string]: any }
    states?: { [key: string]: any }
    _kuzzle_info?: {
        author: string
        createdAt: number
        updater: string | null
        updatedAt: number | null
    }
    user?: User['user']
}

export type User = {
  user: {
    username?: string;
    id?: string;
    role?: {
      value: string;
      label: string;
    };
  };
};

declare global {
  var R: Rolder;
  var Noodl: any;
  var Sentry: any;
  var log: {
    start(): number;
    end(title: string, startTime: number): void;
    info(title: string, ...args): void;
    error(title: string, ...args): void;
    sentryError(error: Error): void;
  };
}
