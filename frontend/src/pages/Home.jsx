import { useEffect, useState, Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
import HeroSection from '../Components/HomeSections/HeroSection';
import SkeletonImage from '../Components/SkeletonImage';
import { SectionLoadingState } from '../Components/LoadingStates';
import { slides } from '../data/homepageContent';
import axios from '../instant/axios';

// Lazy load heavy components
const HighlightsSlider = lazy(() => import('../Components/HighlightsSlider'));
const AimMissionSection = lazy(() => import('../Components/HomeSections/AimMissionSection'));
const HomeStaticSections = lazy(() => import('../Components/HomeSections/HomeStaticSections'));
const TransparencySection = lazy(() => import('../Components/HomeSections/TransparencySection'));
const TrustHighlightsSection = lazy(() => import('../Components/HomeSections/TrustHighlightsSection'));
const CtaSection = lazy(() => import('../Components/HomeSections/CtaSection'));

const SectionLoader = () => <SectionLoadingState />;

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [formData, setFormData] = useState({ email: '' });

  useEffect(() => {
    const interval = window.setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 5000);

    return () => window.clearInterval(interval);
  }, []);

  const handleChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const response = await axios.post('/contact/email', formData);
      console.log('Server Response:', response.data);
      alert('Data sent successfully!');
    } catch (error) {
      console.error('Error sending data:', error);
      alert('Failed to send data');
    }
  };

  return (
    <>
      <HeroSection />
      
      <Suspense fallback={<SectionLoader />}>
        <AimMissionSection />
      </Suspense>
      
      <Suspense fallback={<SectionLoader />}>
        <HomeStaticSections />
      </Suspense>

      {/* project section start */}
      <div className="hidden md:flex w-[90vw] mx-auto justify-between items-center gap-5 py-10">
        {/* Left big image */}
        <div className="relative h-[30vh] md:h-[53vh] w-full md:w-[25%] overflow-hidden group">
          <SkeletonImage
            src="https://res.cloudinary.com/dyvccryuz/image/upload/w_600,q_70,f_auto/v1746258778/photo8_igrw89.jpg"
            alt=""
            className="h-full w-full object-cover transform group-hover:scale-110 transition-all duration-500"
          />
          <div className="absolute inset-0 bg-black/40 mix-blend-multiply opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
            <h1 className="text-white text-2xl font-bold">Raise Donation</h1>
          </div>
        </div>

        {/* Right side */}
        <div className="flex flex-col gap-5 w-full md:w-[74%]">
          {/* Top row */}
          <div className="flex flex-col md:flex-row justify-start items-center gap-10">
            {/* Small image */}
            <div className="relative h-[30vh] md:h-[25vh] w-full md:w-[20vw] overflow-hidden group">
              <SkeletonImage
                src="https://res.cloudinary.com/dyvccryuz/image/upload/w_500,q_70,f_auto/v1746258779/photo23_m0mmu8.jpg"
                alt="Green Revolution"
                loading="lazy"
                className="h-full w-full object-cover transform group-hover:scale-110 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-black/40 mix-blend-multiply opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                <h1 className="text-white text-2xl font-bold">Green Revolution</h1>
              </div>
            </div>

            {/* Text */}
            <div className="text-center md:text-left">
              <h1 className="text-2xl font-serif mb-2">
                Our <span className="text-[#335288]">Define Work!</span>
              </h1>
              <p className="text-lg mb-4">
                Engaging our team in projects in dream to bring change.
              </p>
              <div className="flex justify-center items-center gap-2 w-30">
                <i className="fa-solid fa-arrow-left px-[9px] py-[8px] border-1 hover:text-[#335288] hover:border-[#335288] border-zinc-400 rounded-4xl"></i>
                <p className="px-4 py-1 border-1 w-20 border-zinc-400 rounded-4xl hover:text-[#335288] hover:border-[#335288]">
                  Hover
                </p>
              </div>
            </div>
          </div>

          {/* Bottom 3 images */}
          <div className="flex justify-between items-center gap-5">
            <div className="relative h-[30vh] md:h-[25vh] w-full md:w-[32%] overflow-hidden group">
              <SkeletonImage
                src="https://images.unsplash.com/photo-1622908961227-ebf9ccdc342d?q=60&w=800&auto=format&fit=crop&ixlib=rb-4.0.3"
                alt="Save Animals"
                loading="lazy"
                className="h-full w-full object-cover transform group-hover:scale-110 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-black/40 mix-blend-multiply opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                <h1 className="text-white text-2xl font-bold">Save Animals</h1>
              </div>
            </div>

            <div className="relative h-[30vh] md:h-[25vh] w-full md:w-[32%] overflow-hidden group">
              <SkeletonImage
                src="https://images.unsplash.com/photo-1709122066713-4c904721a378?q=60&w=800&auto=format&fit=crop&ixlib=rb-4.0.3"
                alt="Women Empowerment"
                loading="lazy"
                className="h-full w-full object-cover transform group-hover:scale-110 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-black/40 mix-blend-multiply opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                <h1 className="text-white text-2xl font-bold">Women Empowerment</h1>
              </div>
            </div>

            <div className="relative h-[30vh] md:h-[25vh] w-full md:w-[32%] overflow-hidden group">
              <SkeletonImage
                src="https://images.pexels.com/photos/764681/pexels-photo-764681.jpeg?auto=compress&cs=tinysrgb&w=500&h=400&fit=crop"
                alt="Promote Education"
                loading="lazy"
                className="h-full w-full object-cover transform group-hover:scale-110 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-black/40 mix-blend-multiply opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                <h1 className="text-white text-2xl font-bold">Promote Education</h1>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Suspense fallback={<SectionLoader />}>
        <HighlightsSlider />
      </Suspense>
      
      <Suspense fallback={<SectionLoader />}>
        <TransparencySection />
      </Suspense>
      
      <Suspense fallback={<SectionLoader />}>
        <TrustHighlightsSection />
      </Suspense>
      
      <Suspense fallback={<SectionLoader />}>
        <CtaSection />
      </Suspense>

      <div className="min-h-[50vh] w-full flex flex-col md:flex-row justify-center items-center ">
        {/* Text Side */}
        <div className="w-full md:w-[50%] h-full flex flex-col justify-center px-[5vw] py-4">
          <h1 className="text-3xl md:text-4xl text-white font-serif mb-4 md:text-left">
            Our <span className="text-[#335288]">Dedicated Hands,</span>
            <br /> Transforming Lives Together
          </h1>
          <p className="w-full md:w-full text-base md:text-lg text-white md:text-left">
            Our volunteers are the heart of our mission, working tirelessly to uplift communities,
            spread hope, and create lasting change through their compassion, dedication, and
            selfless service every day.
          </p>
          <div className="flex flex-col sm:flex-row items-center z-9">
            <form onSubmit={handleSubmit}>
              <div className="flex flex-wrap sm:flex-nowrap w-full">
                <input
                  type="email"
                  name="email"
                  className="h-12 flex-1 min-w-70 border text-black border-zinc-500 outline-none sm:rounded-tl-xl px-2 bg-white/35"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <button
                  type="submit"
                  className="h-12 w-full sm:w-auto px-4 bg-[#335288] text-lg font-serif rounded-br-xl sm:rounded-bl-none text-white"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Image Side */}
        <div className="w-full md:w-[50%] h-full flex justify-center md:justify-end">
          <SkeletonImage
            className="h-[60vh] object-contain"
            src="https://res.cloudinary.com/dyvccryuz/image/upload/w_600,q_75,f_auto/v1746259327/volunteer_a8negb.png"
            alt=""
          />
        </div>
      </div>

      {/* Revolution Section */}
      <div className="w-full py-12 px-6 md:px-16 bg-[#ebebeb] relative">
        <h1 className="text-[#335288] text-2xl font-serif mb-12">__Join us-</h1>

        <div className="flex flex-wrap justify-center items-center gap-8 mb-25">
          {/* Card 1 */}
          <div className="h-auto w-full sm:w-[80%] md:w-[45%] lg:w-[28%] flex flex-col items-center">
            <SkeletonImage
              className="w-full h-[250px] object-cover rounded-md hover:rotate-6 transition-all duration-300"
              src="https://res.cloudinary.com/dyvccryuz/image/upload/w_500,q_70,f_auto/v1746258776/photo12_i7kftb.jpg"
              alt="Plant Trees"
            />
            <div className="flex justify-around items-center w-full my-4">
              <h1 className="text-xl font-serif">Plant Trees</h1>
              <p className="text-zinc-500 font-serif text-lg">1150+</p>
            </div>
            <p className="text-center text-lg px-2">
              Plant trees today to gift a greener, cleaner, and healthier tomorrow for the next
              future generations.
            </p>
          </div>

          {/* Card 2 */}
          <div className="h-auto w-full sm:w-[80%] md:w-[45%] lg:w-[28%] flex flex-col pb-10 items-center">
            <SkeletonImage
              className="w-full h-[250px] object-cover rounded-md hover:rotate-6 transition-all duration-300"
              src="https://res.cloudinary.com/dyvccryuz/image/upload/w_500,q_70,f_auto/v1746258779/photo19_yaqpxi.jpg"
              alt="Awareness Campaign"
            />
            <div className="flex justify-around items-center w-full my-4">
              <h1 className="text-xl font-serif">Awareness Campaign</h1>
              <p className="text-zinc-500 font-serif text-lg">18+</p>
            </div>
            <p className="text-center text-lg px-2">
              Raise your voice, not pollution — protect our planet with cleaner choices and
              responsible actions today.
            </p>
          </div>

          {/* Card 3 */}
          <div className="h-auto w-full sm:w-[80%] md:w-[45%] lg:w-[28%] flex flex-col items-center">
            <SkeletonImage
              className="w-full h-[250px] object-cover rounded-md hover:rotate-6 transition-all duration-300"
              src="https://res.cloudinary.com/dyvccryuz/image/upload/w_500,q_70,f_auto/v1746258777/photo5_vi1ugb.jpg"
              alt="Forest Conservation"
            />
            <div className="flex justify-around items-center w-full my-4">
              <h1 className="text-xl font-serif">Forest Conservation</h1>
              <p className="text-zinc-500 font-serif text-lg">6+ acre</p>
            </div>
            <p className="text-center text-lg px-2">
              Forests breathe life into Earth; conserving them today ensures a greener, healthier
              world for generations.
            </p>
          </div>
        </div>

        {/* Learn More Button */}
        <Link
          to="/plans"
          className="absolute right-6 bottom-6 md:right-16 md:bottom-16 bg-[#335288] text-white pr-2 pl-3 py-2 rounded-full flex items-center gap-2 group"
        >
          Learn More
          <i className="fa-solid fa-arrow-right border-1 px-[13px] py-3 rounded-4xl transition-transform duration-300 group-hover:translate-x-2"></i>
        </Link>
      </div>
    </>
  );
};

export default Home;
