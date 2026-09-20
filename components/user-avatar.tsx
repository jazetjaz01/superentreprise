import Image from "next/image";

type UserAvatarProps = {
  name: string;
  avatarUrl?: string | null;
  size?: number;
};

export const UserAvatar = ({ name, avatarUrl, size = 32 }: UserAvatarProps) => {
  const dimensions = { width: size, height: size };

  if (avatarUrl) {
    return (
      <Image
        src={avatarUrl}
        alt={name}
        title={name}
        width={size}
        height={size}
        unoptimized
        referrerPolicy="no-referrer"
        style={dimensions}
        className="shrink-0 rounded-full object-cover"
      />
    );
  }

  return (
    <span
      title={name}
      style={{ ...dimensions, fontSize: size * 0.4 }}
      className="flex shrink-0 items-center justify-center rounded-full bg-muted font-medium uppercase"
    >
      {name.trim().charAt(0)}
    </span>
  );
};
