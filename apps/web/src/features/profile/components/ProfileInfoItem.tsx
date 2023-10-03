interface ProfileInfoItemProps {
  icon: React.ReactNode;
  text: string;
}

export const ProfileInfoItem: React.FC<ProfileInfoItemProps> = ({
  icon,
  text,
}) => {
  return (
    <div className="flex items-center gap-2">
      {icon} {text}
    </div>
  );
};
