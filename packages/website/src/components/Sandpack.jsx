import { graphql, useStaticQuery } from 'gatsby';
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  useSandpack,
} from '@codesandbox/sandpack-react';
import { useState } from 'react';
import * as styles from './Sandpack.module.scss';

const TogglePreviewButton = ({ isPreviewEnabled, setIsPreviewEnabled }) => {
  const { sandpack } = useSandpack();

  return (
    <button
      className={styles.togglePreviewButton}
      onClick={() => {
        if (!isPreviewEnabled) {
          sandpack.runSandpack();
        }
        setIsPreviewEnabled(!isPreviewEnabled);
      }}
    >
      {isPreviewEnabled ? 'Hide Preview' : 'Run Code'}
    </button>
  );
};

const Sandpack = ({ files, showConsole }) => {
  const [isPreviewEnabled, setIsPreviewEnabled] = useState(false);
  const [clientId, setClientId] = useState(null);

  const data = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          cdn
        }
      }
    }
  `);

  const cdn = data?.site.siteMetadata.cdn;

  return (
    <div className={styles.container}>
      <SandpackProvider
        options={{ autorun: false, autoReload: false }}
        template="static"
        files={Object.keys(files).reduce(
          (f, name) => ({
            ...f,
            [name]: files[name].replace(/\{\{site\.cdn\}\}/g, cdn).trim(),
          }),
          {},
        )}
      >
        <div className={styles.bar}>
          <TogglePreviewButton
            isPreviewEnabled={isPreviewEnabled}
            setIsPreviewEnabled={setIsPreviewEnabled}
          />
        </div>
        <SandpackLayout>
          <SandpackCodeEditor
            showLineNumbers
            wrapContent
            showRunButton={false}
          />
          {isPreviewEnabled && (
            <SandpackPreview
              ref={(p) => {
                setClientId(p?.clientId);
              }}
              showOpenInCodeSandbox={false}
            />
          )}
        </SandpackLayout>
      </SandpackProvider>
    </div>
  );
};

export default Sandpack;
