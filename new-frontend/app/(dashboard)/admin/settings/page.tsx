import MarqueeManager from "./marquee-manager"

export default function AdminSettingsPage() {
  return (
    <div className="mx-auto w-full max-w-7xl p-4 md:p-6">
      <div className="mb-6 overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
        <div className="bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.16),_transparent_35%),linear-gradient(135deg,#0f172a_0%,#1e293b_55%,#334155_100%)] px-6 py-7 text-white md:px-8 md:py-8">
          <div className="max-w-3xl">
            <div className="mb-3 inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.1em] text-slate-200">
              ICT-SEBA Application Manage
            </div>
            <h1 className="text-2xl font-bold md:text-4xl">Admin Settings</h1>
            {/* <p className="mt-3 text-sm leading-6 text-slate-200 md:text-base">
              এখান থেকে ধীরে ধীরে পুরো application-এর admin-controlled settings manage করা যাবে।
            </p> */}
          </div>
        </div>
      </div>

      <div className="grid gap-6">
        <MarqueeManager />
      </div>
    </div>
  )
}
