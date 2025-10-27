// app/lib/data.ts
export async function getData() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
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