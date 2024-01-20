import classNames from 'classnames';
import { useEffect, useState } from 'react';
import OctocatIcon from '../svg/octocat.svg';
import * as styles from './GitHub.module.scss';

const placeholderCount = (37622).toLocaleString();

const GitHub = ({ dark = false }) => {
  const [count, setCount] = useState(placeholderCount);

  useEffect(() => {
    fetch(
      'https://api.github.com/search/repositories?q=quill+user:quilljs+repo:quill&sort=stars&order=desc',
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.items && data.items[0].full_name === 'quilljs/quill') {
          setCount(data.items[0].stargazers_count.toLocaleString());
        }
      });
  }, []);

  return (
    <div className={classNames(styles.button, { [styles.isDark]: dark })}>
      <a
        className={styles.action}
        target="_blank"
        title="Star Quill on GitHub"
        href="https://github.com/quilljs/quill/"
      >
        <OctocatIcon />
        <span>Star</span>
      </a>
      <a
        className={styles.count}
        target="_blank"
        title="Quill Stargazers"
        href="https://github.com/quilljs/quill/stargazers"
      >
        {count}
      </a>
    </div>
  );
};

export default GitHub;
