/**
 * @group scripts/cdk
 */

import { App } from "aws-cdk-lib";
import path from "path";
import "@aws-cdk/assert/jest";
import { GeoprocessingStack, getHandlerPointer } from "./GeoprocessingStack";
import config from "./config";
import createTestProjectManifest from "../testing/createTestProjectManifest";
import { setupBuildDirs, cleanupBuildDirs } from "../testing/lifecycle";

const rootPath = `${__dirname}/__test__`;

describe("GeoprocessingStack - sync geoprocessor only", () => {
  afterAll(() => cleanupBuildDirs(rootPath));

  it.only("should create a valid stack", async () => {
    const projectName = "sync-geoprocessor-only";
    const projectPath = path.join(rootPath, projectName);
    await setupBuildDirs(projectPath);

    const manifest = await createTestProjectManifest(projectName, [
      "syncGeoprocessor",
    ]);

    expect(manifest.clients.length).toBe(0);
    expect(manifest.preprocessingFunctions.length).toBe(0);
    expect(manifest.geoprocessingFunctions.length).toBe(1);

    const app = new App();
    const stack = new GeoprocessingStack(app, projectName, {
      env: { region: manifest.region },
      projectName,
      manifest,
      projectPath,
    });

    // Check counts
    expect(stack.hasClients()).toEqual(false);
    expect(stack.hasSyncFunctions()).toEqual(true);
    expect(stack.hasAsyncFunctions()).toEqual(false);
    expect(stack.getSyncFunctionMetas().length).toBe(1);
    expect(stack.getAsyncFunctionMetas().length).toBe(0);
    expect(stack.getSyncFunctionsWithMeta().length).toBe(1);
    expect(stack.getAsyncFunctionsWithMeta().length).toBe(0);

    expect(stack).toCountResources("AWS::CloudFront::Distribution", 0);
    expect(stack).toCountResources("AWS::S3::Bucket", 2);
    expect(stack).toCountResources("AWS::ApiGateway::RestApi", 1);
    expect(stack).toCountResources("AWS::ApiGateway::Stage", 1);
    expect(stack).toCountResources("AWS::ApiGatewayV2::Api", 0); // web socket api
    expect(stack).toCountResources("AWS::ApiGatewayV2::Stage", 0);
    expect(stack).toCountResources("AWS::DynamoDB::Table", 2);
    expect(stack).toCountResources("AWS::Lambda::Function", 3);

    expect(stack).toHaveResourceLike("AWS::ApiGateway::Stage", {
      StageName: config.STAGE_NAME,
    });

    // Check shared resources
    expect(stack).toHaveResourceLike("AWS::ApiGateway::RestApi", {
      Name: `gp-${projectName}`,
    });
    expect(stack).toHaveResourceLike("AWS::S3::Bucket", {
      BucketName: `gp-${projectName}-results`,
    });
    expect(stack).toHaveResourceLike("AWS::S3::Bucket", {
      BucketName: `gp-${projectName}-datasets`,
    });
    expect(stack).toHaveResourceLike("AWS::Lambda::Function", {
      Handler: "serviceHandlers.projectMetadata",
      Runtime: config.NODE_RUNTIME.name,
    });
    expect(stack).toHaveResourceLike("AWS::DynamoDB::Table", {
      TableName: `gp-${projectName}-tasks`,
    });
    expect(stack).toHaveResourceLike("AWS::DynamoDB::Table", {
      TableName: `gp-${projectName}-estimates`,
    });

    // Check geoprocessor
    expect(stack).toHaveResourceLike("AWS::Lambda::Function", {
      FunctionName: `gp-${projectName}-sync-${manifest.geoprocessingFunctions[0].title}`,
      Handler: getHandlerPointer(manifest.geoprocessingFunctions[0]),
      Runtime: config.NODE_RUNTIME.name,
    });
  });
});
