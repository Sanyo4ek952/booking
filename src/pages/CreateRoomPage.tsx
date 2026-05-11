import { ArrowLeft, ImagePlus, Loader2, Plus, Save, X } from "lucide-react";
import { type ChangeEvent, type FormEvent, useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { amenityCategories } from "@/entities/room";
import { createRoom } from "@/shared/api/rooms";
import { Button } from "@/shared/ui/Button";
import { Card } from "@/shared/ui/Card";
import { Field, FieldError, Input, Label, Textarea } from "@/shared/ui/Form";
import { useToast } from "@/shared/ui/useToast";

const initialValues = {
  name: "",
  shortName: "",
  description: "",
  fullDescription: "",
  capacity: "2",
};

export function CreateRoomPage() {
  const { toast } = useToast();
  const [values, setValues] = useState(initialValues);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [photos, setPhotos] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const photoPreviews = useMemo(
    () =>
      photos.map((photo) => ({
        name: photo.name,
        url: URL.createObjectURL(photo),
      })),
    [photos],
  );

  useEffect(() => {
    return () => {
      photoPreviews.forEach((photo) => URL.revokeObjectURL(photo.url));
    };
  }, [photoPreviews]);

  const updateField = (field: keyof typeof values, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "" }));
  };

  const handlePhotosChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedPhotos = Array.from(event.target.files ?? []);
    setPhotos((current) => [...current, ...selectedPhotos]);
    setErrors((current) => ({ ...current, photos: "" }));
    event.target.value = "";
  };

  const removePhoto = (index: number) => {
    setPhotos((current) => current.filter((_, photoIndex) => photoIndex !== index));
  };

  const toggleAmenity = (amenityId: string) => {
    setSelectedAmenities((current) =>
      current.includes(amenityId) ? current.filter((id) => id !== amenityId) : [...current, amenityId],
    );
    setErrors((current) => ({ ...current, amenities: "" }));
  };

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    const capacity = Number(values.capacity);

    if (!values.name.trim()) nextErrors.name = "Укажите название номера.";
    if (!values.shortName.trim()) nextErrors.shortName = "Укажите короткое название.";
    if (!values.description.trim()) nextErrors.description = "Добавьте краткое описание.";
    if (!values.fullDescription.trim()) nextErrors.fullDescription = "Добавьте подробное описание.";
    if (!Number.isFinite(capacity) || capacity < 1) nextErrors.capacity = "Укажите вместимость от 1 гостя.";
    if (selectedAmenities.length === 0) nextErrors.amenities = "Выберите хотя бы одно удобство.";
    if (photos.length === 0) nextErrors.photos = "Добавьте хотя бы одно фото.";

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await createRoom({
        name: values.name,
        shortName: values.shortName,
        description: values.description,
        fullDescription: values.fullDescription,
        capacity: Number(values.capacity),
        amenities: selectedAmenities,
        photos,
      });

      setValues(initialValues);
      setSelectedAmenities([]);
      setPhotos([]);
      toast({ title: "Объект создан", description: "Новый номер отправлен на сервер." });
    } catch (error) {
      toast({
        title: "Ошибка создания",
        description: error instanceof Error ? error.message : "Сервер вернул ошибку.",
        variant: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid gap-6">
      <Button asChild variant="ghost" className="w-fit px-0 hover:bg-transparent">
        <Link to="/admin">
          <ArrowLeft className="h-4 w-4" />
          В админку
        </Link>
      </Button>

      <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-sage-700">Новый объект</p>
          <h1 className="mt-2 text-3xl font-semibold text-graphite-900 sm:text-5xl">Создание номера</h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-graphite-500">
            Заполните описание, параметры проживания и загрузите фотографии номера.
          </p>
        </div>
      </section>

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
        <Card className="grid gap-5 p-5 sm:p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field>
              <Label htmlFor="room-name">Название</Label>
              <Input id="room-name" value={values.name} onChange={(event) => updateField("name", event.target.value)} placeholder="Номер 5" />
              <FieldError>{errors.name}</FieldError>
            </Field>

            <Field>
              <Label htmlFor="room-short-name">Короткое название</Label>
              <Input id="room-short-name" value={values.shortName} onChange={(event) => updateField("shortName", event.target.value)} placeholder="5" />
              <FieldError>{errors.shortName}</FieldError>
            </Field>
          </div>

          <Field>
            <Label htmlFor="room-description">Краткое описание</Label>
            <Textarea id="room-description" value={values.description} onChange={(event) => updateField("description", event.target.value)} placeholder="Короткий текст для карточки номера" />
            <FieldError>{errors.description}</FieldError>
          </Field>

          <Field>
            <Label htmlFor="room-full-description">Подробная информация</Label>
            <Textarea id="room-full-description" className="min-h-36" value={values.fullDescription} onChange={(event) => updateField("fullDescription", event.target.value)} placeholder="Полное описание номера, особенностей и условий проживания" />
            <FieldError>{errors.fullDescription}</FieldError>
          </Field>

          <div className="grid gap-4 sm:grid-cols-[180px_minmax(0,1fr)]">
            <Field>
              <Label htmlFor="room-capacity">Гостей</Label>
              <Input id="room-capacity" type="number" min="1" value={values.capacity} onChange={(event) => updateField("capacity", event.target.value)} />
              <FieldError>{errors.capacity}</FieldError>
            </Field>
          </div>

          <section className="grid gap-4">
            <div>
              <h2 className="text-xl font-semibold text-graphite-900">Удобства</h2>
              <p className="mt-1 text-sm text-graphite-500">Отметьте все пункты, которые есть в номере.</p>
            </div>
            <FieldError>{errors.amenities}</FieldError>

            <div className="grid gap-5">
              {amenityCategories.map((category) => (
                <div key={category.id} className="grid gap-3 rounded-2xl border border-sand-200 bg-white/70 p-4">
                  <h3 className="text-base font-semibold text-graphite-900">{category.title}</h3>
                  <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                    {category.items.map((amenity) => {
                      const checked = selectedAmenities.includes(amenity.id);

                      return (
                        <label
                          key={amenity.id}
                          className="flex min-h-11 cursor-pointer items-center gap-3 rounded-xl border border-sand-200 bg-sand-50 px-3 py-2 text-sm font-medium text-graphite-700 transition hover:border-sage-600/40"
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleAmenity(amenity.id)}
                            className="h-4 w-4 shrink-0 accent-sage-700"
                          />
                          <span>{amenity.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </Card>

        <aside className="grid gap-4 lg:sticky lg:top-24">
          <Card className="grid gap-4 p-5 sm:p-6">
            <div>
              <h2 className="text-xl font-semibold text-graphite-900">Фото номера</h2>
              <p className="mt-1 text-sm text-graphite-500">Первое фото будет главным в карточке.</p>
            </div>

            <Field>
              <Label htmlFor="room-photos" className="flex min-h-32 cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-sand-200 bg-sand-50 px-4 py-6 text-center transition hover:border-sage-600/50">
                <ImagePlus className="h-6 w-6 text-sage-700" />
                <span>Выбрать фото</span>
              </Label>
              <Input id="room-photos" type="file" accept="image/*" multiple className="sr-only" onChange={handlePhotosChange} />
              <FieldError>{errors.photos}</FieldError>
            </Field>

            {photoPreviews.length > 0 && (
              <div className="grid grid-cols-2 gap-3">
                {photoPreviews.map((photo, index) => (
                  <div key={`${photo.name}-${index}`} className="relative overflow-hidden rounded-xl bg-sand-100">
                    <img src={photo.url} alt={photo.name} className="aspect-square w-full object-cover" />
                    <button type="button" className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-white text-graphite-900 shadow-sm" onClick={() => removePhoto(index)} aria-label="Удалить фото">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card className="grid gap-3 p-5">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Создать объект
            </Button>
            <Button type="button" variant="secondary" onClick={() => setPhotos([])} disabled={isSubmitting || photos.length === 0}>
              <Plus className="h-4 w-4" />
              Очистить фото
            </Button>
          </Card>
        </aside>
      </form>
    </div>
  );
}
