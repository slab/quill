import { Select } from '@radix-ui/themes';
import Layout from './Layout';
import styles from './PlaygroundLayout.module.scss';
import playground from '../data/playground';
import NoSSR from './NoSSR';
import { useRouter } from 'next/navigation';
import OpenSource from './OpenSource';

const PlaygroundLayout = ({ children, permalink, title }) => {
  const router = useRouter();

  return (
    <Layout title={title} pageType="playground">
      <div className="container">
        <div className={styles.container}>
          <section className={styles.header}>
            <h1>Playground</h1>
            <NoSSR>
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
            </NoSSR>
          </section>
          {children}
        </div>
        <OpenSource />
      </div>
    </Layout>
  );
};

export default PlaygroundLayout;
