import Image from "next/image";

interface AboutProps {
  data: {title: string; content_en: string; content_hi: string; };
}
// const Aboutus = () => {
export default function Aboutus({ data }: AboutProps) {
    // console.log('About received data:', data);
    return (        
        <div id="aboutus-section" className="bg-bggrey">
            <h1 className="text-3xl text-iuml-green font-bold text-center py-8">{data.title}</h1>
            <div className='mx-auto max-w-7xl px-4 py-24 my-32 lg:px-10 bg-iuml-blue rounded-3xl relative'>
                <Image src="/images/aboutus/dots.svg" width={100} height={100} alt="dots-image" className="absolute bottom-1 -left-20" />                
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 my-16 gap-x-16 lg:gap-x-32'>
                    <h4 className='text-lg font-normal text-white group-hover:text-offwhite mb-5'>{data.content_en}</h4>
                    <h4 className='text-lg font-normal text-white group-hover:text-offwhite mb-5'>{data.content_hi}</h4>
                </div>
            </div>
        </div>
    )
}
