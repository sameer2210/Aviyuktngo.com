import SkeletonImage from '../SkeletonImage';

const HomeStaticSections = () => {
  return (
    <>
      <div className="h-auto w-full bg-[#EBEBEB]">

        <div className="h-auto w-full md:w-[70%] mx-auto ">
          <div className="flex justify-between items-center mb-6 px-4">
            <h1 className="text-2xl md:text-3xl font-serif text-[#335288]">Our Cause</h1>
            <div className="flex gap-4">
              <i
                className="fa-solid fa-chevron-left px-4 py-3.5 bg-[#335288] text-white hover:bg-[#4477ce] active:scale-90 transition transform duration-150 ease-in-out cursor-pointer rounded"
                onClick={() => {
                  const container = document.getElementById('slider');
                  const cardWidth = container.offsetWidth / 3;
                  container.scrollLeft -= cardWidth;
                }}
              ></i>
              <i
                className="fa-solid fa-chevron-right px-4 py-3.5 bg-[#335288] text-white hover:bg-[#4477ce] active:scale-90 transition transform duration-150 ease-in-out cursor-pointer rounded"
                onClick={() => {
                  const container = document.getElementById('slider');
                  const cardWidth = container.offsetWidth / 3;
                  container.scrollLeft += cardWidth;
                }}
              ></i>
            </div>
          </div>

          <div
            id="slider"
            className="flex overflow-x-hidden border-t-1 p-2 border-zinc-500 scroll-smooth"
          >
            <div className="min-w-full md:min-w-1/2 lg:min-w-1/3 p-2 md:p-4">
              <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col items-center">
                <SkeletonImage
                  className="h-48 w-full object-cover hover:scale-[1.1] transition duration-300"
                  src="https://res.cloudinary.com/dyvccryuz/image/upload/v1746258778/photo17_ljomim.jpg"
                  alt="Support Education"
                  loading="lazy"
                />
                <div className="p-4">
                  <h2 className="text-lg font-semibold text-gray-800 mb-2">Free Education</h2>
                  <p className="text-gray-600 text-sm">
                    Help children access quality education and a brighter future.
                  </p>
                </div>
              </div>
            </div>
            <div className="min-w-full md:min-w-1/2 lg:min-w-1/3 p-2 md:p-4">
              <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col items-center">
                <SkeletonImage
                  className="h-48 w-full object-cover hover:scale-110 transition duration-300"
                  src="https://res.cloudinary.com/dyvccryuz/image/upload/v1746258778/photo16_osxlpx.jpg"
                  alt="Healthcare Aid"
                  loading="lazy"
                />
                <div className="p-4">
                  <h2 className="text-lg font-semibold text-gray-800 mb-2">Healthcare Aid</h2>
                  <p className="text-gray-600 text-sm">
                    Provide essential medical services to rural communities.
                  </p>
                </div>
              </div>
            </div>
            <div className="min-w-full md:min-w-1/2 lg:min-w-1/3 p-2 md:p-4">
              <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col items-center">
                <SkeletonImage
                  className="h-48 w-full object-cover hover:scale-[1.1] transition duration-300"
                  src="https://res.cloudinary.com/dyvccryuz/image/upload/v1746258778/photo9_c2ukbt.jpg"
                  alt="Feed the Hungry"
                  loading="lazy"
                />
                <div className="p-4">
                  <h2 className="text-lg font-semibold text-gray-800 mb-2">Feed the Hungry</h2>
                  <p className="text-gray-600 text-sm">
                    Distribute food to families facing hunger and poverty.
                  </p>
                </div>
              </div>
            </div>
            <div className="min-w-full md:min-w-1/2 lg:min-w-1/3 p-2 md:p-4">
              <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col items-center">
                <SkeletonImage
                  className="h-48 w-full object-cover hover:scale-[1.1] transition duration-300"
                  src="https://res.cloudinary.com/dyvccryuz/image/upload/v1746258776/photo1_blwial.jpg"
                  alt="Disaster Relief"
                  loading="lazy"
                />
                <div className="p-4">
                  <h2 className="text-lg font-semibold text-gray-800 mb-2">Disaster Relief</h2>
                  <p className="text-gray-600 text-sm">
                    Support recovery efforts for those affected by disasters.
                  </p>
                </div>
              </div>
            </div>
            <div className="min-w-full md:min-w-1/2 lg:min-w-1/3 p-2 md:p-4">
              <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col items-center">
                <SkeletonImage
                  className="h-48 w-full object-cover hover:scale-[1.1] transition duration-300"
                  src="https://res.cloudinary.com/dyvccryuz/image/upload/v1746258777/photo2_xov8qg.jpg"
                  alt="Women Empowerment"
                  loading="lazy"
                />
                <div className="p-4">
                  <h2 className="text-lg font-semibold text-gray-800 mb-2">Women Empowerment</h2>
                  <p className="text-gray-600 text-sm">
                    Empower women through education, skills and opportunities.
                  </p>
                </div>
              </div>
            </div>
            <div className="min-w-full md:min-w-1/2 lg:min-w-1/3 p-2 md:p-4">
              <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col items-center">
                <SkeletonImage
                  className="h-48 w-full object-cover hover:scale-[1.1] transition duration-300"
                  src="https://res.cloudinary.com/dyvccryuz/image/upload/v1746258777/photo13_idz2pi.jpg"
                  alt="Save Environment"
                  loading="lazy"
                />
                <div className="p-4">
                  <h2 className="text-lg font-semibold text-gray-800 mb-2">Save Environment</h2>
                  <p className="text-gray-600 text-sm">
                    Protect natural resources and promote sustainable living.
                  </p>
                </div>
              </div>
            </div>
            <div className="min-w-full md:min-w-1/2 lg:min-w-1/3 p-2 md:p-4">
              <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col items-center">
                <SkeletonImage
                  className="h-48 w-full object-cover hover:scale-[1.1] transition duration-300"
                  src="https://images.pexels.com/photos/6235021/pexels-photo-6235021.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  alt="Animal Welfare"
                  loading="lazy"
                />
                <div className="p-4">
                  <h2 className="text-lg font-semibold text-gray-800 mb-2">Animal Welfare</h2>
                  <p className="text-gray-600 text-sm">
                    Provide shelter and food for stray and abandoned animals.
                  </p>
                </div>
              </div>
            </div>
            <div className="min-w-full md:min-w-1/2 lg:min-w-1/3 p-2 md:p-4">
              <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col items-center">
                <SkeletonImage
                  className="h-48 w-full object-cover hover:scale-[1.1] transition duration-300"
                  src="https://plus.unsplash.com/premium_photo-1702088085024-85e3cdd462fa?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Art and Culture"
                  loading="lazy"
                />
                <div className="p-4">
                  <h2 className="text-lg font-semibold text-gray-800 mb-2">Art and Culture</h2>
                  <p className="text-gray-600 text-sm">
                    Preserve and promote local art and cultural heritage.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomeStaticSections;
