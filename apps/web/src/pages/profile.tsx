import { useState } from 'react';
import { useEditProfileMutation } from '@v6/api';

import { HeadMetaData } from '~/components/meta/HeadMetaData';
import {
  EditProfileFormInner,
  ProfileDisplaySection,
} from '~/features/profile/components';
import { EditProfileFormSchema } from '~/features/profile/forms/edit-profile';
import { queryClient } from '~/lib/react-query';

const ProfilePage = () => {
  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  const { mutateAsync: editProfileMutate } = useEditProfileMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['profile'],
      });
    },
  });

  const handleEditProfileSubmit = async (
    values: EditProfileFormSchema & { profilePictureFile?: File },
  ) => {
    await editProfileMutate(values);
    setIsEditMode(false);
  };

  return (
    <>
      <HeadMetaData />
      <main className="container min-h-screen max-w-screen-md">
        {isEditMode ? (
          <>
            <EditProfileFormInner
              onCancel={() => setIsEditMode(false)}
              onSubmit={handleEditProfileSubmit}
            />
          </>
        ) : (
          <ProfileDisplaySection onEditProfile={() => setIsEditMode(true)} />
        )}
      </main>
    </>
  );
};

export default ProfilePage;
