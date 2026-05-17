import { useMemo, useState } from "react";
import { Link } from "react-router";
import {
  ArrowUpRight,
  BadgeCheck,
  CalendarDays,
  CircleHelp,
  Copy,
  ExternalLink,
  Eye,
  Globe2,
  Image as ImageIcon,
  List,
  Settings2,
  Sparkles,
  Tag,
} from "lucide-react";
import { Button } from "@/shared/ui/Button";
import { Card } from "@/shared/ui/Card";
import { useToast } from "@/shared/ui/useToast";

type VisibilityKey = "rooms" | "gallery" | "details" | "price" | "booking";

const visibilityLabels: Array<{ key: VisibilityKey; label: string; icon: typeof Globe2 }> = [
  { key: "rooms", label: "Список номеров", icon: List },
  { key: "gallery", label: "Галерея фотографий", icon: ImageIcon },
  { key: "details", label: "Удобства и описание", icon: Sparkles },
  { key: "price", label: "Цена за ночь", icon: Tag },
  { key: "booking", label: "Кнопка забронировать", icon: CalendarDays },
];

const sourceSections = [
  { label: "Номера", details: "фото, описание, вместимость", href: "/rooms" },
  { label: "Цены", details: "стоимость и тарифы", href: "/rooms#prices" },
  { label: "Бронирования", details: "доступность номеров", href: "/admin" },
];

const workflowCards = [
  { title: "Вы управляете контентом внутри админки", text: "Номера, цены и бронирования остаются в рабочих разделах." },
  { title: "Данные собираются в публичную страницу", text: "Гость видит только витрину с доступными номерами." },
  { title: "Клиент открывает ссылку и выбирает номер", text: "Без доступа к админским инструментам и внутренним данным." },
  { title: "Бронь попадает в админку", text: "Вся дальнейшая работа продолжается в вашем рабочем контуре." },
];

