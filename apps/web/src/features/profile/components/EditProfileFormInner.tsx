import { ChangeEventHandler, useRef, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useGetProfileQuery } from '@v6/api';
import { MlbbRole } from '@v6/db';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { mlbbRoleEnumToText } from '~/utils/role';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Button } from '~/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import {
  EditProfileFormSchema,
  editProfileFormSchema,
} from '../forms/edit-profile';

type EditProfileFormInnerProps = {
  onSubmit: (
    values: EditProfileFormSchema & { profilePictureFile?: File },
  ) => void;
  onCancel: () => void;
};

export const EditProfileFormInner: React.FC<EditProfileFormInnerProps> = ({
  onSubmit,
  onCancel,
}) => {
  const [selectedProfilePictureFile, setSelectedProfilePictureFile] =
    useState<File | null>(null);
  const inputProfilePictureRef = useRef<HTMLInputElement>(null);

  const { data: profile } = useGetProfileQuery({});

  const form = useForm<EditProfileFormSchema>({
    defaultValues: {
      displayName: profile?.data.displayName || '',
      mlbbRole: profile?.data.mlbbRole || 'EXP',
      mlbbServerId: profile?.data.mlbbServerId || '',
      mlbbUserId: profile?.data.mlbbUserId || '',
    },
    resolver: zodResolver(editProfileFormSchema),
    reValidateMode: 'onChange',
  });

  const handleInputProfilePictureChange: ChangeEventHandler<
    HTMLInputElement
  > = (event) => {
    const MAX_SIZE = 5 * 1024 * 1024;

    if (event.target.files?.length) {
      if (event.target.files[0].size > MAX_SIZE) {
        return toast.error('Batas file size 5 MB');
      }

      setSelectedProfilePictureFile(event.target.files[0]);
    }
  };

  const renderProfilePictureUrl = () => {
    if (selectedProfilePictureFile)
      return URL.createObjectURL(selectedProfilePictureFile);

    return profile?.data.profilePictureUrl || '';
  };

  return (
    <>
      <div className="mb-6 flex items-center gap-6">
        <Avatar className="h-16 w-16 sm:h-24 sm:w-24">
          <AvatarFallback>
            {profile?.data.displayName?.charAt(0)}
          </AvatarFallback>
          <AvatarImage src={renderProfilePictureUrl()} />
        </Avatar>
        <Input
          onChange={handleInputProfilePictureChange}
          type="file"
          className="hidden"
          ref={inputProfilePictureRef}
        />
        <div className="flex flex-col gap-2">
          <Button
            onClick={() => inputProfilePictureRef.current?.click()}
            size="sm"
            variant="ghost"
          >
            Change
          </Button>
          <Button
            onClick={() => setSelectedProfilePictureFile(null)}
            variant="destructive"
            size="sm"
          >
            Remove
          </Button>
        </div>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((values) =>
            onSubmit({
              ...values,
              profilePictureFile: selectedProfilePictureFile || undefined,
            }),
          )}
          className="flex flex-col gap-1"
        >
          <FormField
            control={form.control}
            name="displayName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Display Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="mlbbUserId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>MLBB User ID</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="mlbbServerId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>MLBB Server ID</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="mlbbRole"
            render={({ field }) => (
              <FormItem>
                <FormLabel>MLBB Role</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a verified email to display" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(MlbbRole).map((role) => (
                      <SelectItem key={role} value={role}>
                        {mlbbRoleEnumToText(role)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="mt-4 flex gap-2">
            <Button size="sm" type="submit">
              Save
            </Button>
            <Button onClick={onCancel} size="sm" variant="secondary">
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};
