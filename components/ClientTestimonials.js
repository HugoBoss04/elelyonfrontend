import classes from '../styles/ClientTestimonials.module.css';
import { IoStarSharp } from 'react-icons/io5';
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';
import { useEffect, useState } from 'react';
import Rating from './Rating';
import { useRouter } from 'next/router';

const ClientTestimonials = ({ testimonials, user }) => {
  const [isDesktop, setIsDesktop] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [activeTestimonialsContainer, setActiveTestimonialsContainer] =
    useState(0);

  const router = useRouter();

  useEffect(() => {
    setIsDesktop(window.innerWidth >= 1000);
  }, []);

  let containers = [];
  let containerIndex = 0;

  for (let i = 0; i < testimonials.data.length; i += 3) {
    const container = testimonials.data.slice(i, i + 3);
    containers.push(container);
    containerIndex++;
  }
  const forwardNav = () => {
    if (!isDesktop) {
      if (activeTestimonial + 1 > testimonials.length - 1) {
        setActiveTestimonial(testimonials.length - 1);
      } else {
        setActiveTestimonial(activeTestimonial + 1);
      }
      return;
    }

    if (activeTestimonialsContainer + 1 > containers.length - 1) {
      setActiveTestimonialsContainer(containers.length - 1);
    } else {
      setActiveTestimonialsContainer(activeTestimonialsContainer + 1);
    }
  };
  const backwardsNav = () => {
    if (!isDesktop) {
      if (activeTestimonial - 1 < 0) {
        setActiveTestimonial(0);
      } else {
        setActiveTestimonial(activeTestimonial - 1);
      }
      return;
    }

    if (activeTestimonialsContainer - 1 < 0) {
      setActiveTestimonialsContainer(0);
    } else {
      setActiveTestimonialsContainer(activeTestimonialsContainer - 1);
    }
  };
  console.log(activeTestimonialsContainer);
  return (
    <div className={classes.container}>
      <div className={classes['title-container']}>
        <div className={classes.line}></div>
        <div className={classes.title}>Testimonials</div>
        <div className={classes.line}></div>
      </div>
      <div className={classes['content-container']}>
        {!isDesktop
          ? testimonials.data.map((currentTestimonial, index) => {
              const { name, testimonial, stars } =
                currentTestimonial.attributes;
              return (
                <div
                  className={`${classes.testimonial} ${
                    activeTestimonial === index && classes.active
                  } ${index < activeTestimonial && classes.left}`}
                  key={index}
                >
                  <h3 className={classes.name}>{name}</h3>
                  <p className={classes.text}>{testimonial}</p>
                  <div className={classes['stars-container']}>
                    <IoStarSharp size={24} className={classes.icon} />
                    <IoStarSharp size={24} className={classes.icon} />
                    <IoStarSharp size={24} className={classes.icon} />
                    <IoStarSharp size={24} className={classes.icon} />
                    <IoStarSharp size={24} className={classes.icon} />
                  </div>
                </div>
              );
            })
          : containers.map((container, index) => (
              <div
                className={`${classes['testimonials-container']} ${
                  activeTestimonialsContainer === index
                    ? classes['active-container']
                    : ''
                } ${
                  index < activeTestimonialsContainer &&
                  classes['container-left']
                }`}
                key={index}
              >
                {container.map((currentTestimonial, testimonialIndex) => {
                  const { name, testimonial, stars } =
                    currentTestimonial.attributes;
                  return (
                    <div
                      className={`${classes['testimonial-desktop']} ${
                        index === activeTestimonialsContainer
                          ? classes['active-testimonial-desktop']
                          : ''
                      }`}
                      key={testimonialIndex}
                    >
                      <h3 className={classes.name}>{name}</h3>
                      <p className={classes.text}>{testimonial}</p>
                      <div className={classes['stars-container']}>
                        <Rating rating={stars} />
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
        <BsChevronLeft
          size={40}
          className={classes['arrow-left']}
          onClick={backwardsNav}
        />
        <BsChevronRight
          size={40}
          className={classes['arrow-right']}
          onClick={forwardNav}
        />
      </div>
      {user && (
        <p
          className={classes['review-btn']}
          onClick={() => router.push('/review')}
        >
          Want to leave a review?
        </p>
      )}
    </div>
  );
};
export default ClientTestimonials;
