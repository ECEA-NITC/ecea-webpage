import Image from "next/image";
import Hero from '@/app/components/hero'

import LogoCarousel from '@/app/components/carousel'
import Featured from '@/app/components/featured'

export default function Home() {
  return (
    <div className="">
      <main>
        <Hero></Hero>
        <LogoCarousel></LogoCarousel>
        <Featured></Featured>
      </main>
    </div>
  );
}
