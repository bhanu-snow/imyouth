interface ViMissionProps {
  data: {
    title: string;
    Sections: { guid: string; name: string; content_en: string; content_hi: string; imgSrc: string; link: string; }[];         
  };
}
// const Aboutus = () => {
export default function ViMission({ data }: ViMissionProps) {
    console.log('ViMission received data:', data);

    return (
        <div className='mx-auto max-w-2xl lg:max-w-7xl sm:py-4 lg:px-8 rounded-3xl'>
            <div className='grid grid-cols-1 lg:grid-cols-2 my-16 mx-5 gap-5'>

                {/* COLUMN-1 */}

                <div className="bg-iuml-blue bg-beli pt-12 px-10 sm:px-24 pb-52 md:pb-70 rounded-3xl">
                    <h2 className="text-lg font-normal text-white tracking-widest mb-5 text-center sm:text-start">{data.Sections[0].name}</h2>
                    <h3 className="text-2xl sm:text-39xl font-bold text-white leading-snug mb-5 text-center sm:text-start">{data.Sections[0].content_en}</h3>
                    <br />
                    <h5 className="text-2xl sm:text-26xl text-white leading-snug mb-5 text-center sm:text-start">{data.Sections[0].content_hi}</h5>
                    <div className="text-center sm:text-start">
                        <button className="text-xl py-5 px-14 mt-5 font-semibold text-white rounded-full bg-iuml-green border border-iuml-green hover:bg-iuml-blue">{data.Sections[0].name}</button>
                    </div>
                </div>

                {/* COLUMN-2 */}

                <div className="bg-iuml-green pt-12 px-10 sm:px-24 pb-52 md:pb-70 rounded-3xl">
                    <h2 className="text-lg font-normal text-white tracking-widest mb-5 text-center sm:text-start">{data.Sections[1].name}</h2>
                    <h3 className="text-2xl sm:text-39xl font-bold text-white leading-snug mb-5 text-center sm:text-start">{data.Sections[1].content_en}</h3>
                    <br />
                    <h5 className="text-2xl sm:text-26xl text-white leading-snug mb-5 text-center sm:text-start">{data.Sections[1].content_hi}</h5>
                    <div className="text-center sm:text-start">
                        <button className="text-xl py-5 px-14 mt-5 font-semibold text-white rounded-full bg-iuml-blue border border-iuml-blue hover:bg-iuml-green">{data.Sections[1].name}</button>
                    </div>
                </div>

            </div>
        </div>
    )
}
