import NextLink from 'next/link';
import { Link as RadixLink } from '@radix-ui/themes';

const Link = ({ children, ...props }) => {
  return (
    <RadixLink {...props} asChild>
      <NextLink>{children}</NextLink>
    </RadixLink>
  );
};

export default Link;
