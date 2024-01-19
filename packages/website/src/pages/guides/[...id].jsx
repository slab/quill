import { serialize } from 'next-mdx-remote/serialize';
import guides from '../../data/guides';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import DocTemplate from '../../templates/doc';
import env from '../../../env';
import MDX from '../../components/MDX';

export async function getStaticPaths() {
  const flattenedItems = [];

  const flatItems = (i) => {
    i.forEach((child) => {
      if (child.url.includes('#')) return;
      flattenedItems.push(child);
      if (child.children) {
        flatItems(child.children);
      }
    });
  };

  flatItems(guides);
  return {
    paths: flattenedItems.map((d) => d.url),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const filePath = join('content', 'guides', `${params.id.join('/')}.mdx`);
  const markdown = await readFile(join(process.cwd(), filePath), 'utf8');
  const mdxSource = await serialize(
    markdown.replace(/\{\{site\.(\w+)\}\}/g, (...args) => {
      return env[args[1]];
    }),
    { parseFrontmatter: true },
  );
  return { props: { mdxSource, filePath, permalink: `/guides/${params.id}` } };
}

export default function Guides({ mdxSource, permalink }) {
  return (
    <DocTemplate
      pageType="guides"
      permalink={permalink}
      {...mdxSource.frontmatter}
    >
      <MDX mdxSource={mdxSource} />
    </DocTemplate>
  );
}
