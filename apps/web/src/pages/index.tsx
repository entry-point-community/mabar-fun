import { IoBook, IoGameController } from 'react-icons/io5';

import { HeadMetaData } from '~/components/HeadMetaData';
import { Button } from '~/components/ui/button';
import { Separator } from '~/components/ui/separator';
import { FeatureShowcaseItem } from '~/features/home/components';

export default function Home() {
  return (
    <>
      <HeadMetaData
        ogImageUrl="https://cdn.discordapp.com/attachments/1050790741334569091/1157744570814189709/mabar_fun.png"
        metaDescription="Platform MLBB guide, tutorial, dan main bareng creator favorite lo."
      />
      <main className="container flex min-h-screen max-w-screen-md flex-col gap-6 px-4 py-16">
        <div className="flex flex-col gap-4">
          <h1 className="text-center font-heading text-5xl font-bold lg:text-7xl">
            Mabar.<span className="text-primary">Fun</span>
          </h1>
          <p className="text-center text-2xl lg:text-3xl">
            Platform guide, tutorial, dan main bareng creator favorite lo.
          </p>
        </div>
        <div className="flex justify-center gap-4">
          <Button className="text-md">Ikut mabar 🚀</Button>
          <Button className="text-md" variant="secondary">
            Mau liat-liat guide 👀
          </Button>
        </div>

        <section className="mt-16">
          <div className="flex flex-col gap-4 lg:grid lg:grid-cols-2">
            <FeatureShowcaseItem
              heading="Mabar sama creator favorite lo"
              description="Join event yang lagi berlangsung. Daftar, join room, dan ratakan Land of Dawn."
              icon={<IoGameController />}
            />
            <Separator className="lg:hidden" />
            <FeatureShowcaseItem
              heading="Ajarin dong puh sepuh"
              description="Mau belajar hero? Cari guide berkualitas yang dibikin sama para sepuh terpercaya."
              icon={<IoBook />}
            />
          </div>
        </section>
      </main>
    </>
  );
}
