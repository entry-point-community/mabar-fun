import { useState } from 'react';

import { HeadMetaData } from '~/components/meta/HeadMetaData';
import { EditProfileFormInner } from '~/features/profile/components';
import { ProfileDisplaySection } from '~/features/profile/components/ProfileDisplaySection';

const ProfilePage = () => {
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  return (
    <>
      <HeadMetaData />
      <main className="container min-h-screen max-w-screen-md">
        {isEditMode ? (
          <>
            <EditProfileFormInner
              onCancel={() => setIsEditMode(false)}
              onSubmit={(values) => console.log(values)}
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
