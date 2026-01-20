import Header from '../components/Header';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Statistics from '../components/Statistics';
import Testimonials from '../components/Testimonials';
import FarmingTips from '../components/FarmingTips';
import QuickActions from '../components/QuickActions';
import Footer from '../components/Footer';
import ChatbotFAB from '../components/ChatbotFAB';

export default function Home() {
  return (
    <div>
      <Header />
      <Hero />
      <Features />
      <Statistics />
      <Testimonials />
      <FarmingTips />
      <QuickActions />
      <Footer />
      <ChatbotFAB />
    </div>
  );
}