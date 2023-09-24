import Layout from '@/components/Layout';
import classes from '../styles/Home.module.css';
import Image from 'next/image';
import HeroImage from '../public/images/home-hero-img-1920x1280.jpg';
import { BsScissors } from 'react-icons/bs';
import FeaturedServices from '@/components/FeaturedServices';
import ClientGallery from '@/components/ClientGallery';
import ClientTestimonials from '@/components/ClientTestimonials';
import Contact from '@/components/Contact';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { API_URL } from '../config';
import qs from 'qs';
import { useRouter } from 'next/router';

export default function Home({ allCollections }) {
  const [isDesktop, setIsDesktop] = useState(false);

  const router = useRouter();
  const { scrollTo } = router.query;

  useEffect(() => {
    setIsDesktop(window.innerWidth >= 1000);

    if (scrollTo === 'contact') {
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [scrollTo]);

  console.log(allCollections);
  return (
    <Layout title="El Elyon | Homepage">
      <div className="first-bg">
        <div className={classes['hero-img-container']}>
          <Image
            src={HeroImage}
            fill
            alt="Hero Image"
            className={classes.img}
          />
          <div className={classes.overlay}></div>
          <h2 className={classes['hero-msg']}>
            Empowering Men With Impeccable Grooming and Style
          </h2>
          <Link
            href="https://salonlofts.com/ariana_h/schedule"
            className={classes['hero-btn']}
          >
            book now
            <BsScissors size={16} className={classes['hero-scissors']} />
          </Link>
        </div>
        <FeaturedServices
          services={allCollections.data[0].attributes.services}
        />
        <ClientGallery
          clientPictures={allCollections.data[0].attributes.client_galleries}
        />
        <ClientTestimonials
          testimonials={allCollections.data[0].attributes.testimonials}
        />
        <div id="contact">
          <Contact />
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps() {
  const query = qs.stringify({
    populate: {
      client_galleries: {
        populate: ['clientPictures'],
      },
      services: true,
      testimonials: true,
    },
  });

  const res2 = await fetch(`${API_URL}/api/all-collections?${query}`);
  const allCollections = await res2.json();

  return {
    props: { allCollections },
  };
}
