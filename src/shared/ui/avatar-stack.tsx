export type AvatarStackProps = {
  users: string[];
};

export function AvatarStack({ users }: AvatarStackProps) {
  return (
    <div className="flex items-center">
      {users.map((user, index) => (
        <div
          key={user}
          className="-ml-2 flex h-10 w-10 items-center justify-center rounded-full border border-slate-950 bg-gradient-to-br from-emerald-300 to-lime-200 text-xs font-bold uppercase text-slate-950 first:ml-0"
          style={{ zIndex: users.length - index }}
          title={user}
        >
          {user
            .split(" ")
            .map((token) => token[0])
            .join("")
            .slice(0, 2)}
        </div>
      ))}
    </div>
  );
}
