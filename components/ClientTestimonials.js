import classes from '../styles/ClientTestimonials.module.css'
import { IoStarSharp } from 'react-icons/io5'
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs'
import { useState } from 'react'

const ClientTestimonials = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const testimonials = [
    {
      name: 'Craig N.',
      testimonial:
        "Ariana is amazing. I've been her client for almost a year at a different location. She is the only one that has cut my hair and trimmed my beard leaving me completely satisfied each and every time.",
    },
    {
      name: 'Tanner H.',
      testimonial:
        "Ariana does a great job! She is professional and provides a very clean cut. I've been coming to her for over a year and have never been disappointed!",
    },
    {
      name: 'Paula Carrizales',
      testimonial:
        'Ariana is wonderful! My husband and two boys get their haircuts with her all the time. She is professional and great at what she does. I highly recommend her!',
    },
  ]

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
    if (activeTestimonial + 1 > testimonials.length - 1) {
      setActiveTestimonial(testimonials.length - 1)
    } else {
      setActiveTestimonial(activeTestimonial + 1)
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
  }
  const backwardsNav = () => {
    if (activeTestimonial - 1 < 0) {
      setActiveTestimonial(0)
    } else {
      setActiveTestimonial(activeTestimonial - 1)
    }

    // testimonialsArray[
    //   activeTestimonial
    // ].props.className = `${classes.testimonial}`
    // setActiveTestimonial(activeTestimonial - 1)
    // if (activeTestimonial < 0) {
    //   setActiveTestimonial(0)
    // }

    // testimonialsArray[
    //   activeTestimonial
    // ].props.className = `${classes.testimonial} ${classes.active}`
  }
  return (
    <div className={classes.container}>
      <div className={classes['title-container']}>
        <div className={classes.line}></div>
        <div className={classes.title}>Testimonials</div>
        <div className={classes.line}></div>
      </div>
      <div className={classes['content-container']}>
        {testimonials.map((testimonial, index) => {
          return (
            <div
              className={`${classes.testimonial} ${
                activeTestimonial === index && classes.active
              } ${index < activeTestimonial && classes.left}`}
              key={index}
            >
              <h3 className={classes.name}>{testimonial.name}</h3>
              <p className={classes.text}>{testimonial.testimonial}</p>
              <div className={classes['stars-container']}>
                <IoStarSharp size={24} className={classes.icon} />
                <IoStarSharp size={24} className={classes.icon} />
                <IoStarSharp size={24} className={classes.icon} />
                <IoStarSharp size={24} className={classes.icon} />
                <IoStarSharp size={24} className={classes.icon} />
              </div>
            </div>
          )
        })}
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
  )
}
export default ClientTestimonials
