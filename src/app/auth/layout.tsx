interface Props {
  children: React.ReactNode;
}

function layout({ children }: Props) {
  return (
    <main className="flex justify-center">
      <div className="w-full sm:w-[450px] px-10">{children}</div>
    </main>
  );
}

export default layout;
