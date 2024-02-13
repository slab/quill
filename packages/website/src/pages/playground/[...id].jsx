import playground from '../../data/playground';
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import {
  SandpackCodeEditor,
  SandpackPreview,
  SandpackProvider,
} from '@codesandbox/sandpack-react';
import NoSSR, { withoutSSR } from '../../components/NoSSR';
import { useState } from 'react';
import replaceCDN from '../../utils/replaceCDN';
import styles from './[...id].module.scss';
import PlaygroundLayout from '../../components/PlaygroundLayout';
import { decompressFromEncodedURIComponent } from 'lz-string';
import Layout from '../../components/Layout';
import OpenSource from '../../components/OpenSource';
import classNames from 'classnames';

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

function Playground({ pack, permalink, title }) {
  const { 'playground.json': raw, ...files } = pack;

  let metadata = {};
  try {
    metadata = JSON.parse(raw);
  } catch (err) {}

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
    <Layout title={title} pageType="playground">
      <div className={classNames('container', styles.container)}>
        <h1>Playground</h1>
        <NoSSR>
          <SandpackProvider
            key={permalink}
            options={{
              activeFile:
                metadata.activeFile ||
                (files['index.js'] ? 'index.js' : Object.keys(files)[0]),
              externalResources:
                metadata.externalResources &&
                metadata.externalResources.map(replaceCDN),
            }}
            template={metadata.template}
            files={Object.keys(files).reduce((f, name) => {
              const fullName = name.startsWith('/') ? name : `/${name}`;
              return {
                ...f,
                [name]: replaceCDN(overrides[fullName] ?? files[name]).trim(),
              };
            }, {})}
          >
            <PlaygroundLayout permalink={permalink} title={title} files={files}>
              <div className={styles.wrapper}>
                <div className={styles.editor}>
                  <SandpackCodeEditor
                    showTabs
                    wrapContent
                    showRunButton={false}
                  />
                </div>
                <div className={styles.preview}>
                  <SandpackPreview showOpenInCodeSandbox={false} />
                </div>
              </div>
            </PlaygroundLayout>
          </SandpackProvider>
        </NoSSR>
        <OpenSource />
      </div>
    </Layout>
  );
}

export default withoutSSR(Playground);
