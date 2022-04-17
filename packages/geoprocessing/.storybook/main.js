const path = require("path");

const baseStories = [
  "../src/**/*.stories.tsx",
  "../src/**/*.stories.js",
  "../src/**/*.stories.ts",
];

const projectStories = [];

if (process.env.PROJECT_PATH) {
  projectStories.push(
    path.join(process.env.PROJECT_PATH, "src/clients") + "/**/*.stories.tsx"
  );
  projectStories.push(
    path.join(process.env.PROJECT_PATH, "src/components") + "/**/*.stories.tsx"
  );
}

module.exports = {
  stories: [...baseStories, ...projectStories],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
  ],
  framework: "@storybook/react",
  webpackFinal: async (config) => {
    /// stub fs to avoid not found error
    config.node = { fs: "empty" };
    // allow ts files to be picked up in project path
    config.resolve.extensions.push(".ts", ".tsx");
    // configure ts files in project path to be transpiled too
    config.module.rules.push({
      test: /\.(ts|tsx)$/,
      use: [
        {
          loader: require.resolve("babel-loader"),
        },
      ],
    });
    // load project example sketches and smoke test output
    if (process.env.PROJECT_PATH) {
      config.module.rules.push({
        test: /storybook\/examples-loader.js$/,
        use: [
          {
            loader: `val-loader`,
            options: {
              examplesPath: path.join(process.env.PROJECT_PATH, "examples"),
            },
          },
        ],
      });
    }
    return config;
  },
};
