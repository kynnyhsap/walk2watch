// Generated by Xata Codegen 0.21.0. Please do not edit.
import { buildClient } from "@xata.io/client";
import type {
  BaseClientOptions,
  SchemaInference,
  XataRecord,
} from "@xata.io/client";

const tables = [
  {
    name: "Steps",
    columns: [
      { name: "value", type: "int", notNull: true, defaultValue: "0" },
      {
        name: "datetime",
        type: "datetime",
        notNull: true,
        defaultValue: "now",
      },
    ],
  },
  {
    name: "WatchTime",
    columns: [
      { name: "ms", type: "int", notNull: true, defaultValue: "0" },
      {
        name: "datetime",
        type: "datetime",
        notNull: true,
        defaultValue: "now",
      },
    ],
  },
] as const;

export type SchemaTables = typeof tables;
export type InferredTypes = SchemaInference<SchemaTables>;

export type Steps = InferredTypes["Steps"];
export type StepsRecord = Steps & XataRecord;

export type WatchTime = InferredTypes["WatchTime"];
export type WatchTimeRecord = WatchTime & XataRecord;

export type DatabaseSchema = {
  Steps: StepsRecord;
  WatchTime: WatchTimeRecord;
};

const DatabaseClient = buildClient();

const defaultOptions = {
  databaseURL:
    "https://Andriy-Pashynnyk-s-workspace-0j5g5v.eu-west-1.xata.sh/db/walk2watch",
};

export class XataClient extends DatabaseClient<DatabaseSchema> {
  constructor(options?: BaseClientOptions) {
    super({ ...defaultOptions, ...options }, tables);
  }
}

let instance: XataClient | undefined = undefined;

export const getXataClient = () => {
  if (instance) return instance;

  instance = new XataClient();
  return instance;
};
