import { useGetProfileQuery } from '@v6/api';
import { IoGameController, IoGlobe } from 'react-icons/io5';
import { PiSwordBold } from 'react-icons/pi';

import { mlbbRoleEnumToText } from '~/utils/role';
import { Avatar, AvatarImage } from '~/components/ui/avatar';
import { Button } from '~/components/ui/button';
import { ProfileInfoItem } from '.';

interface ProfileDisplaySection {
  onEditProfile: () => void;
}

export const ProfileDisplaySection: React.FC<ProfileDisplaySection> = ({
  onEditProfile,
}) => {
  const { data: profile } = useGetProfileQuery({
    config: {
      staleTime: Infinity,
    },
  });

  return (
    <div className="flex flex-col gap-4 lg:gap-8">
      <div className="flex justify-between">
        <div className="flex gap-4">
          <Avatar className="h-16 w-16 sm:h-24 sm:w-24">
            <AvatarImage src="https://cdn.discordapp.com/attachments/1050790741334569091/1157928772754997269/avatar.jpg" />
          </Avatar>
          <div className="flex flex-col justify-center truncate">
            <h3 className="truncate text-xl font-semibold sm:text-2xl">
              {profile?.data.displayName}
            </h3>
            <div className="flex items-center">
              <IoGameController />
              <h5 className="ml-2">{profile?.data.mlbbUsername}</h5>
            </div>
          </div>
        </div>
        <Button
          onClick={onEditProfile}
          className="hidden self-center lg:inline-block"
          variant="secondary"
        >
          Edit Profile
        </Button>
      </div>

      <Button
        onClick={onEditProfile}
        className="w-full lg:hidden"
        variant="secondary"
      >
        Edit Profile
      </Button>

      <div className="flex flex-col gap-1">
        <ProfileInfoItem
          icon={<IoGlobe />}
          text={`${profile?.data.mlbbUserId} (${profile?.data.mlbbServerId})`}
        />
        <ProfileInfoItem
          icon={<PiSwordBold />}
          text={mlbbRoleEnumToText(profile?.data.mlbbRole)}
        />
      </div>
    </div>
  );
};
