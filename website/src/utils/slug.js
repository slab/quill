import slugify from 'slugify';

const slug = text => slugify(text, { lower: true });

export default slug;
