import { BookingCalendar, useBookings } from "@/features/bookings";
import { formatPrice, getDiscountedPrice, priceSections } from "@/features/bookings/model/prices";
import { ChevronDown } from "lucide-react";
import { EmptyState } from "@/shared/ui/EmptyState";
import { EnvNotice } from "@/shared/ui/EnvNotice";
import { Card } from "@/shared/ui/Card";
import { isSupabaseConfigured } from "@/shared/api/supabase";

export function PublicPage() {
  const { data: bookings = [], isLoading, isError, error } = useBookings();

  return (
    <div>
      {!isSupabaseConfigured ? (
        <EnvNotice />
      ) : isError ? (
        <EmptyState title="Не удалось загрузить брони" description={error instanceof Error ? error.message : "Проверьте настройки Supabase и RLS-политики."} />
      ) : (
        <div className="grid gap-4">
          <Card className="p-4 sm:p-5">
            <div>
              <h2 className="text-lg font-semibold text-graphite-900">Цены на номера</h2>
              <p className="text-sm text-graphite-500">Цена после скидки 20%, округленная вверх.</p>
            </div>

            <div className="mt-4 grid gap-5">
              {priceSections.map((section) => (
                <details key={section.title} className="group rounded-lg border border-sand-200 bg-sand-50/60">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-3 py-3 text-sm font-semibold text-graphite-900 marker:hidden">
                    <span>{section.title}</span>
                    <ChevronDown className="h-4 w-4 shrink-0 text-graphite-500 transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="grid gap-2 border-t border-sand-200 p-3 sm:grid-cols-2 lg:grid-cols-4">
                    {section.prices.map(({ period, price }) => {
                      const discountedPrice = getDiscountedPrice(price);

                      return (
                        <div key={`${section.title}-${period}`} className="rounded-lg border border-sand-200 bg-white/80 p-3">
                          <div className="text-xs font-medium uppercase text-graphite-500">{period}</div>
                          <div className="mt-1 text-xl font-semibold text-graphite-900">
                            {formatPrice(discountedPrice)} ₽
                          </div>
                          <div className="text-xs text-graphite-500">было {formatPrice(price)} ₽</div>
                        </div>
                      );
                    })}
                  </div>
                </details>
              ))}
            </div>
          </Card>

          <BookingCalendar bookings={bookings} isLoading={isLoading} />
        </div>
      )}
    </div>
  );
}
