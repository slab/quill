import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import docs from '../data/docs';

const Docs = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace(docs[0].url);
  }, [router]);

  return null;
};

export default Docs;
