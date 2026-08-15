export default function AppLoading() {
  return (
    <div className="animate-pulse space-y-6 pt-2 sm:pt-3">
      <div className="space-y-2">
        <div className="h-3 w-28 rounded-full bg-white/10" />
        <div className="h-8 max-w-md rounded-2xl bg-white/10" />
        <div className="h-10 max-w-xl rounded-2xl bg-white/8" />
      </div>
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.25fr)_minmax(300px,0.75fr)]">
        <div className="h-72 rounded-2xl bg-white/6" />
        <div className="h-72 rounded-2xl bg-white/6" />
      </div>
    </div>
  );
}
