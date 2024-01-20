import {
  SandpackProvider,
  SandpackCodeEditor,
  SandpackFileExplorer,
  SandpackPreview,
  useSandpack,
} from '@codesandbox/sandpack-react';
import { useEffect, useState } from 'react';
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
      {isPreviewEnabled ? 'Hide Result' : 'Run Code'}
    </button>
  );
};

const Sandpack = ({
  showPreview,
  files,
  visibleFiles,
  activeFile,
  externalResources,
  showFileTree,
}) => {
  const [isPreviewEnabled, setIsPreviewEnabled] = useState(showPreview);
  const [isReady, setIsReady] = useState(false);

  const cdn = process.env.cdn;

  useEffect(() => {
    setTimeout(() => {
      setIsReady(true);
    }, 100);
  }, []);

  return (
    <div className={styles.container} style={isReady ? {} : { opacity: '0' }}>
      <SandpackProvider
        options={{
          autorun: showPreview,
          visibleFiles,
          activeFile,
          externalResources,
        }}
        template="static"
        files={Object.keys(files).reduce(
          (f, name) => ({
            ...f,
            [name]: files[name].replace(/\{\{site\.cdn\}\}/g, cdn).trim(),
          }),
          {},
        )}
      >
        <div className={styles.wrapper}>
          <div className={styles.editorWrapper}>
            <div className={styles.codeArea}>
              {showFileTree && (
                <div className={styles.fileTree}>
                  <SandpackFileExplorer autoHiddenFiles />
                </div>
              )}
              <div className={styles.editor}>
                <SandpackCodeEditor wrapContent showRunButton={false} />
              </div>
            </div>
            {!showPreview && (
              <div className={styles.editorFooter}>
                <TogglePreviewButton
                  defaultShowPreview={showPreview}
                  isPreviewEnabled={isPreviewEnabled}
                  setIsPreviewEnabled={setIsPreviewEnabled}
                />
              </div>
            )}
          </div>
          {isPreviewEnabled && (
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
