import { Select } from '@radix-ui/themes';
import classNames from 'classnames';
import styles from './PlaygroundLayout.module.scss';
import playground from '../data/playground';
import { Button } from '@radix-ui/themes';
import { Share1Icon } from '@radix-ui/react-icons';
import { useRouter } from 'next/navigation';
import { useSandpack } from '@codesandbox/sandpack-react';
import { compressToEncodedURIComponent } from 'lz-string';
import { useEffect, useState } from 'react';

const PlaygroundLayout = ({ children, permalink, title, files }) => {
  const router = useRouter();
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
    <>
      <div
        className={classNames(styles.copied, { [styles.active]: isCopied })}
      ></div>
      <div className={styles.panel}>
        <div className={styles.exampleSelector}>
          <label className={styles.exampleLabel}>Example:</label>
          <Select.Root
            defaultValue={playground.find((p) => p.url === permalink).url}
            onValueChange={(v) => {
              router.push(v);
            }}
          >
            <Select.Trigger />
            <Select.Content position="popper">
              <Select.Group>
                {playground.map((p) => {
                  return (
                    <Select.Item key={p.url} value={p.url}>
                      {p.title}
                    </Select.Item>
                  );
                })}
              </Select.Group>
            </Select.Content>
          </Select.Root>
        </div>
        <div className={styles.panelMeta}>
          <Button
            onClick={() => {
              const map = {};
              Object.keys(files).forEach((name) => {
                const fullName = name.startsWith('/') ? name : `/${name}`;
                map[fullName] = sandpack.files[fullName]?.code;
              });
              const encoded = compressToEncodedURIComponent(
                JSON.stringify(map),
              );
              location.hash = `code${encoded}`;
              navigator.clipboard.writeText(location.href);
              setIsCopied(true);
            }}
          >
            <Share1Icon /> Share Your Edits
          </Button>
        </div>
      </div>
      {children}
    </>
  );
};

export default PlaygroundLayout;
