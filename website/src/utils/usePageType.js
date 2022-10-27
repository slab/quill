import { useLocation } from '@reach/router';

const usePageType = () => {
  const { pathname } = useLocation();

  if (pathname === '/') return 'home';
  if (pathname.includes('/docs/')) return 'docs';
  if (pathname.includes('/guides/')) return 'guides';
  if (pathname.includes('/playground/')) return 'playground';
  if (pathname.includes('/blog/')) return 'blog';

  return null;
};

export default usePageType;
