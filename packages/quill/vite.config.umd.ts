import type { UserConfig } from 'vite';
import { defineConfig } from 'vite';
import commonConfig from './vite.config.common.js';
import type { OutputOptions } from 'rollup';
import { cloneDeep } from 'lodash-es';

type ConfigBuildInput = {
  input: string;
  name: string;
};

const defaultConfig = defineConfig({
  ...commonConfig,
  build: {
    rollupOptions: {
      preserveEntrySignatures: 'exports-only',
      output: {
        entryFileNames: '[name].umd.js',
        assetFileNames: '[name][extname]',
        format: 'umd',
        preserveModules: false,
        inlineDynamicImports: true,
        exports: 'default',
      },
    },
  },
});

function buildConfigs(input: Record<string, ConfigBuildInput>): UserConfig[] {
  const output: any[] = [];

  for (const [name, cfg] of Object.entries(input)) {
    const config = cloneDeep(defaultConfig);

    config.build!.rollupOptions!.input = {
      [name]: cfg.input,
    };
    (config.build!.rollupOptions!.output as OutputOptions).name = cfg.name;

    output.push(config);
  }

  return output;
}

export default buildConfigs({
  quill: {
    input: './src/main.ts',
    name: 'Quill',
  },
});
