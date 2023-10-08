import { HeadMetaData } from '~/components/meta/HeadMetaData';
import { Button } from '~/components/ui/button';

const EventsPage = () => {
  return (
    <>
      <HeadMetaData title="Events" />
      <main className="container">
        <div className="flex flex-col gap-6">
          <h1 className="text-center text-3xl font-semibold md:text-5xl">
            Join event mabar bareng creator pilihan lo.
          </h1>
          <div className="flex flex-col">
            <Button className="self-center">🔴 Live Sekarang</Button>
          </div>
        </div>
      </main>
    </>
  );
};

export default EventsPage;
