export default function AppLoading() {
  return (
    <div className="animate-pulse space-y-5">
      <div className="space-y-3">
        <div className="h-4 w-32 rounded-full bg-white/10" />
        <div className="h-9 max-w-xl rounded-2xl bg-white/10" />
        <div className="h-14 max-w-2xl rounded-2xl bg-white/8" />
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="h-64 rounded-2xl bg-white/6" />
        <div className="h-64 rounded-2xl bg-white/6" />
      </div>
    </div>
  );
}
