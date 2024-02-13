import playground from '../../data/playground';
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import Layout from '../../components/Layout';
import {
  SandpackCodeEditor,
  SandpackPreview,
  SandpackProvider,
} from '@codesandbox/sandpack-react';
import { withoutSSR } from '../../components/NoSSR';
import { useState } from 'react';
import replaceCDN from '../../utils/replaceCDN';
import styles from './[...id].module.scss';
import PlaygroundLayout from '../../components/PlaygroundLayout';

export async function getStaticPaths() {
  return {
    paths: playground.map((d) => d.url),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const basePath = join('src', 'playground', params.id.join('/'));
  const files = await readdir(basePath);
  const pack = {};
  await Promise.all(
    files.map(async (file) => {
      const content = await readFile(join(basePath, file), 'utf-8');
      pack[file] = content;
    }),
  );

  const permalink = `/playground/${params.id}`;
  return {
    props: {
      pack,
      permalink,
      title: playground.find((d) => d.url === permalink).title,
    },
  };
}

const PlaygroundSandpack = withoutSSR(
  ({ files, visibleFiles, activeFile, externalResources }) => {
    const [overrides] = useState(() => {
      if (location.hash.startsWith('#code')) {
        const code = location.hash.replace('#code', '').trim();
        let userCode;
        try {
          userCode = JSON.parse(decompressFromEncodedURIComponent(code));
        } catch (err) {}
        return userCode || {};
      }
      return {};
    });

    return (
      <SandpackProvider
        options={{
          visibleFiles,
          activeFile,
          externalResources:
            externalResources && externalResources.map(replaceCDN),
        }}
        template="static"
        files={Object.keys(files).reduce((f, name) => {
          const fullName = name.startsWith('/') ? name : `/${name}`;
          return {
            ...f,
            [name]: replaceCDN(overrides[fullName] ?? files[name]).trim(),
          };
        }, {})}
      >
        <div className={styles.wrapper}>
          <div className={styles.editor}>
            <SandpackCodeEditor showTabs wrapContent showRunButton={false} />
          </div>
          <div className={styles.preview}>
            <SandpackPreview showOpenInCodeSandbox={false} />
          </div>
        </div>
      </SandpackProvider>
    );
  },
);

export default function Playground({ pack, permalink, title }) {
  const { 'externalResources.json': rawResources, ...files } = pack;

  let externalResources = [];
  try {
    externalResources = JSON.parse(rawResources);
  } catch (err) {}

  return (
    <PlaygroundLayout permalink={permalink} title={title}>
      <PlaygroundSandpack
        key={permalink}
        externalResources={externalResources}
        preferPreview
        activeFile={files['index.js'] ? 'index.js' : Object.keys(files)[0]}
        files={files}
      />
    </PlaygroundLayout>
  );
}
