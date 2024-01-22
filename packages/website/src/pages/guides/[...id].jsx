import { serialize } from 'next-mdx-remote/serialize';
import guides from '../../data/guides';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import PostLayout from '../../components/PostLayout';
import env from '../../../env';
import MDX from '../../components/MDX';
import flattenData from '../../utils/flattenData';

export async function getStaticPaths() {
  return {
    paths: flattenData(guides).map((d) => d.url),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const basePath = join('content', 'guides', `${params.id.join('/')}`);
  const filePath = `${basePath}.mdx`;
  const markdown = await readFile(join(process.cwd(), filePath), 'utf8');
  let data = {};
  try {
    data = await import(`../../../content/guides/${params.id.join('/')}`);
  } catch {}
  const mdxSource = await serialize(
    markdown.replace(/\{\{site\.(\w+)\}\}/g, (...args) => {
      return env[args[1]];
    }),
    { parseFrontmatter: true },
  );
  return {
    props: {
      mdxSource,
      filePath,
      permalink: `/guides/${params.id}`,
      data: JSON.parse(JSON.stringify(data)),
    },
  };
}

export default function Guides({ mdxSource, permalink, data }) {
  return (
    <PostLayout
      pageType="guides"
      permalink={permalink}
      {...mdxSource.frontmatter}
    >
      <MDX mdxSource={mdxSource} data={data} />
    </PostLayout>
  );
}
