import LocalFileServer from "./base/util/localServer";

module.exports = async function (globalConfig, projectConfig) {
  const dstPath = "data/testing/output";
  const tempPort = 8001;

  console.log(
    `Jest is starting web server on port ${tempPort} to serve raster files for tests in GP Scripts`
  );
  // Set reference in order to use during teardown
  globalThis.__server__ = new LocalFileServer({
    path: dstPath,
    port: tempPort,
  });
};
