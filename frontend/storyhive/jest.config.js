module.exports = {
  testEnvironment: "jsdom",
  testEnvironmentOptions: {},
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
  },
  setupFilesAfterEnv: ["@testing-library/jest-dom"],
  testMatch: ["**/testing/**/*.test.js"],
  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|svg)$": "<rootDir>/mocking/fileMock.js",
    "\\.(css|less|scss|sass)$": "<rootDir>/mocking/styleMock.js",
  },
};
