export default function AppLoading() {
  return (
    <div className="page-stack animate-pulse">
      <div className="space-y-4">
        <div className="h-4 w-32 rounded-full bg-white/10" />
        <div className="h-10 max-w-xl rounded-2xl bg-white/10" />
        <div className="h-16 max-w-2xl rounded-2xl bg-white/8" />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="h-72 rounded-2xl bg-white/6" />
        <div className="h-72 rounded-2xl bg-white/6" />
      </div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <div className="h-40 rounded-2xl bg-white/6" />
        <div className="h-40 rounded-2xl bg-white/6" />
        <div className="h-40 rounded-2xl bg-white/6" />
        <div className="h-40 rounded-2xl bg-white/6" />
      </div>
    </div>
  );
}
