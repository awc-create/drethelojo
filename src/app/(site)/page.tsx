// src/app/page.tsx
import HomeClient from './HomeClient';

export const dynamic = 'force-dynamic';

export default async function Home() {
  return <HomeClient />;
}
