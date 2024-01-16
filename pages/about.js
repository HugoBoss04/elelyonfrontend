import Layout from '@/components/Layout';
import classes from '../styles/About.module.css';
import HeroOne from '../public/images/about-hero-img-1920x1280.jpg';
import HeroTwo from '../public/images/about-hero-img-2-1920x1280.jpg';
import aboutImg from '../public/images/about-section-img.jpg';
import includedImgOne from '../public/images/included-img-1-4.jpg';
import includedImgTwo from '../public/images/included-img-2.jpg';
import includedImgThree from '../public/images/included-img-3.jpg';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const AboutPage = () => {
  const [isDesktop, setIsDesktop] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    setIsDesktop(window.innerWidth > 1024);
    setIsTablet(window.innerWidth >= 650 || window.innerWidth <= 1024);
  }, []);
  return (
    <Layout>
      <div className="first-bg">
        <div className={classes['about-hero-container']}>
          <Image
            src={HeroOne}
            fill
            alt="Services Image"
            className={classes['img-1']}
          />
          <div className={classes.overlay}></div>
          <h2 className={classes['hero-msg']}>About</h2>
        </div>
        <div className={classes['content-container']}>
          <div className={classes['title-container']}>
            <div className={classes.line}></div>
            <div className={classes.title}>El Elyon</div>
            <div className={classes.line}></div>
          </div>
          <div className={classes['about-section']}>
            <div className={classes['about-section-one']}>
              <p className={classes.heading}>Who We Are</p>
              <p className={classes.msg}>
                Welcome to our barbershop, where style meets tradition. With
                skilled barbers and a cozy atmosphere, we're dedicated to
                crafting the perfect look for you. Discover the best in
                grooming.
              </p>
            </div>
            <div className={classes['about-section-two']}>
              <Image
                src={aboutImg}
                fill
                alt="Services Image"
                className={classes['about-section-img']}
              />
            </div>
          </div>
          <div className={classes['title-container']}>
            <div className={classes.line}></div>
            <div className={classes.title}>Included</div>
            <div className={classes.line}></div>
          </div>
          <div className={classes['included-section']}>
            <div className={classes['included-subsection']}>
              <div className={classes['img-container']}>
                <Image
                  src={includedImgOne}
                  fill
                  alt="Services Image"
                  className={classes['included-section-img']}
                />
              </div>
              <div className={classes['text-container']}>
                <p className={classes['subsection-heading']}>Drinks</p>
                <p className={classes['subsection-text']}>
                  Refresh your style with us and enjoy free beverages while you
                  get the perfect haircut and shave!
                </p>
              </div>
            </div>
            <div className={classes['included-subsection']}>
              <div className={classes['img-container']}>
                <Image
                  src={includedImgTwo}
                  fill
                  alt="Services Image"
                  className={classes['included-section-img']}
                />
              </div>
              <div className={classes['text-container']}>
                <p className={classes['subsection-heading']}>TV Service</p>
                <p className={classes['subsection-text']}>
                  Experience the perfect blend of style and entertainment with
                  our TV service during your barber visit.
                </p>
              </div>
            </div>
            <div className={classes['included-subsection']}>
              <div className={classes['img-container']}>
                <Image
                  src={includedImgThree}
                  fill
                  alt="Services Image"
                  className={classes['included-section-img']}
                />
              </div>
              <div className={classes['text-container']}>
                <p className={classes['subsection-heading']}>Shampoo Wash</p>
                <p className={classes['subsection-text']}>
                  Enhance your haircut experience with a revitalizing shampoo
                  wash, a complimentary treat for our valued clients
                </p>
              </div>
            </div>
          </div>
        </div>
        {isDesktop || isTablet ? (
          <div className={classes['about-hero-two-container']}>
            <div className={classes.overlay}></div>
          </div>
        ) : (
          <div className={classes['about-hero-two-img-container-mobile']}>
            <div className={classes.overlay}></div>
            <Image
              src={HeroTwo}
              fill
              alt="About Hero Image"
              className={classes['about-hero-img-two']}
            />
          </div>
        )}
      </div>
    </Layout>
  );
};
export default AboutPage;
