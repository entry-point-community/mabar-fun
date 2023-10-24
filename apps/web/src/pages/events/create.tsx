import { HeadMetaData } from '~/components/meta/HeadMetaData';
import { CreateEventInner } from '~/features/events/create-event/components';
import { CreateEventFormSchema } from '~/features/events/create-event/form/create-event';

const CreateEventPage = () => {
  const handleCreateEvent = (formValues: CreateEventFormSchema) => {
    console.log(formValues);
  };

  return (
    <>
      <HeadMetaData />
      <main className="container min-h-screen max-w-screen-md">
        <h1 className="mb-4 text-2xl font-semibold">Schedule event</h1>

        <CreateEventInner onSubmit={handleCreateEvent} />
      </main>
    </>
  );
};

export default CreateEventPage;
