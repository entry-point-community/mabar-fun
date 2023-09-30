type FeatureShowcaseItemProps = {
  icon: React.ReactElement;
  heading: string;
  description: string;
};

export const FeatureShowcaseItem: React.FC<FeatureShowcaseItemProps> = ({
  description,
  heading,
  icon,
}) => {
  return (
    <div className="flex flex-col gap-1 rounded-md p-4">
      <div className="text-[32px]">{icon}</div>
      <h5 className="mt-2 text-xl font-semibold">{heading}</h5>
      <p>{description}</p>
    </div>
  );
};
