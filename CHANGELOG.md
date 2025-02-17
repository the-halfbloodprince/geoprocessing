# Changelog

## v3.0.0 (2023-06-05)

### :boom: Breaking Changes

* Switch `createReportStoryLayout` function to `createReportDecorator`

### :rocket: New Feature / Improvement

* Add internationalization (i18n) aka language translation support to core framework and geoprocessing projects, as proposed in [GIP-1](packages/wiki-docs/gip/GIP-1-i18n.md)
  * Utilizing this feature in existing projects requires running `translation:install`, then wrapping existing report clients in `Translator` components (see stories), setup POEditor project access. Then use translation CLI commands to extract, publish, translate and then reimport translations. See tutorial for more information.
* Add WatersDiagram SVG component with built-in labels that can be user edited or overrided.
* Add SizeCard and boundaryAreaOverlap to template-ocean-eez, add debug for template packages
* Add planningAreaId to basic.json to distinguish from planningAreaName as the common name for reports, fix extraTerms import for publish.  template-ocean-eez uses this, such that when you select an EEZ, it uses the unique ID string from the "UNION" attribute for this value.  This is then used by the clipToOceanEEZ preprocessor function in template-ocean-eez

```typescript
{
    datasourceId: "global-clipping-eez-land-union",
    operation: "intersection",
    options: {
      propertyFilter: {
        property: "UNION",
        values: [project.basic.planningAreaId],
      },
    },
  },
```

### :bug: Bug Fix

* Update slonik to 2.0 and fix symlink follow endless loop bug in macos
* Stop appending project init metadata to package.json on project creation.  Projects created using `template-ocean-eez` will have these that can be safely deleted (e.g. `planningUnitId`, `planningUnitName`)

### :house: Internal

* Update SegmentControl component to support RTL languages (tab order reverses)
* Stub out `data/src` and `data/dist` folders on project init
* Upgrade webpack cli and improve client error message
* Explicitly make `client` and `datasets` buckets public as now required by AWS.
* Drop acl setting from cache control script to make top-level service manifest (index.html) public read.  It's no longer needed as bucket is already public.

### :memo: Documentation

* Move wiki docs into monorepo, with Github action publishing on merge to main after release
* Switch to CCSA-4.0 license for wiki docs allowing them to be copied, extended and presented.
* Add translation tutorial
* Add advanced storybook tutorial

## v2.0.0 (2023-03-08)

### :boom: Breaking Changes

