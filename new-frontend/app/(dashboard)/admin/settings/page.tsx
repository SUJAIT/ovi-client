// app/(dashboard)/admin/settings/page.tsx
import SlideManager from "./dashboard-slide-manager"
import MarqueeManager from "./marquee-manager"
import PricingTableManager from "./PricingTableManager"
import ServerCopyManager from "./server-copy-Manager"
import ServiceManager from "./service-manager"

export default function AdminSettingsPage() {
  return (
    <div className="mx-auto w-full max-w-7xl p-4 md:p-6">

      {/* Page header — unchanged */}
      <div className="mb-6 overflow-hidden rounded-[28px] border border-border bg-card shadow-sm">
        <div className="bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.16),_transparent_35%),linear-gradient(135deg,#0f172a_0%,#1e293b_55%,#334155_100%)] px-6 py-7 text-white md:px-8 md:py-8">
          <div className="max-w-3xl">
            <div className="mb-3 inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.1em] text-slate-200">
              ICT-SEBA Application Manage
            </div>
            <h1 className="text-2xl font-bold md:text-4xl">Admin Settings</h1>
          </div>
        </div>
      </div>

      <div className="grid gap-6">

        {/* Marquee — unchanged */}
        <MarqueeManager />

  {/* slide-manager */}

    <div>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Slide-Manager Settings
          </h2>
          <div className="grid gap-5"><SlideManager /></div>
        </div>


        <div>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Server-Copy Settings
          </h2>
          <div className="grid gap-5">
            {/* Server Copy page heading, charge & notice */}
            <ServerCopyManager />

            {/* Custom services (create / edit / delete) */}

          </div>
          
        </div>
        <div>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Own-Service-Create-CRUD Settings
          </h2>
          <div className="grid gap-5">     <ServiceManager /></div>
        </div>
             {/* ── NEW: Pricing Table ──────────────────────────────────────────── */}
        <div>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Service Pricing Table Settings
          </h2>
          <div className="rounded-[20px] border border-border bg-card p-5 shadow-sm">
            <PricingTableManager />
          </div>
        </div>
        

      </div>


    </div>
  )
}
