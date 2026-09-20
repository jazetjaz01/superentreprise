import Image from "next/image";

type UserAvatarProps = {
  name: string;
  avatarUrl?: string | null;
};

export const UserAvatar = ({ name, avatarUrl }: UserAvatarProps) => {
  if (avatarUrl) {
    return (
      <Image
        src={avatarUrl}
        alt={name}
        title={name}
        width={32}
        height={32}
        unoptimized
        referrerPolicy="no-referrer"
        className="size-8 rounded-full object-cover"
      />
    );
  }

  return (
    <span
      title={name}
      className="flex size-8 items-center justify-center rounded-full bg-muted text-sm font-medium uppercase"
    >
      {name.trim().charAt(0)}
    </span>
  );
};
