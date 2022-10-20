import classNames from 'classnames';
import { useEffect, useState } from 'react';
import OctocatIcon from '../svg/octocat.svg';

const placeholderCount = (33825).toLocaleString();

interface GitHubProps {
  dark?: boolean;
}

const GitHub = ({ dark = false }: GitHubProps) => {
  const [count, setCount] = useState(placeholderCount);

  useEffect(() => {
    fetch(
      'https://api.github.com/search/repositories?q=quill+user:quilljs+repo:quill&sort=stars&order=desc',
    )
      .then(response => response.json())
      .then(data => {
        if (data.items && data.items[0].full_name === 'quilljs/quill') {
          setCount(data.items[0].stargazers_count.toLocaleString());
        }
      });
  }, []);

  return (
    <span className={classNames('github-button', { 'dark-bg': dark })}>
      <a
        className="github-action"
        target="_blank"
        title="Star Quill on Github"
        href="https://github.com/quilljs/quill/"
      >
        <OctocatIcon />
        <span>Star</span>
      </a>
      <a
        className="github-count"
        target="_blank"
        title="Quill Stargazers"
        href="https://github.com/quilljs/quill/stargazers"
      >
        {count}
      </a>
    </span>
  );
};

export default GitHub;
