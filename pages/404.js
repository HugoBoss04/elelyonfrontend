// pages/404.js
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import classes from '@/styles/404.module.css';
import Image from 'next/image';
import svg from '../public/images/404SVG.svg';

export default function NotFoundPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the homepage after a delay
    const redirectTimeout = setTimeout(() => {
      router.push('/');
    }, 3000);

    // Clean up the timeout on unmount
    return () => clearTimeout(redirectTimeout);
  }, []);

  return (
    <Layout title="El Elyon | Not Found" is404={true}>
      <div className={classes['first-background']}>
        <div className={classes.container}>
          <Image src={svg} alt="Not Found" height={400} width={400} />
          <h1 className={classes.header}>Oops! This page doesn't exist.</h1>
          <p className={classes.subheading}>Redirecting to homepage...</p>
        </div>
      </div>
    </Layout>
  );
}
