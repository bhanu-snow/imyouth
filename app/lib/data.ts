// app/lib/data.ts
import { headers } from 'next/headers';

export async function getData() {
  // Use the request host in production, fallback to dev URL
  const headersList = headers();
  const host = headersList.get('host');
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
  const baseUrl = host ? `${protocol}://${host}` : 'http://localhost:3000';
  const fetchUrl = `${baseUrl}/data.json`;
  console.log('Fetching data from:', fetchUrl);

  const res = await fetch(fetchUrl, {
    next: { revalidate: 86400 }, // Revalidate every 1 day
    cache: 'force-cache',
  });

  if (!res.ok) {
    console.error('Fetch error:', res.status, res.statusText);
    throw new Error('Failed to fetch data.json');
  }

  const data = await res.json();
  console.log('Fetched data:', JSON.stringify(data, null, 2));
  return data;
}