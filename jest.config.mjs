export default {
  testEnvironment: "node",
  transform: {},                  // no Babel
  clearMocks: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  collectCoverageFrom: [
    "tools/**/*.js",
    "lib/**/*.js"
  ]
}; 