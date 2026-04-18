"use client"

// import { useState } from "react"
import { Send, CheckCircle, Info } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
// import { Button } from "@/components/ui/button"

export default function TelegramSettingsPage() {
//   const [saved, setSaved] = useState(false)

  return (
    <div className="mx-auto max-w-2xl space-y-5 text-foreground">
      <div className="flex items-center gap-3">
        <Send className="size-5 text-blue-500" />
        <h1 className="text-xl font-bold">Telegram Bot Settings</h1>
      </div>

      <div className="rounded-xl border border-blue-200 bg-blue-50/80 px-4 py-3 dark:border-blue-500/30 dark:bg-blue-950/30">
        <div className="flex items-start gap-2.5">
          <Info className="mt-0.5 size-4 shrink-0 text-blue-500" />
          <p className="text-[13px] leading-relaxed text-blue-800 dark:text-blue-200">
            Telegram Bot integration is configured via server environment variables.
            New NID withdraw requests are automatically sent to your Telegram group with action buttons.
          </p>
        </div>
      </div>

      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Current Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label>Bot Token</Label>
            <Input disabled value="••••••••••••••••••••••••••" className="font-mono text-muted-foreground" />
            <p className="text-[11px] text-muted-foreground">Set via <code className="rounded bg-muted px-1">TELEGRAM_BOT_TOKEN</code> env variable</p>
          </div>
          <div className="space-y-1.5">
            <Label>Chat / Group ID</Label>
            <Input disabled value="••••••••••" className="font-mono text-muted-foreground" />
            <p className="text-[11px] text-muted-foreground">Set via <code className="rounded bg-muted px-1">TELEGRAM_CHAT_ID</code> env variable</p>
          </div>
          <div className="space-y-1.5">
            <Label>Webhook Secret</Label>
            <Input disabled value="••••••••••••" className="font-mono text-muted-foreground" />
            <p className="text-[11px] text-muted-foreground">Set via <code className="rounded bg-muted px-1">TELEGRAM_WEBHOOK_SECRET</code> env variable</p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">How it works</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-2.5 text-sm text-muted-foreground">
            {[
              "User submits NID withdraw request",
              "Bot sends message to Telegram group with Seen / Accept / Cancel / Send PDF buttons",
              "Admin taps a button — action executes instantly on the server",
              "User gets real-time status update via Socket.IO",
              "Admin NID page shows \"Handled by Telegram\" badge on updated rows",
            ].map((step, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">{i + 1}</span>
                {step}
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Webhook Registration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">Run this once to register your webhook with Telegram:</p>
          <pre className="overflow-x-auto rounded-xl border border-border bg-muted/40 p-4 text-[11px] text-foreground">
{`curl "https://api.telegram.org/bot<TOKEN>/setWebhook
  ?url=https://yourdomain.com/telegram/webhook
  &secret_token=<YOUR_SECRET>"`}
          </pre>
          <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-xs text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300">
            <CheckCircle className="size-3.5 shrink-0" />
            Webhook endpoint: <code className="ml-1 font-mono">POST /telegram/webhook</code>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}