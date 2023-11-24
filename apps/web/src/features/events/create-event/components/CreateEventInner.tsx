import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarIcon } from '@radix-ui/react-icons';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';

import { Button } from '~/components/ui/button';
import { Calendar } from '~/components/ui/calendar';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/components/ui/popover';
import { Textarea } from '~/components/ui/textarea';
import { cn } from '~/lib/utils';
import {
  CreateEventFormSchema,
  createEventFormSchema,
} from '../form/create-event';

type CreateEventInnerProps = {
  onSubmit: (values: CreateEventFormSchema) => void;
  defaultValues?: CreateEventFormSchema;
  isPending?: boolean;
};

export const CreateEventInner: React.FC<CreateEventInnerProps> = ({
  onSubmit,
  defaultValues,
  isPending = false,
}) => {
  const form = useForm<CreateEventFormSchema>({
    resolver: zodResolver(createEventFormSchema),
    defaultValues: {
      description: defaultValues?.description || '',
      endRegistrationDate: defaultValues?.endRegistrationDate || new Date(),
      startRegistrationDate: defaultValues?.startRegistrationDate || new Date(),
      maxPlayers: defaultValues?.maxPlayers || 1,
      title: defaultValues?.title || '',
    },
    reValidateMode: 'onChange',
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-2 rounded-md border p-4">
          <h3 className="text-md text-muted-foreground">Detail event</h3>

          <FormField
            name="title"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Judul event yang menarik perhatian"
                    {...field}
                  />
                </FormControl>
                <FormDescription>{field.value.length}/100</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="description"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Deskripsi tentang event kamu.."
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormDescription>{field.value.length}/1000</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="maxPlayers"
            control={form.control}
            render={() => (
              <FormItem>
                <FormLabel>Max players</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...form.register('maxPlayers', {
                      valueAsNumber: true,
                    })}
                    placeholder="Jumlah maximum player di event"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="mt-4 flex flex-col gap-4 rounded-md border p-4 lg:grid lg:grid-cols-2 lg:gap-4">
          <h3 className="text-md col-span-full text-muted-foreground lg:mb-0">
            Jadwal event
          </h3>

          <FormField
            name="startRegistrationDate"
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Buka Pendaftaran</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'w-full justify-start text-left font-normal',
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? (
                          format(field.value, 'PPP')
                        ) : (
                          <span className="text-muted-foreground">
                            Pilih tanggal pendaftaran dibuka
                          </span>
                        )}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      selected={field.value}
                      onSelect={field.onChange}
                      mode="single"
                      initialFocus
                      fromDate={new Date()}
                    />
                  </PopoverContent>
                </Popover>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="endRegistrationDate"
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Tutup Pendaftaran</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'w-full justify-start text-left font-normal',
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? (
                          format(field.value, 'PPP')
                        ) : (
                          <span className="text-muted-foreground">
                            Pilih tanggal pendaftaran ditutup
                          </span>
                        )}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      selected={field.value}
                      onSelect={field.onChange}
                      mode="single"
                      initialFocus
                      fromDate={form.watch('startRegistrationDate')}
                    />
                  </PopoverContent>
                </Popover>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button disabled={isPending} type="submit" className="mt-4 w-full">
          Simpan
        </Button>
      </form>
    </Form>
  );
};
