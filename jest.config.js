const nextConfig = require('next/jest');

require('dotenv').config({ path: '.env.development' });

const createJestConfig = nextConfig({
  dir: './',
});

const jestConfig = createJestConfig({
  moduleDirectories: ['node_modules', '<rootDir>/']
});


module.exports = jestConfig;