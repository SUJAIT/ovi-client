"use client"

import { useEffect, useMemo, useState } from "react"
import {
  Banknote,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Loader2,
  PackageCheck,
  Sparkles,
  User2,
  XCircle,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export type TPricingRow = {
  _id?: string
  service: string
  description: string
  userProvides: string
  deliverable: string
  price: number
  unit: string
  available: boolean
  order: number
}

type TPublicSettings = {
  pricingTableEnabled?: boolean
  pricingTableTitle?: string
  pricingTableRows?: TPricingRow[]
}

type Props = {
  title?: string
  rows?: TPricingRow[]
}

const DEFAULT_TITLE = "আমাদের সেবা ও মূল্য তালিকা"

export default function ServicePricingTable({ title, rows }: Props) {
  const [expanded, setExpanded] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [settings, setSettings] = useState<TPublicSettings | null>(null)

  useEffect(() => {
    if (rows && rows.length > 0) return

    const loadPricingTable = async () => {
      try {
        setLoading(true)

        const baseUrl = process.env.NEXT_PUBLIC_API_URL
        const res = await fetch(`${baseUrl}/settings/public`, {
          cache: "no-store",
        })

        const result = await res.json()

        if (result?.success) {
          setSettings(result.data)
        }
      } catch (error) {
        console.error("Pricing table load failed:", error)
      } finally {
        setLoading(false)
      }
    }

    loadPricingTable()
  }, [rows])

  const pricingRows = useMemo(() => {
    const sourceRows =
      rows && rows.length > 0 ? rows : settings?.pricingTableRows ?? []

    return [...sourceRows].sort((a, b) => {
      if (a.available === b.available) return a.order - b.order
      return a.available ? -1 : 1
    })
  }, [rows, settings])

  const tableTitle = title || settings?.pricingTableTitle || DEFAULT_TITLE
  const enabled = settings?.pricingTableEnabled ?? true

  if (loading) {
    return (
      <div className="w-full rounded-2xl border bg-card p-6 text-foreground shadow-sm">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 size={18} className="animate-spin" />
          মূল্য তালিকা লোড হচ্ছে...
        </div>
      </div>
    )
  }

  if (!enabled) {
    return (
      <div className="w-full rounded-2xl border bg-card p-6 text-sm text-muted-foreground shadow-sm">
        মূল্য তালিকা বর্তমানে বন্ধ আছে।
      </div>
    )
  }

  if (pricingRows.length === 0) {
    return (
      <div className="w-full rounded-2xl border bg-card p-6 text-sm text-muted-foreground shadow-sm">
        কোনো মূল্য তালিকা পাওয়া যায়নি।
      </div>
    )
  }

  return (
    <div className="w-full space-y-6 pb-8 font-['Hind_Siliguri',_sans-serif]">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/60 shadow-sm">
          <Sparkles size={20} className="text-primary-foreground" />
        </div>

        <div>
          <h2 className="text-lg font-bold tracking-tight text-foreground">
            {tableTitle}
          </h2>
          <p className="text-xs text-muted-foreground">
            আমাদের সকল সেবার মূল্য তালিকা নিচে টেবিলে দেওয়া হলো
          </p>
        </div>
      </div>

      <div className="hidden overflow-hidden rounded-2xl border bg-card shadow-sm md:block">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-muted/40">
              <tr className="border-b">
                <th className="w-12 px-4 py-3 text-center font-semibold text-muted-foreground">
                  #
                </th>
                <th className="min-w-[220px] px-4 py-3 text-left font-semibold text-muted-foreground">
                  সেবার নাম ও বিবরণ
                </th>
                <th className="min-w-[180px] px-4 py-3 text-left font-semibold text-muted-foreground">
                  আপনি দেবেন
                </th>
                <th className="min-w-[180px] px-4 py-3 text-left font-semibold text-muted-foreground">
                  আপনি পাবেন
                </th>
                <th className="min-w-[120px] px-4 py-3 text-right font-semibold text-muted-foreground">
                  মূল্য
                </th>
                <th className="min-w-[110px] px-4 py-3 text-center font-semibold text-muted-foreground">
                  অবস্থা
                </th>
              </tr>
            </thead>

            <tbody>
              {pricingRows.map((row, index) => (
                <tr
                  key={row._id ?? `${row.service}-${index}`}
                  className={cn(
                    "border-b transition-colors last:border-b-0 hover:bg-muted/30",
                    !row.available && "opacity-60 grayscale-[0.3]"
                  )}
                >
                  <td className="px-4 py-4 text-center font-bold text-muted-foreground">
                    {index + 1}
                  </td>

                  <td className="px-4 py-4">
                    <div className="font-bold text-foreground">{row.service}</div>
                    {row.description && (
                      <div className="mt-1 text-xs leading-relaxed text-muted-foreground">
                        {row.description}
                      </div>
                    )}
                  </td>

                  <td className="px-4 py-4">
                    {row.userProvides ? (
                      <div className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
                        <User2 size={12} className="opacity-70" />
                        {row.userProvides}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </td>

                  <td className="px-4 py-4">
                    {row.deliverable ? (
                      <div className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
                        <PackageCheck size={12} className="opacity-70" />
                        {row.deliverable}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </td>

                  <td className="px-4 py-4 text-right">
                    <div className="flex flex-col items-end">
                      <span className="bg-gradient-to-br from-primary to-primary/60 bg-clip-text text-xl font-extrabold text-transparent">
                        ৳{row.price}
                      </span>
                      <span className="text-[10px] font-semibold uppercase text-muted-foreground">
                        {row.unit}
                      </span>
                    </div>
                  </td>

                  <td className="px-4 py-4 text-center">
                    <Badge
                      variant={row.available ? "default" : "destructive"}
                      className={cn(
                        "pointer-events-none rounded-full px-3",
                        row.available
                          ? "bg-emerald-500/15 text-emerald-600 hover:bg-emerald-500/15"
                          : "bg-red-500/10 text-red-500 hover:bg-red-500/10"
                      )}
                    >
                      {row.available ? (
                        <CheckCircle2 size={12} className="mr-1" />
                      ) : (
                        <XCircle size={12} className="mr-1" />
                      )}
                      {row.available ? "চালু" : "বন্ধ"}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex flex-col gap-4 md:hidden">
        {pricingRows.map((row, index) => (
          <Card
            key={row._id ?? `${row.service}-${index}`}
            className={cn(
              "overflow-hidden transition-all active:scale-[0.98]",
              !row.available && "opacity-70"
            )}
          >
            <CardHeader
              className="cursor-pointer p-4"
              onClick={() => setExpanded(expanded === index ? null : index)}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="font-bold text-foreground">{row.service}</h3>
                  {row.description && (
                    <p className="text-xs text-muted-foreground">
                      {row.description}
                    </p>
                  )}
                </div>

                <div className="flex shrink-0 flex-col items-end gap-1">
                  <span className="bg-gradient-to-br from-primary to-primary/60 bg-clip-text text-xl font-extrabold text-transparent">
                    ৳{row.price}
                  </span>
                  <Badge
                    variant="outline"
                    className={cn(
                      "h-5 px-2 text-[10px]",
                      row.available
                        ? "border-emerald-200 text-emerald-600"
                        : "border-red-200 text-red-500"
                    )}
                  >
                    {row.available ? "চালু" : "বন্ধ"}
                  </Badge>
                </div>
              </div>

              <div className="mt-2 flex justify-center text-muted-foreground">
                {expanded === index ? (
                  <ChevronUp size={18} />
                ) : (
                  <ChevronDown size={18} />
                )}
              </div>
            </CardHeader>

            {expanded === index && (
              <CardContent className="space-y-4 border-t bg-muted/20 p-4">
                <div className="grid gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      <User2 size={12} />
                      আপনি দেবেন
                    </div>
                    <p className="text-sm">{row.userProvides || "-"}</p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      <PackageCheck size={12} />
                      আপনি পাবেন
                    </div>
                    <p className="text-sm">{row.deliverable || "-"}</p>
                  </div>
                </div>
              </CardContent>
            )}

            <CardFooter className="flex items-center justify-between border-t bg-muted/40 p-3">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Banknote size={14} />
                <span>
                  মূল্য:{" "}
                  <span className="font-bold text-foreground">
                    ৳{row.price} {row.unit}
                  </span>
                </span>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