function VisibilityToggle({
  checked,
  onClick,
}: {
  checked: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition ${
        checked ? "bg-sage-700" : "bg-sand-200"
      }`}
      aria-pressed={checked}
    >
      <span
        className={`absolute h-5 w-5 rounded-full bg-white shadow-sm transition ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

export function PublicPage() {
  const { toast } = useToast();
  const [isPublished, setIsPublished] = useState(true);
  const [visibility, setVisibility] = useState<Record<VisibilityKey, boolean>>({
    rooms: true,
    gallery: true,
    details: true,
    price: true,
    booking: true,
  });

  const publicUrl = useMemo(() => {
    if (typeof window === "undefined") {
      return "/rooms";
    }

    return `${window.location.origin}/rooms`;
  }, []);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      toast({ title: "Ссылка скопирована", description: "Публичную страницу можно отправлять гостю." });
    } catch {
      toast({ title: "Не удалось скопировать", description: "Скопируйте ссылку вручную из поля.", variant: "error" });
    }
  };

  return (
    <div className="grid gap-8">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-sage-700">Публичная страница</p>
          <h1 className="mt-2 text-3xl font-semibold text-graphite-900 sm:text-5xl">Развести админку и ссылку для гостя</h1>
          <p className="mt-3 max-w-3xl text-base leading-7 text-graphite-500">
            Здесь вы отдаёте клиенту только публичную витрину с номерами. Календарь, цены и доступность берутся из админских разделов и автоматически собираются в одну ссылку.
          </p>
        </div>

        <Button asChild variant="secondary">
          <Link to="/rooms">
            <Eye className="h-4 w-4" />
            Открыть preview
          </Link>
        </Button>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_360px]">
        <div className="grid gap-6">
          <Card className="p-5 sm:p-6">
            <div className="flex flex-col gap-5">
              <div>
                <h2 className="text-xl font-semibold text-graphite-900">Публичная ссылка</h2>
                <p className="mt-1 text-sm text-graphite-500">Эта ссылка ведёт на страницу с номерами для гостей.</p>
              </div>

              <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto_auto]">
                <div className="flex min-h-12 items-center gap-3 rounded-2xl border border-sand-200 bg-sand-50 px-4 text-sm text-graphite-900">
                  <Globe2 className="h-4 w-4 text-sage-700" />
                  <span className="truncate">{publicUrl}</span>
                </div>
                <Button type="button" variant="secondary" onClick={copyLink}>
                  <Copy className="h-4 w-4" />
                  Скопировать
                </Button>
                <Button asChild>
                  <Link to="/rooms">
                    Открыть
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>

              <div className="rounded-2xl border border-sand-200 bg-sand-50/80 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 grid h-10 w-10 place-items-center rounded-2xl bg-white text-sage-700 shadow-sm">
                      <BadgeCheck className="h-5 w-5" />
                    </span>
                    <div>
                      <div className="font-semibold text-graphite-900">Опубликовано</div>
                      <div className="text-sm text-graphite-500">Страница доступна для гостей по этой ссылке.</div>
                    </div>
                  </div>
                  <VisibilityToggle checked={isPublished} onClick={() => setIsPublished((value) => !value)} />
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-5 sm:p-6">
            <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
              <div>
                <h2 className="text-xl font-semibold text-graphite-900">Источник данных</h2>
                <p className="mt-1 text-sm text-graphite-500">Контент на публичной странице берётся из внутренних разделов.</p>

                <div className="mt-4 grid gap-3">
                  {sourceSections.map((section) => (
                    <div key={section.label} className="flex items-center justify-between gap-3 rounded-2xl border border-sand-200 bg-sand-50/70 px-4 py-3">
                      <div>
                        <div className="font-medium text-graphite-900">{section.label}</div>
                        <div className="text-sm text-graphite-500">{section.details}</div>
                      </div>
                      <Button asChild variant="ghost" size="sm">
                        <Link to={section.href}>
                          Открыть
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="mt-4 rounded-2xl border border-dashed border-sand-200 bg-white/70 p-4 text-sm leading-6 text-graphite-500">
                  Данные не редактируются здесь. Изменения в номерах, тарифах и бронированиях автоматически попадают в публичную страницу.
                </div>
              </div>

              <div className="rounded-[28px] border border-amber-100 bg-[linear-gradient(180deg,rgba(255,252,245,0.95),rgba(250,244,230,0.98))] p-5">
                <div className="flex items-center gap-3 text-amber-700">
                  <CircleHelp className="h-5 w-5" />
                  <h3 className="text-lg font-semibold">Что увидит гость</h3>
                </div>

                <div className="mt-5 grid gap-4">
                  {visibilityLabels.map(({ key, label, icon: Icon }) => (
                    <div key={key} className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 text-sm text-graphite-700">
                        <Icon className="h-4 w-4 text-graphite-500" />
                        <span>{label}</span>
                      </div>
                      <VisibilityToggle
                        checked={visibility[key]}
                        onClick={() =>
                          setVisibility((current) => ({
                            ...current,
                            [key]: !current[key],
                          }))
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-sand-50 text-sage-700">
                <Settings2 className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-xl font-semibold text-graphite-900">Как это работает</h2>
                <p className="text-sm text-graphite-500">Без дублирования контента и ручной пересборки страницы.</p>
              </div>
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-4">
              {workflowCards.map((card) => (
                <div key={card.title} className="rounded-2xl border border-sand-200 bg-sand-50/70 p-4">
                  <div className="text-base font-semibold text-graphite-900">{card.title}</div>
                  <p className="mt-2 text-sm leading-6 text-graphite-500">{card.text}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Card className="h-fit p-5 sm:p-6">
          <div className="flex items-center gap-3 text-amber-700">
            <Sparkles className="h-5 w-5" />
            <h2 className="text-lg font-semibold">Важно знать</h2>
          </div>

          <div className="mt-4 grid gap-3 text-sm leading-6 text-graphite-600">
            <p>Меняется только ссылка и видимость блоков. Внутренний контент не дублируется.</p>
            <p>Все операции с ценами, номерами и бронированиями по-прежнему выполняются в соответствующих админских разделах.</p>
            <p>Гостю отдаётся только публичная страница `/rooms`, поэтому можно безопасно отправлять её клиенту как отдельную витрину.</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
