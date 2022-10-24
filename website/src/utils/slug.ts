import slugify from 'slugify';

const slug = (text: string) => slugify(text, { lower: true });

export default slug;
