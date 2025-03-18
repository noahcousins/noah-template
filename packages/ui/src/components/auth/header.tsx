interface HeaderProps {
  headerLabel: string;
}

export const AuthHeader = ({ headerLabel }: HeaderProps) => {
  return (
    <div>
      <h1>{headerLabel}</h1>
    </div>
  );
};