* `planningAreaType` is now required in basic.json of `eez` or `other`
* `noun` in basic.json has become `planningAreaName`
* `nounPossessive` in basic.json has become `planningAreaPossessive`.  If planningAreaTypes is `eez` then should match a valid `UNION` value in [eez_land_union_v3.json](https://github.com/seasketch/geoprocessing/blob/7b96e9f222220a35664153ac6a56b967f0d3624a/packages/geoprocessing/scripts/global/datasources/eez_land_union_v3.json)
* New `genRandomSketches` and `genRandomFeatures` scripts are now installed on init to `data/scripts`.  New [install-data-scripts](https://github.com/seasketch/geoprocessing/blob/dev/packages/base-project/package.json#L24) and `reinstall-data-scripts` commands have been put in place for adding these to your project and updating them going forward.  If you customize these scripts, it's up to you to merge in your changes after a reinstall of them.

### :rocket: New Feature / Improvement

* Add support for new starter templates that user can choose from on init.
* Add support for new `planningAreaType` of eez or other.
* Add EEZ selection to project `init` when `eez` planningAreaType used.
* Point to tutorials when project init completes
* Add suite of functions for automating preprocessors for standard use cases - genPreprocessor, genClipLoader, dataProviders/getFeatures, polygonPreprocessorSmokeTest.  This can be simplified once migrate to ESM and dataproviders module can be merged with gp-core, removing unnecessary indirection.
* Update create:function to use genPreprocessor and offer EEZ selection to user when `eez` planningAreaType used.
* Update create:function to use calculateArea geoprocessing function as stub.
* add includeVirtualSketch helper for merging in additional sketch at runtime of geoprocessing function.
* Add genSketch and genSketchCollection scripts installed with base-project on init.  Add `install-data-scripts` and `reinstall-data-scripts` commands to migrate and upgrade going forward.
* Add isPolygonFeatureArray helper
* Add genRandomPolygon and genRandomeSketch scripts in project-space
* Add additional supported metrics (percent) to Typescript types
* Update description of quantitative and categorical rasters in init question

### :bug: Bug Fix

* Address inability to extend ProjectClientBase in user-space because of file mismatch by switching to implementing ProjectClientInterface.
* Add getVectorDatasourceUrl and getExternalVectorDatasourceById methods to ProjectClientBase
* Address clip datasource returning no features on fetch.

### :house: Internal

* Migrate project init to use `base-project` package, with `template-blank-project` or `template-ocean-eez` starter templates being merged in by request of user.
* Split templates into `starter-template` and `add-on-template`.
* Drop nascent `clipDatasources` feature to replace with preprocessor generators.
* Add getExampleFeatures and getExampleFeaturesByName testing helpers
* Add prepare script to pre-commit, ensuring TS types are legit
* Update nvmrc to node 16
* Log copying of project config on init
* Add getPaths module that starts to centralize how relative paths get generated across CLI commands.

### :memo: Documentation

* Deeply updated wiki docs including tutorials, architecture, etc.

## v1.1.0 (2023-02-01)

### :rocket: New Feature / Improvement

* Add metric group objective helpers - getMetricGroup, getMetricObjectives, getMetricGroupObjectiveIds
* HorizontalStackedBar: increase default title width and allow override
* sortMetrics - add support for sorting by displayOrder property
* SketchAttributesCard and getUserAttribute: add boolean attribute support
* getUserAttribute: add support for collections
* add workspace:shell command matching volume mount of cli use

### :bug: Bug Fix

* Hard error if optional raster metadata file not created as part of transform
* Export VerticalSpacer component

### :house: Internal

* Use new [gp-workspace](https://github.com/seasketch/docker-gp-workspace) built on Ubuntu
* Migrate GDAL commands during import and publish to use docker exec.
* Add husky pre-commit hook to run full local tests which include e2e as part of commit
* Remove scripts/e2e tests from CI (gdal calls) since now run in docker container.  Limit to locally run tests only for now.
* Add markdown linter
* Remove extensions no longer used

### :memo: Documentation

* Update gp landing readme
* Update default README.md and link to tutorials

## :tada: v1.0.0 (2022-09-30) :tada:

### :boom: Breaking Changes

* Upgrade AWS Cloud Development Kit (CDK) and SDK to version 2.  If you haven't deployed a stack in your AWS Region, on your next deploy you will be asked to first run a `cdk bootstrap` command to upgrade.  If your stack fails to deploy properly you may need to destroy and recreate it.

### :rocket: New Feature / Improvement

* Add first-class support for project configuration (basic.json, datasources.json, metrics.json, objectives.json) with a new `ProjectClient` class for accessing everything in a central place.
* Add new commands for importing, reimporting, and publishing both vector and raster datasources with integrated precalculation (`import:data`, `reimport:data`, `publish:data`)
* Add schema validation for many types using `zod`, allowing JSON config files that are often manually edited to be validated.
* Support deploying a barebones project with no assets, solving chicken/egg problem
* Add stack destroy CLI command
* Unsilence logging for webservers that run during CLI commands and tests for better comprehension/easier debugging
* Add ToolbarCard component
* Enhance LayerToggle component UX
* Refactor DataDownload component
* Extend ResultsCard to support a custom card layout
* Increase default bar chart height from 10px to 12px
* Export valueFormatter for project use
* Add minimum node (>= 16) and npm (>= 8.5) requirements
* Migrate lambdas to node 16
* Publish API docs (https://seasketch.github.io/geoprocessing/api/)
* Publish UI component library (https://seasketch.github.io/geoprocessing/storybook/?path=/story/components-card-card--simple)

### :bug: Bug Fix

* Add workaround to run storybook in a vscode devcontainer
* Change table row sum check error to warning within a certain range, to not block report renders.

### :house: Internal

* Improve COG and Flatgeobuf logging for easier debugging of sources
* Change some of the lambda environment variable names for clarity (e.g. SUBSCRIPTIONS_TABLE)
* Add zx dependency for easier execution of shell commands (https://github.com/google/zx)
* Add `local` variant of tests that includes e2e
* Unsilence web servers used in CLI commands and testing for easier use

## v0.15.0 (2022-05-02)

### :boom: Breaking Changes

* Refactor Class Table making column configuration flexible and supporting multiple column types (including bar chart).
* Drop support for Node 12.x.  AWS CloudFormation/Lambda currently uses 14.x.  CI now tests only 14.x and 16.x

### :rocket: New Feature / Improvement

* Upgrade to Geoblaze 1.3.2
* Upgrade to Webpack 4.46.  Migrate start-client dev server script to use webpack serve CLI command.
* Uprade to Storybook 6.4.22.  Refactor storybook config/loader.  Cold start time is greatly improved.  Uses babel-loader instead of ts-loader. Could now be ready for webpack 5 and React upgrade.

* Add support for regulation-based classification scheme (RBCS) - types, helpers, UI components, and relating to objectives and metrics.
* Add initial support for MultiPolygon sketches - types, testing, helpers, fixtures.
* Add MultiPolygon support to overlapFeatures and overlapRasterClass toolbox functions

* Add HorizontalStackedBar chart component
* Add ChartLegend chart component providing standalone legend separate from chart
* Add ReportChartFigure component for spacing a chart within a Card
* Add VerticalSpacer UI component as alternative to ye old break tag
* DataDownload - add caller-provided titleElement prop
* Export SimpleButton
* Export CardDecorator

* Add valueFormatter function - providing shortcut for formatting numbers for human consumption (percentage, commas, fractional digits, custom).  Can be exposed by Table components giving caller control over column formatting.
* Add input sanity check to all type guard helpers (with any parameter), ensuring input is truthy
* toPercentMetric: support assigning new metric name
* fgbFetchAll - make support for undefined bbox explicit
* Add getSketchFeatures helper
* Add getKeys helper

* Add support for Objectives and tying them to Metrics

### :bug: Bug Fix

* Lock CI npm version to npm@7.10.0 for now due to error with lockfile in newer version.
* Add check that report client exists in bundle before trying to access in App.tsx
* Add numeric-separator plugin for proper babel-loader handling of underscore
* Fix DataDownload dropdown stuck open on startup bug

### :house: Internal

* overlapRaster - handle case of no overlapping pixels found, fallback to identify on nearest cell
* Add overlapGroupMetrics unit tests
* Add overlapRasterClass unit tests
* Consolidate iframe service types and constants
* Refactor some of helpers - break out geo and native
* Refactor some of types - break datasource out of metric

## v0.14.0 (2022-02-27)

### :rocket: New Feature / Improvement

* Refactor overlap gp toolbox - overlapArea, overlapFeatures, overlapRaster, overlapRasterClass, overlapGroupMetrics, booleanOverlap.  Removes overlap for SketchCollection metrics. Remove old functions - areaByClass, calcAreaByClass, calcAreaByClassRaster, intersect, difference
* Add core Metrics support including aggregation - types, helpers, components
* Add DataClass and DataGroup types for representing datasources
* Add Report and ReportResult types for standardizing project level config and combining data and metrics
* Add iucn module with core, helpers, components
* Add overrides to percentLower helper
* SketchAttributesCard: allow user-provided mapping of attribute names to readable for display
* Add Circle and Pill components
* Add LayerToggle component
* Add InfoStatus and ObjectiveStatus components
* getUserAttribute/getJsonUserAttribue - allow input of either sketch or sketchProperties
* Add getJsonUserAttribute helper
* Allow raster-defined and user-defined nodata and projection for cog dataset
* Speed up clipping operations utilizing single sweep support
* Add ReportError error boundary around ResultsCard body
* Add fetchAll flatgeobuf method avoiding streaming generator (slower)
* Add fgb prefix to exported flatgeobuf methods
* Add COG library tests
* Improve base ReportsCard style
* Split client library into client-core and client-ui
* Export ReportContext to client library
* Export base types to client library
* Export sketch helpers to client library
* Add storybook build speedup
* Add percentGoalWithEdgeHelper
* Add beta canary release script to go with alpha, useful if alphas deployed from feature branch and commit number collision
* Consolidate fixtures and export for gp project use

### :bug: Bug Fix

* Fix DataDownload component initial render
* Add babel-class-property plugin to fix build error
* Fix toSketchArray return type
* gpClipOcean - add check for no land feature to clip
* Refactor cog module, improve window calculation for fetch, allow caller override for extra fetch
* Fix various React warnings with improper use of p tags
* Clean up socket handlers, thou shalt not ts-ignore!
* Lock flatgeobuf to version with commonjs

### :house: Internal

* Add invalid sketch fixture for testing error conditions
* Consolidate util modules into helpers and export all helpers
* Move top-level files into new aws, datasources, storybook, assets folders
* Migrate storybook stories for latest version
* Migrate areaByClass to fgbDeserialize
* Add new test cmnd and debug launcher with runtime prompt of user for test to run (regex)
* Consolidate on start-storybook name for consistency
* Refactor ReportDecorator and remove ReportCardDecorator

### :memo: Documentation

## v0.13.0 (2021-07-27)

### :rocket: New Feature

* Add support for FlatGeoBuf datasets (flatgeobuf.ts)
* Add support for Cloud Optimized Geotiff raster (cog.ts)
* Add types for georaster and geoblaze (PRs open in upstream repos)
* Add `areaByClass` metric helpers for calculating area for categorized data
* Add `KeySection` and `SegmentControl` components.
* Add react ErrorBoundary to ResultsCard to limit blast radius of uncaught errors.
* Add `capitalize` helper method for strings
* Add `groupBy` and `keyBy` helper methods, similar to lodash
* Add generics support to PreprocessingHandler allowing implementer to specify more specific Geometry types
* Expand generics support for GeoprocessingHandler and PreprocessingHandler to accept Feature in addition to Sketch.  Allows implementer to create gp functions for simpler Features instead of sketches.
* Add `*All` variants of methods for getting test sketches, that also includes sketch collections. (e.g. there is both getExamplePolygonSketchAll and getExamplePolygonSketch)
* Add helper functions `toFeatureArray`, `toSketchArray`, `toFeatureArray`, `toFeaturePolygonArray` to normalize function input that accepts either single features or a collection.
* Add test helper functions `genSampleSketch`, `genSampleSketchCollection`, and `genSampleSketchContext`
* Add `roundDecimal`, `roundLower`, and `percentLower` number formatting methods
* Add `dataset` bucket to stack for quickly publishing simple datasets used in functions e.g. raster and flatgeobuf
* Make webpack dev server required dependency so user project can access too
* Add ts-node as direct dep for running user scripts
* Add logger module to replace direct use of console

### :bug: Bug Fix

* Fix ResultsCard handling of no data returned by function.
* Stub 'fs' in webpack and storybook so that browser users of modules that use the filesystem module somewhere don't error.  Even if the code being imported doesn't have a code path that uses fs it will still occur.
* drop esModule from file-loader to match storybook default behavior

### :house: Internal

* Add sketch collections to unit tests, so not just single sketches
* Split out types.ts types into directory
* Add multiple versions of node to CI test strategy

### :memo: Documentation

* Add short section on limitations of the framework and accuracy of geoprocessing algorithms.

## v0.12.1 (2021-06-08)

### :rocket: New Feature

* Add robust isSketch and friends providing type guard/narrowing ability
* Add robust helpers for fetching examples by sketch type and/or geometry type, utilizes the type guard functions to narrow type.
* Migrate to turf base geojson types and re-export from GP lib for userspace
* Add a few simple common unit conversion helpers like `squareMeterToMile` and `squareMeterToKilometer`
* Add booleanOverlap helper
* Add first toolbox function called `overlap`
* Add unpackSketches helper to resolve ambiguous functions that accept Sketch or SketchCollection
* Add Generics support to Sketch and SketchCollection to allow user to constrain what types of Feature geometries the Sketch will contain.

### :bug: Bug Fix

* Storybook broke, downgrade ts-loader to last known to work with webpack 4
* Fix top-level `p` tag warning for `ResultCard` component
* Update storybook story separator to properly generate TOC
* Add missing turf/bbox-clip used in clipToBounds template
* temp disable docgen due to bug upstream
* Filter out template sketch examples from example-loader (having gp prefix)
* Polyfill TextEncoder and TextDecoder for older versions of Node

### :house: Internal

* Clean up osm-land pre script
* Remove unneeded memory settings in gp handlers now that there is sane default
* template-ocean-eez - improve error checking
* Remove prep-data.sh stub file leaving to templates and docs
* Migrate to prefixed example filenames for distinguishing templates and user projects
* Add `data` and `src` to default gitignore.
* Improve example sketch generator
* deprecate getExampleSketchesByName and test partialName alternative
* Consolidate example naming to hyphen
* Switch all helpers to named exports (really everything should be)

### :memo: Documentation

* Improve point limit messaging when bundling features
* Update required install steps
* Clarify public projects

## v0.12.0 (2021-05-12)

### :rocket: New Feature

* Add support for project templates with 4 nascent templates included - gp-area, template-ocean-eez, gp-clip-bbox, gp-raster-stats (https://github.com/seasketch/geoprocessing/issues/41)
* Add Node 14.x support
* Added `start:client` CLI command.  Serves the project Client bundle locally using Webpack dev server, allowing user to load and test the project reports using Message interface, just as SeaSketch platform does.

### :bug: Bug Fix

* Resolve bug bundling gp-clip-bbox when linked geoprocessing library is used
* Resolve bug where geoprocessing library installed by init had fuzzy versioning, require exact version.
* Resolve inability to build gp-ocean-clip template due to webpack module resolution being too narrow.
* Fix missing .gitignore file in user-generated project.  Now it installs and ignores from each template are now merged in on install.
* Fix bug that caused download dropdown order issue
* Remove errant top-level monorepo dependencies
* Fix streaming false message in console output when deploying stack

### :house: Internal

* Refactor CloudFormation stack, extracting GeoprocessingStack, renaming most resource names and Logical IDs.  ***This will be a destructive change to all deployed stacks when upgrading, previous analysis results will be lost ***
* Migrate CloudFormation stack to Node 14x Lambda runtime
* Bump all dependencies to latest (webpack 5 support held back)
* Add createProject() function to programmatically create projects.
* Add CDK stack and template snapshot tests.
* upgrade polygon-clipping with martinez 0.7n support
* Add CI github workflow
* Support full bucket delete on stack delete
* Soup up the `create_example` script to create an example with async geoprocessing function as well as sync.  Ensure it is buildable and deployable out of the box.
* Remove now unused IntersectHelper module.

### :memo: Documentation

* Update docs on how to install templates
* Add README to geoprocessing package for people finding via NPM

## v0.11.1 (2021-03-25)

### :bug: Bug Fix

* Migrate from CSS modules to styled-components.  The CSS files were not being copied into the build so it was an opportunity to just consolidate on using SC
* Remove duplicate Checkbox identifier.  Was only caught downstream by Webpack

## v0.11.0 (2021-03-25)

### :rocket: New Feature

* Add Toolbar component
* Add DataDownload component with CSV/JSON support.  CSV has auto-flattening of arrays/objects using json2csv library.  Downloaded files default to including report name, sketch name (if context available) and current ISO timestamp.
* Add DataDownloadToolbar convenience component
* Add data download toolbar to Table component for convenience

### :bug: Bug Fix

* Replace useDropdown with Dropdown component based on popper.js and usePopper hook
* Fix bug with Jest not being able to interpret CSS module imports, they are now stubbed.

## v0.10.0 (2021-03-19)

### :rocket: New Feature

* Add new `Table` component
* Add new `FilterSelectTable` component, built on new `CheckboxGroup`
* Add geoprocessing function helpers - isPolygon, martinez, toJson
* Add sketch helpers - filterByBbox, getExampleSketchesByName

### :bug: Bug Fix

* Add explicit jest dependency, was causing test failure with fresh install and latest npm
* Drop errant geoprocessing dependency from root
* Change lerna to use `npm ci` on publish so that prepublish steps don't produce local lockfile changes which stop the subsequent publish

### :house: Internal

* Add `install` script, avoids user awareness of Lerna
`clean` scripts
* Add `publish:alpha` and `publish:stable` scripts, avoids user awareness of Lerna
* Switch geoprocessing build from `prepublishOnly` to `prepare` so that it's run on initial install as well
* Add `watch` and `watch:script` scripts to geoprocessing to automatically rebuild assets, useful when in active development with a linked report project
* Add complementary VSCode 'build' commands for all `build` and `watch` scripts, for those that prefer to use it.
* VSCode extensions - add vscode-map-preview recommendation
* VSCode settings - Add geojson schema support for intellisense
* Stop hiding build and node_modules directories in vscode, they are useful enough to keep easy access to.

### :memo: Documentation

* Add extensive notes for how to `npm link` a report to a local geoprocessing package, and troubleshoot issues
* Document how to do alpha releases
* Document steps for debugging geoprocessing functions, including using toJsonFile, and geojson map preview
