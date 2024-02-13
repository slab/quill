import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import playground from '../data/playground';

const Playground = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace(playground[0].url);
  }, [router]);

  return null;
};

export default Playground;
