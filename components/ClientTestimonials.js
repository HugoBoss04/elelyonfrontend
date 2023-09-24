import classes from '../styles/ClientTestimonials.module.css';
import { IoStarSharp } from 'react-icons/io5';
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';
import { useEffect, useState } from 'react';
import Rating from './Rating';

const ClientTestimonials = ({ testimonials }) => {
  const [isDesktop, setIsDesktop] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [activeTestimonialsContainer, setActiveTestimonialsContainer] =
    useState(0);

  useEffect(() => {
    setIsDesktop(window.innerWidth >= 1000);
  }, []);

  // const testimonials = [
  //   {
  //     name: 'Craig N.',
  //     testimonial:
  //       "Ariana is amazing. I've been her client for almost a year at a different location. She is the only one that has cut my hair and trimmed my beard leaving me completely satisfied each and every time.",
  //   },
  //   {
  //     name: 'Tanner H.',
  //     testimonial:
  //       "Ariana does a great job! She is professional and provides a very clean cut. I've been coming to her for over a year and have never been disappointed!",
  //   },
  //   {
  //     name: 'Paula Carrizales',
  //     testimonial:
  //       'Ariana is wonderful! My husband and two boys get their haircuts with her all the time. She is professional and great at what she does. I highly recommend her!',
  //   },
  //   {
  //     name: 'Person 4',
  //     testimonial:
  //       "Ariana is amazing. I've been her client for almost a year at a different location. She is the only one that has cut my hair and trimmed my beard leaving me completely satisfied each and every time.",
  //   },
  //   {
  //     name: 'Person 5',
  //     testimonial:
  //       "Ariana does a great job! She is professional and provides a very clean cut. I've been coming to her for over a year and have never been disappointed!",
  //   },
  //   {
  //     name: 'Person 6',
  //     testimonial:
  //       'Ariana is wonderful! My husband and two boys get their haircuts with her all the time. She is professional and great at what she does. I highly recommend her!',
  //   },
  //   {
  //     name: 'Person 7',
  //     testimonial:
  //       "Ariana is amazing. I've been her client for almost a year at a different location. She is the only one that has cut my hair and trimmed my beard leaving me completely satisfied each and every time.",
  //   },
  //   {
  //     name: 'Person 8',
  //     testimonial:
  //       "Ariana does a great job! She is professional and provides a very clean cut. I've been coming to her for over a year and have never been disappointed!",
  //   },
  //   {
  //     name: 'Person 9',
  //     testimonial:
  //       'Ariana is wonderful! My husband and two boys get their haircuts with her all the time. She is professional and great at what she does. I highly recommend her!',
  //   },
  // ];

  let containers = [];
  let containerIndex = 0;

  for (let i = 0; i < testimonials.data.length; i += 3) {
    const container = testimonials.data.slice(i, i + 3);
    containers.push(container);
    containerIndex++;
  }
  // console.log(testimonials);
  // const testimonialsArray = {testimonials.map((testimonial, index) => {
  //   return (
  //     <div
  //       className={`${classes.testimonial} ${
  //         activeTestimonial === index && classes.active
  //       }`}
  //       key={index}
  //     >
  //       <h3 className={classes.name}>{testimonial.name}</h3>
  //       <p className={classes.text}>{testimonial.testimonial}</p>
  //       <div className={classes['stars-container']}>
  //         <IoStarSharp size={24} className={classes.icon} />
  //         <IoStarSharp size={24} className={classes.icon} />
  //         <IoStarSharp size={24} className={classes.icon} />
  //         <IoStarSharp size={24} className={classes.icon} />
  //         <IoStarSharp size={24} className={classes.icon} />
  //       </div>
  //     </div>
  //   )
  // })}

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
    // testimonialsArray[
    //   activeTestimonial
    // ].props.className = `${classes.testimonial} ${classes.left}`
    // setActiveTestimonial(activeTestimonial + 1)
    // if (activeTestimonial > testimonialsArray.length - 1) {
    //   setActiveTestimonial(testimonialsArray.length - 1)
    // }

    // testimonialsArray[
    //   activeTestimonial
    // ].props.className = `${classes.testimonial} ${classes.active}`
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
    </div>
  );
};
export default ClientTestimonials;
