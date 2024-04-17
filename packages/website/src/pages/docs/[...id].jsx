import { serialize } from 'next-mdx-remote/serialize';
import docs from '../../data/docs';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import PostLayout from '../../components/PostLayout';
import env from '../../../env';
import MDX from '../../components/MDX';
import flattenData from '../../utils/flattenData';

export async function getStaticPaths() {
  return {
    paths: flattenData(docs).map((d) => d.url),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const basePath = join('content', 'docs', `${params.id.join('/')}`);
  const filePath = `${basePath}.mdx`;
  const markdown = await readFile(join(process.cwd(), filePath), 'utf8');
  let data = {};
  try {
    const path = params.id.join('/');
    if (path === 'guides/cloning-medium-with-parchment') {
      data = await import(`../../../content/docs/${path}`);
    }
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
      permalink: `/docs/${params.id}`,
      data: JSON.parse(JSON.stringify(data)),
    },
  };
}

export default function Doc({ mdxSource, filePath, permalink, data }) {
  return (
    <PostLayout
      pageType="docs"
      filePath={filePath}
      permalink={permalink}
      {...mdxSource.frontmatter}
    >
      <MDX mdxSource={mdxSource} data={data} />
    </PostLayout>
  );
}
