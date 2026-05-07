import { BookingCalendar, useBookings } from "@/features/bookings";
import { EmptyState } from "@/shared/ui/EmptyState";
import { EnvNotice } from "@/shared/ui/EnvNotice";
import { Card } from "@/shared/ui/Card";
import { isSupabaseConfigured } from "@/shared/api/supabase";

const priceSections = [
  {
    title: "Номера 1 и 2",
    prices: [
  { period: "2 - 15 июня", price: 3750 },
  { period: "16 июня - 14 июля", price: 4375 },
  { period: "15 июля - 27 августа", price: 4750 },
  { period: "28 августа - 10 сентября", price: 3750 },
  { period: "11 сентября - 30 октября", price: 3000 },

    ],
  },
  {
    title: "Номер 3",
    prices: [
      { period: "май - 15 июня", price: 3125 },
      { period: "15 июня - 15 июля", price: 3750 },
      { period: "15 июля - 28 августа", price: 4125 },
      { period: "28 августа - 10 сентября", price: 3250 },
      { period: "10 сентября - конец октября", price: 2800 },
    ],
  },
  {
    title: "Номер 4",
    prices: [
      { period: "май - 14 июня", price: 4000 },
      { period: "15 июня - 10 июля", price: 5000 },
      { period: "10 июля - 28 августа", price: 5375 },
      { period: "28 августа - 15 сентября", price: 4500 },
      { period: "16 сентября - конец октября", price: 3800 },
    ],
  },
];

const formatPrice = new Intl.NumberFormat("ru-RU").format;

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
                <section key={section.title}>
                  <h3 className="text-sm font-semibold text-graphite-900">{section.title}</h3>
                  <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                    {section.prices.map(({ period, price }) => {
                      const discountedPrice = Math.ceil(price * 0.8);

                      return (
                        <div key={`${section.title}-${period}`} className="rounded-lg border border-sand-200 bg-sand-50/70 p-3">
                          <div className="text-xs font-medium uppercase text-graphite-500">{period}</div>
                          <div className="mt-1 text-xl font-semibold text-graphite-900">
                            {formatPrice(discountedPrice)} ₽
                          </div>
                          <div className="text-xs text-graphite-500">было {formatPrice(price)} ₽</div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>
          </Card>

          <BookingCalendar bookings={bookings} isLoading={isLoading} />
        </div>
      )}
    </div>
  );
}
