import { defineConfig } from 'vite'
import packageInfo from './package.json'
import fs from 'fs';

const outDir = 'dist';

const version = packageInfo.version || '0.0.0';

const fileName = `main.${version}`;


function updateVersionInPackageInfo(packageInfo: Record<string, any>, version: string) {
  packageInfo.version = version;
  packageInfo.main = `./${outDir}/main.${version}.umd.cjs`;
  packageInfo.module = `./${outDir}/main.${version}.js`;
  packageInfo.exports = {
    ...packageInfo.exports,
    import: `./${outDir}/main.${version}.js`,
    require: `./${outDir}/main.${version}.umd.cjs`
  };
  fs.writeFileSync('package.json', JSON.stringify(packageInfo, null, 2));

}

updateVersionInPackageInfo(packageInfo, version);


export default defineConfig({
  build: {
    outDir,
    lib: {
      entry: './lib/main.ts',
      name: 'api-proxy.js',
      fileName,
    },
    rollupOptions: {
      output: {
        globals: {
          'socket.io': 'socket.io',
          'socket.io-client': 'socket.io-client',
          'express': 'express',
          'body-parser': 'body-parser',
        }
      },
      external: ['socket.io', 'socket.io-client', 'express', 'body-parser'],
    },
  },
});
