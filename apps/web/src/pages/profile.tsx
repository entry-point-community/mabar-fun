import { useGetProfileQuery } from '@v6/api';
import { IoGameController, IoGlobe, IoPerson } from 'react-icons/io5';
import { PiSwordBold } from 'react-icons/pi';

import { mlbbRoleEnumToText } from '~/utils/role';
import { HeadMetaData } from '~/components/meta/HeadMetaData';
import { Avatar, AvatarImage } from '~/components/ui/avatar';
import { Button } from '~/components/ui/button';

const ProfilePage = () => {
  const { data: profile } = useGetProfileQuery({});

  const renderFavoriteHeroes = () => {
    return profile?.data.ProfileHero.map(
      (profileHero) => profileHero.hero.name,
    ).join(', ');
  };

  return (
    <>
      <HeadMetaData />
      <main className="container min-h-screen max-w-screen-md">
        <div className="flex gap-4">
          <Avatar className="h-24 w-24">
            <AvatarImage src="https://cdn.discordapp.com/attachments/1050790741334569091/1157928772754997269/avatar.jpg" />
          </Avatar>
          <div className="flex flex-col justify-center">
            <h3 className="truncate text-2xl font-semibold">
              {profile?.data.displayName}
            </h3>
            <div className="flex items-center">
              <IoGameController />
              <h5 className="ml-2">{profile?.data.mlbbUsername}</h5>
            </div>
          </div>
        </div>

        <Button className="mt-4 w-full" variant="secondary">
          Edit Profile
        </Button>

        <div className="mt-4 flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <IoGlobe /> {profile?.data.mlbbUserId} ({profile?.data.mlbbServerId}
            )
          </div>
          <div className="flex items-center gap-2">
            <PiSwordBold /> {mlbbRoleEnumToText(profile?.data.mlbbRole)}
          </div>
          <div className="flex items-center gap-2">
            <IoPerson /> {renderFavoriteHeroes()}
          </div>
        </div>
      </main>
    </>
  );
};

export default ProfilePage;
