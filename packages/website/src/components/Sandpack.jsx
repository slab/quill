import {
  SandpackProvider,
  SandpackCodeEditor,
  SandpackFileExplorer,
  SandpackPreview,
  Sandpack as RawSandpack,
  useSandpack,
} from '@codesandbox/sandpack-react';
import { useEffect, useState } from 'react';
import env from '../../env';
import * as styles from './Sandpack.module.scss';
import classNames from 'classnames';
import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from 'lz-string';
import { withoutSSR } from './NoSSR';

const TogglePreviewButton = ({ isPreviewEnabled, setIsPreviewEnabled }) => {
  const { sandpack } = useSandpack();

  return (
    <button
      className={styles.button}
      onClick={() => {
        if (!isPreviewEnabled) {
          sandpack.runSandpack();
        }
        setIsPreviewEnabled(!isPreviewEnabled);
      }}
    >
      {isPreviewEnabled ? 'Hide Result' : 'Run Code'}
    </button>
  );
};

const ToggleCodeButton = ({ isCodeEnabled, setIsCodeEnabled }) => {
  const { sandpack } = useSandpack();

  return (
    <button
      className={styles.button}
      onClick={() => {
        if (!isCodeEnabled) {
          sandpack.runSandpack();
        }
        setIsCodeEnabled(!isCodeEnabled);
      }}
    >
      {isCodeEnabled ? 'Hide Code' : 'Show Code'}
    </button>
  );
};

const replaceCDN = (value) => {
  return value.replace(/\{\{site\.(\w+)\}\}/g, (_, matched) => {
    return matched === 'cdn' ? process.env.cdn : env[matched];
  });
};

const LocationOverride = ({ filenames }) => {
  const { sandpack } = useSandpack();
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (!isCopied) return undefined;
    const timeout = setTimeout(() => {
      setIsCopied(false);
    }, 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, [isCopied]);

  return (
    <div className={styles.shareButton}>
      <div
        className={classNames(styles.copied, { [styles.active]: isCopied })}
      ></div>
      <button
        className={styles.button}
        onClick={() => {
          const map = {};
          filenames.forEach((name) => {
            const fullName = name.startsWith('/') ? name : `/${name}`;
            map[fullName] = sandpack.files[fullName]?.code;
          });
          const encoded = compressToEncodedURIComponent(JSON.stringify(map));
          location.hash = `code${encoded}`;
          navigator.clipboard.writeText(location.href);
          setIsCopied(true);
        }}
      >
        Share Your Edits
      </button>
    </div>
  );
};

export const StandaloneSandpack = withoutSSR(
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
        <LocationOverride filenames={Object.keys(files)} />
        <div className={styles.standaloneWrapper}>
          <div className={styles.standaloneFileTree}>
            <SandpackFileExplorer autoHiddenFiles />
          </div>
          <div className={styles.standaloneEditor}>
            <SandpackCodeEditor
              showTabs={false}
              wrapContent
              showRunButton={false}
            />
          </div>
          <div className={styles.standalonePreview}>
            <SandpackPreview showOpenInCodeSandbox={false} />
          </div>
        </div>
      </SandpackProvider>
    );
  },
);

const Sandpack = ({
  defaultShowPreview,
  preferPreview,
  files,
  visibleFiles,
  activeFile,
  externalResources,
  showFileTree,
  defaultShowCode,
}) => {
  const [isPreviewEnabled, setIsPreviewEnabled] = useState(
    preferPreview || defaultShowPreview,
  );
  const [isCodeEnabled, setIsCodeEnabled] = useState(
    !preferPreview || defaultShowCode,
  );
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsReady(true);
    }, 100);
  }, []);

  return (
    <div className={styles.container} style={isReady ? {} : { opacity: '0' }}>
      <SandpackProvider
        options={{
          autorun: defaultShowPreview,
          visibleFiles,
          activeFile,
          externalResources:
            externalResources && externalResources.map(replaceCDN),
        }}
        template="static"
        files={Object.keys(files).reduce(
          (f, name) => ({
            ...f,
            [name]: replaceCDN(files[name]).trim(),
          }),
          {},
        )}
      >
        <div
          className={classNames(styles.wrapper, {
            [styles.preferPreview]: preferPreview,
          })}
        >
          {isPreviewEnabled && preferPreview && (
            <div className={styles.previewWrapper}>
              <div className={styles.preview}>
                <SandpackPreview
                  showOpenInCodeSandbox={false}
                  showRefreshButton={false}
                />
              </div>
              <div className={styles.footer}>
                <ToggleCodeButton
                  isCodeEnabled={isCodeEnabled}
                  setIsCodeEnabled={setIsCodeEnabled}
                />
              </div>
            </div>
          )}
          {isCodeEnabled && (
            <div className={styles.editorWrapper}>
              <div className={styles.codeArea}>
                {showFileTree && (
                  <div className={styles.fileTree}>
                    <SandpackFileExplorer autoHiddenFiles />
                  </div>
                )}
                <div className={styles.editor}>
                  <SandpackCodeEditor
                    showTabs={
                      !showFileTree &&
                      (visibleFiles
                        ? visibleFiles.length > 1
                        : Object.keys(files).length > 1)
                    }
                    wrapContent
                    showRunButton={false}
                  />
                </div>
              </div>
              {!preferPreview && (
                <div className={styles.footer}>
                  <TogglePreviewButton
                    defaultShowPreview={defaultShowPreview}
                    isPreviewEnabled={isPreviewEnabled}
                    setIsPreviewEnabled={setIsPreviewEnabled}
                  />
                </div>
              )}
            </div>
          )}
          {isPreviewEnabled && !preferPreview && (
            <div className={styles.preview}>
              <SandpackPreview showOpenInCodeSandbox={false} />
            </div>
          )}
        </div>
      </SandpackProvider>
    </div>
  );
};

export const SandpackWithQuillTemplate = ({
  files,
  afterEditor,
  beforeEditor,
  content,
  ...props
}) => {
  return (
    <Sandpack
      {...props}
      files={{
        'index.html': `
<!-- Include stylesheet -->
<link href="{{site.cdn}}/quill.snow.css" rel="stylesheet" />
${beforeEditor || ''}
<!-- Create the editor container -->
<div id="editor">${content || ''}
</div>
${afterEditor || ''}
<!-- Include the Quill library -->
<script src="{{site.cdn}}/quill.js"></script>
<script src="/index.js"></script>`,
        ...files,
      }}
      visibleFiles={Object.keys(files)}
      activeFile={Object.keys(files)[0]}
    />
  );
};

export default Sandpack;
