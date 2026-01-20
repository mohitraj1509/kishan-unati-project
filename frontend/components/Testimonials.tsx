import React from 'react';
import styles from './Testimonials.module.css';

const Testimonials = () => {
  const testimonials = [
    {
      name: 'Rajesh Kumar',
      location: 'Punjab',
      crop: 'Wheat Farmer',
      image: '👨‍🌾',
      rating: 5,
      text: 'Kisan Unnati helped me increase my wheat yield by 30% with their AI recommendations. The disease detection feature saved my crops from blight!',
      color: '#22c55e'
    },
    {
      name: 'Priya Sharma',
      location: 'Maharashtra',
      crop: 'Cotton Farmer',
      image: '👩‍🌾',
      rating: 5,
      text: 'The marketplace feature connected me directly with buyers. No more middlemen taking away my profits. Highly recommend!',
      color: '#3b82f6'
    },
    {
      name: 'Anand Patel',
      location: 'Gujarat',
      crop: 'Groundnut Farmer',
      image: '👨‍🌾',
      rating: 5,
      text: 'Weather insights helped me plan my irrigation better. The app\'s accuracy is amazing and it\'s so easy to use.',
      color: '#f59e0b'
    }
  ];

  return (
    <section className={styles.testimonials}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>What Farmers Say</h2>
          <p className={styles.subtitle}>
            Real stories from farmers who transformed their farming with Kisan Unnati
          </p>
        </div>

        <div className={styles.grid}>
          {testimonials.map((testimonial, index) => (
            <div key={index} className={styles.testimonialCard}>
              <div className={styles.quoteIcon} style={{ color: testimonial.color }}>
                "
              </div>
              <div className={styles.rating}>
                {'★'.repeat(testimonial.rating)}
              </div>
              <p className={styles.text}>{testimonial.text}</p>
              <div className={styles.author}>
                <div className={styles.avatar} style={{ backgroundColor: testimonial.color + '20' }}>
                  {testimonial.image}
                </div>
                <div className={styles.authorInfo}>
                  <div className={styles.name}>{testimonial.name}</div>
                  <div className={styles.details}>
                    {testimonial.crop} • {testimonial.location}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;