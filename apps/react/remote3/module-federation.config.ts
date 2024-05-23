import { ModuleFederationConfig } from '@nx/webpack';
const config: ModuleFederationConfig = {
  name: 'remote3',
  exposes: {
    './Module': './src/remote-entry.ts',
    './welcome': 'shared/welcome/src/index.ts',
  },
};
export default config;
