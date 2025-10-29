import Image from "next/image";

interface InspirationProps {
  data: {
    title: string;
    people: { guid: string; name: string; year: string; post: string; quote_en: string; quote_hi: string }[];         
  };
}

export default function Inspiration({ data }: InspirationProps) {
    //console.log('Inspiration received data:', data);
    return (
        <div className="relative">

            <Image src="/images/inspiration/spiral.svg" height={272} width={686} alt="spiral-design" className="absolute left-0 hidden lg:block -z-10" />

            <div className='mx-auto max-w-7xl px-4 my-40 sm:py-20 lg:px-8'>
                <div className='grid grid-cols-1 md:grid-cols-2 my-16'>

                    {/* COLUMN-1 */}
                    <div>
                        <Image src="/images/inspiration/inspiration.webp" alt={data.people[0].name || data.people[1].name} width={416} height={530} className="mx-auto md:mx-0" />
                    </div>

                    {/* COLUMN-2 */}
                    <div className="relative">
                        <Image src="images/inspiration/comma.svg" alt="comma-image" width={200} height={106} className="absolute comma-pos hidden lg:block" />
                        <h2 className="text-4xl lg:text-65xl pt-4 font-bold sm:leading-tight mt-5 text-center lg:text-start">{data.title}</h2>
                        <p className="font-medium text-lightblack text-2xl mt-5 text-center lg:text-start">{data.people[0].quote_en}</p>
                        <p className="font-medium text-lightblack text-2xl mt-5 text-center lg:text-start">{data.people[0].quote_hi}</p>
                        <p className="text-2xl font-semibold mt-12 lg:ml-32 preline text-center lg:text-start"> {data.people[0].name || data.people[0].year}</p>
                        <hr /><br />
                        <p className="font-medium text-lightblack text-2xl mt-5 text-center lg:text-start">{data.people[1].quote_en}</p>
                        <p className="font-medium text-lightblack text-2xl mt-5 text-center lg:text-start">{data.people[1].quote_hi}</p>
                        <p className="text-2xl font-semibold mt-12 lg:ml-32 preline text-center lg:text-start"> {data.people[1].name || data.people[1].year}</p>                        
                    </div>
                </div>
            </div>
        </div>
    )
}


