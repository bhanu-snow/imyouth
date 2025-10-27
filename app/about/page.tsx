import Aboutus from '../components/Aboutus/index';
import { Inter } from 'next/font/google';
import { getData } from '../lib/data';

const inter = Inter({ subsets: ['latin'] });

export default async function About() {
  const data = await getData();

  return (
    <main className={`min-h-screen flex-col ${inter.className}`}>      
      <Aboutus data={data.about} />
    </main>
  );
}

export const revalidate = 86400; // Revalidate every 1 day