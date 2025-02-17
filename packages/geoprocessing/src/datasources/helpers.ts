import {
  InternalVectorDatasource,
  ExternalVectorDatasource,
  internalVectorDatasourceSchema,
  externalVectorDatasourceSchema,
  InternalRasterDatasource,
  ExternalRasterDatasource,
  internalRasterDatasourceSchema,
  externalRasterDatasourceSchema,
  Datasource,
  Datasources,
  BaseImportDatasourceConfig,
} from "../types";
import { DataClass } from "../types";

/** Returns mapping of class ID to class DataClass objects */
export const classIdMapping = (classes: DataClass[]) => {
  return classes.reduce<Record<string, string>>(
    (acc, curClass) => ({
      ...acc,
      ...(curClass.numericClassId
        ? { [curClass.numericClassId]: curClass.classId }
        : {}),
    }),
    {}
  );
};

export const isInternalVectorDatasource = (
  /** InternalVectorDatasource object */
  ds: any
): ds is InternalVectorDatasource => {
  return internalVectorDatasourceSchema.safeParse(ds).success;
};

export const isExternalVectorDatasource = (
  /** ExternalVectorDatasource object */
  ds: any
): ds is ExternalVectorDatasource => {
  return externalVectorDatasourceSchema.safeParse(ds).success;
};

export const isInternalRasterDatasource = (
  /** InternalRasterDatasource object */
  ds: any
): ds is InternalRasterDatasource => {
  return internalRasterDatasourceSchema.safeParse(ds).success;
};

export const isExternalRasterDatasource = (
  /** ExternalRasterDatasource object */
  ds: any
): ds is ExternalRasterDatasource => {
  return externalRasterDatasourceSchema.safeParse(ds).success;
};

/** find and return datasource from passed datasources, otherwise reads from disk */
export const getDatasourceById = (
  datasourceId: string,
  datasources: Datasources
): Datasource => {
  const ds = datasources.find((ds) => ds.datasourceId === datasourceId);
  if (!ds) {
    throw new Error(`Datasource not found - ${datasourceId}`);
  } else {
    return ds;
  }
};

/** find and return external vector datasource from passed datasources, otherwise reads from disk */
export const getExternalVectorDatasourceById = (
  datasourceId: string,
  datasources: Datasources
): ExternalVectorDatasource => {
  const ds = getDatasourceById(datasourceId, datasources);
  if (isExternalVectorDatasource(ds)) {
    return ds;
  } else {
    throw new Error(`External vector datasource not found - ${datasourceId}`);
  }
};

/** find and return internal vector datasource from passed datasources, otherwise reads from disk */
export const getInternalVectorDatasourceById = (
  datasourceId: string,
  datasources: Datasources
): InternalVectorDatasource => {
  const ds = getDatasourceById(datasourceId, datasources);
  if (isInternalVectorDatasource(ds)) {
    return ds;
  } else {
    throw new Error(`Internal Vector datasource not found -${datasourceId}`);
  }
};

/** find and return external raster datasource from passed datasources, otherwise reads from disk */
export const getExternalRasterDatasourceById = (
  datasourceId: string,
  datasources: Datasources
): ExternalRasterDatasource => {
  const ds = getDatasourceById(datasourceId, datasources);
  if (isExternalRasterDatasource(ds)) {
    return ds;
  } else {
    throw new Error(`External raster datasource not found - ${datasourceId}`);
  }
};

/** find and return internal datasource from passed datasources, otherwise reads from disk */
export const getInternalRasterDatasourceById = (
  datasourceId: string,
  datasources: Datasources
): InternalRasterDatasource => {
  const ds = getDatasourceById(datasourceId, datasources);
  if (isInternalRasterDatasource(ds)) {
    return ds;
  } else {
    throw new Error(`Internal raster datasource not found -${datasourceId}`);
  }
};

/** Returns datasource filename in geojson format */
export function getJsonFilename(datasource: InternalVectorDatasource) {
  return datasource.datasourceId + ".json";
}

/** Returns datasource filename in flatgeobuf format */
export function getFlatGeobufFilename(datasource: InternalVectorDatasource) {
  return datasource.datasourceId + ".fgb";
}

export function getCogFilename(datasourceId: string, postfix?: string) {
  return datasourceId + (postfix ? postfix : "") + ".tif";
}

export function getDatasetBucketName<C extends BaseImportDatasourceConfig>(
  config: C
) {
  return `gp-${config.package.name}-datasets`;
}
