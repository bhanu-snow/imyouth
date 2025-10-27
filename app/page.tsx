import Banner from './components/Banner/index';
import Dedicated from './components/Dedicated/index';
import Digital from './components/Digital/index';
import ViMission from './components/ViMission/index';
import Wework from './components/Wework/index';
import Ourteam from './components/Ourteam/index';
import Featured from './components/Featured/index';
import Manage from './components/Manage/index';
import FAQ from './components/FAQ/index';
import Testimonials from './components/Testimonials/index';
import Articles from './components/Articles/index';
import Joinus from './components/Joinus/index';
import Insta from './components/Insta/index';
import { getData } from './lib/data';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default async function Home() {
  const data = await getData();

  return (
    <main>
      {/* <Banner /> */}
      <ViMission data={data.ViMission} />
      <Dedicated />
      <Digital />      
      <Wework />
      <Ourteam />
      <Featured />
      <Manage />
      <FAQ data={data.faq}/>
      <Testimonials />
      <Articles />
      <Joinus />
      <Insta />
    </main>
  )
}
export const revalidate = 86400; // Revalidate the page every 1 day