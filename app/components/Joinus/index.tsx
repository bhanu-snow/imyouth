
const Join = () => {
    return (
        <div className="bg-joinus my-32">
            <div className='mx-auto max-w-2xl lg:max-w-7xl sm:py-4 lg:px-8'>

                <div className="text-center">
                    <h3 className="text-blue text-lg font-bold tracking-widest">हमसे जुड़ो - सच्चा नेतृत्व, बराबर का न्याय, भ्रष्ट नेताओं का अंत! ईमानदार युवा नेतृत्व बनो</h3>
                    <h2 className="text-4xl sm:text-6xl font-bold my-6 leading-10">JOIN US अगर तुम चुप रहे, तो भ्रष्ट जीतेंगे।<br />बोलो, लड़ो, बदलो!</h2>
                    <p className="text-iuml-green text-base font-bold">तुम थक चुके हो?
                        <br /> ➠ भ्रष्ट नेता जो सिर्फ कुर्सी बचाते हैं
                        <br /> ➠ असमान न्याय - अमीर को छूट, गरीब को सजा
                        <br /> ➠ विकास का नामोनिशान - सड़कें टूटी, स्कूल बंद, नौकरी सपना
                    </p>
                </div>

                <div className="mx-auto max-w-4xl pt-5">
                    <div className="sm:flex items-center mx-5 p-5 sm:p-0 rounded-xl justify-between bg-lightgrey sm:rounded-full">
                        <div>
                            <input type="name" className="my-4 py-4 sm:pl-6 lg:text-xl text-black sm:rounded-full bg-lightgrey pl-1 focus:outline-none bg-emailbg focus:text-black" placeholder="Your name" autoComplete="off" />
                        </div>
                        <div>
                            <input type="mobile" className="my-4 py-4 sm:pl-6 lg:text-xl text-black sm:border-l border-linegrey bg-lightgrey focus:outline-none bg-emailbg focus:text-black" placeholder="Your Mobile No." autoComplete="off" />
                        </div>
                        <div className="sm:mr-3">
                            <button type="submit" className="joinButton w-full sm:w-0 text-xl text-white font-semibold text-center rounded-xl sm:rounded-full bg-blue hover:bg-btnblue">
                                JOIN MYL
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Join;
