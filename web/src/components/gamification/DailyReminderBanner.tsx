export function DailyReminderBanner({ playedToday }: { playedToday: boolean }) {
  return (
    <div
      className={`rounded-2xl p-4 text-sm font-heading font-semibold ${
        playedToday ? 'bg-bg-card-alt text-text-primary' : 'bg-coral-tint text-coral-dark'
      }`}
    >
      {playedToday
        ? 'Dnes už máš splněno! 🎉 Zítra můžeš pokračovat v řadě.'
        : 'Dnes ještě nehrálo/a jsi! 🎯 Zahraj a udrž řadu.'}
    </div>
  )
}
