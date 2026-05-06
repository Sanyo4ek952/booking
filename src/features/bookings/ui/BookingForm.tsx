import { Save } from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";
import { rooms } from "@/entities/room";
import { Button } from "@/shared/ui/Button";
import { Card } from "@/shared/ui/Card";
import { Field, FieldError, Input, Label, NativeSelect, Textarea } from "@/shared/ui/Form";
import { todayInputValue } from "@/shared/lib/date";
import { bookingOverlaps, isCheckoutAfterCheckin } from "../model/validation";
import { bookingStatuses } from "../model/status";
import type { Booking, BookingFormValues } from "../model/types";

type BookingFormProps = {
  bookings: Booking[];
  editingBooking?: Booking | null;
  isSubmitting?: boolean;
  onSubmit: (values: BookingFormValues) => void;
  onCancelEdit?: () => void;
};

const defaultValues: BookingFormValues = {
  room_id: "room-1",
  guest_name: "",
  phone: "",
  check_in: todayInputValue(),
  check_out: "",
  amount: "",
  status: "reserved",
  comment: "",
};

export function BookingForm({ bookings, editingBooking, isSubmitting, onSubmit, onCancelEdit }: BookingFormProps) {
  const initialValues = useMemo<BookingFormValues>(() => {
    if (!editingBooking) {
      return defaultValues;
    }

    return {
      room_id: editingBooking.room_id,
      guest_name: editingBooking.guest_name,
      phone: editingBooking.phone,
      check_in: editingBooking.check_in,
      check_out: editingBooking.check_out,
      amount: String(editingBooking.amount),
      status: editingBooking.status,
      comment: editingBooking.comment ?? "",
    };
  }, [editingBooking]);

  const [values, setValues] = useState<BookingFormValues>(initialValues);
  const [error, setError] = useState("");

  const updateField = <Key extends keyof BookingFormValues>(key: Key, value: BookingFormValues[Key]) => {
    setValues((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setError("");

    if (!values.guest_name.trim() || !values.phone.trim() || !values.check_in || !values.check_out) {
      setError("Заполните гостя, телефон, дату заезда и дату выезда.");
      return;
    }

    if (!isCheckoutAfterCheckin(values.check_in, values.check_out)) {
      setError("Дата выезда должна быть позже даты заезда.");
      return;
    }

    if (Number.isNaN(Number(values.amount)) || Number(values.amount) < 0) {
      setError("Укажите корректную сумму брони.");
      return;
    }

    if (
      bookingOverlaps(
        { room_id: values.room_id, check_in: values.check_in, check_out: values.check_out },
        bookings,
        editingBooking?.id,
      )
    ) {
      setError("Эти даты пересекаются с другой бронью выбранного объекта.");
      return;
    }

    onSubmit(values);
  };

  return (
    <Card className="p-5 sm:p-6">
      <div className="mb-5">
        <h2 className="text-xl font-semibold text-graphite-900">
          {editingBooking ? "Редактировать бронь" : "Новая бронь"}
        </h2>
        <p className="mt-1 text-sm text-graphite-500">Проверка пересечений выполняется перед сохранением.</p>
      </div>

      <form className="grid gap-4" onSubmit={handleSubmit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field>
            <Label htmlFor="room_id">Объект</Label>
            <NativeSelect
              id="room_id"
              value={values.room_id}
              onChange={(event) => updateField("room_id", event.target.value as BookingFormValues["room_id"])}
            >
              {rooms.map((room) => (
                <option key={room.id} value={room.id}>
                  {room.name}
                </option>
              ))}
            </NativeSelect>
          </Field>
          <Field>
            <Label htmlFor="status">Статус</Label>
            <NativeSelect
              id="status"
              value={values.status}
              onChange={(event) => updateField("status", event.target.value as BookingFormValues["status"])}
            >
              {bookingStatuses.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </NativeSelect>
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field>
            <Label htmlFor="check_in">Дата заезда</Label>
            <Input id="check_in" type="date" value={values.check_in} onChange={(event) => updateField("check_in", event.target.value)} />
          </Field>
          <Field>
            <Label htmlFor="check_out">Дата выезда</Label>
            <Input id="check_out" type="date" value={values.check_out} onChange={(event) => updateField("check_out", event.target.value)} />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field>
            <Label htmlFor="guest_name">Имя гостя</Label>
            <Input id="guest_name" value={values.guest_name} onChange={(event) => updateField("guest_name", event.target.value)} placeholder="Иван Петров" />
          </Field>
          <Field>
            <Label htmlFor="phone">Телефон</Label>
            <Input id="phone" value={values.phone} onChange={(event) => updateField("phone", event.target.value)} placeholder="+7 900 000-00-00" />
          </Field>
        </div>

        <Field>
          <Label htmlFor="amount">Сумма брони</Label>
          <Input id="amount" type="number" min="0" step="100" value={values.amount} onChange={(event) => updateField("amount", event.target.value)} placeholder="35000" />
        </Field>

        <Field>
          <Label htmlFor="comment">Комментарий</Label>
          <Textarea id="comment" value={values.comment} onChange={(event) => updateField("comment", event.target.value)} placeholder="Детали заезда, пожелания гостя" />
        </Field>

        <FieldError>{error}</FieldError>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button type="submit" disabled={isSubmitting}>
            <Save className="h-4 w-4" />
            {isSubmitting ? "Сохранение..." : editingBooking ? "Сохранить изменения" : "Добавить бронь"}
          </Button>
          {editingBooking && (
            <Button type="button" variant="secondary" onClick={onCancelEdit}>
              Отменить
            </Button>
          )}
        </div>
      </form>
    </Card>
  );
}
