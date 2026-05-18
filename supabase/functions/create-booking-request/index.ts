import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.8";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
} as const;

const FUNCTION_VERSION = "create-booking-request-diagnostics-2026-05-18-2";
const allowedRoomIds = new Set(["room-1", "room-2", "room-3", "room-4"]);
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const MAX_IP_LENGTH = 128;
const MAX_USER_AGENT_LENGTH = 512;

type CreateBookingRequestBody = {
  room_id?: string;
  room_name?: string;
  guests?: number;
  guest_name?: string;
  phone?: string;
  check_in?: string;
  check_out?: string;
  nights?: number;
  amount?: number | null;
  nightly_price?: number | null;
  comment?: string;
  source?: string;
};

type BookingRequestInsert = {
  room_id: string;
  room_name: string;
  guests: number;
  guest_name: string;
  phone: string;
  check_in: string;
  check_out: string;
  nights: number;
  amount: number | null;
  nightly_price: number | null;
  comment: string | null;
  source: string;
  client_ip: string | null;
  user_agent: string | null;
};

function jsonResponse(status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "X-Function-Version": FUNCTION_VERSION,
    },
  });
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === "string" && error) return error;

  if (typeof error === "object" && error !== null) {
    const record = error as Record<string, unknown>;
    const details = record.details;
    const hint = record.hint;
    const code = record.code;
    const name = record.name;
    const status = record.status;
    const statusText = record.statusText;
    const stack = record.stack;

    if (typeof details === "string" && details) return details;
    if (typeof hint === "string" && hint) return hint;
    if (typeof code === "string" && code) return code;
    if (typeof name === "string" && name) return name;
    if (typeof statusText === "string" && statusText) return statusText;
    if (typeof status === "number") return `HTTP status ${status}`;
    if (typeof stack === "string" && stack) return stack;
  }

  try {
    const serialized = JSON.stringify(error);
    if (serialized && serialized !== "{}" && serialized !== "{\"message\":\"\"}") {
      return serialized;
    }
  } catch {
    // Fall through to the stable fallback below.
  }

  return "Unknown error";
}

function getErrorDebug(error: unknown): Record<string, unknown> {
  const debug: Record<string, unknown> = {
    type: typeof error,
  };

  if (error instanceof Error) {
    debug.name = error.name;
    debug.message = error.message;
    debug.stack = error.stack;

    if (error.cause !== undefined) {
      debug.cause = getErrorMessage(error.cause);
    }
  }

  if (typeof error === "object" && error !== null) {
    const record = error as Record<string, unknown>;
    debug.constructorName = error.constructor?.name;
    debug.keys = Object.keys(record);
    debug.name = debug.name ?? record.name;
    debug.message = debug.message ?? record.message;
    debug.code = record.code;
    debug.details = record.details;
    debug.hint = record.hint;
    debug.status = record.status;
    debug.statusText = record.statusText;

    try {
      debug.serialized = JSON.stringify(error);
    } catch {
      debug.serialized = "Could not serialize error";
    }
  }

  return debug;
}

function isIsoDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`));
}

function parseAmount(value: number | null | undefined) {
  if (value === null || value === undefined) {
    return null;
  }

  return Number.isFinite(value) ? value : Number.NaN;
}

function normalizeHeaderValue(value: string | null, maxLength: number) {
  const normalized = value?.trim();
  if (!normalized) {
    return null;
  }

  return normalized.slice(0, maxLength);
}

function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const firstForwardedIp = forwardedFor.split(",")[0];
    return normalizeHeaderValue(firstForwardedIp, MAX_IP_LENGTH);
  }

  return (
    normalizeHeaderValue(request.headers.get("x-real-ip"), MAX_IP_LENGTH) ??
    normalizeHeaderValue(request.headers.get("cf-connecting-ip"), MAX_IP_LENGTH) ??
    normalizeHeaderValue(request.headers.get("fly-client-ip"), MAX_IP_LENGTH)
  );
}

async function checkRateLimit(
  supabase: ReturnType<typeof createClient>,
  clientIp: string | null,
) {
  if (!clientIp) {
    return { allowed: true as const };
  }

  const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW_MS).toISOString();
  const { count, error } = await supabase
    .from("booking_requests")
    .select("*", { count: "exact", head: true })
    .eq("client_ip", clientIp)
    .gte("created_at", windowStart);

  if (error) {
    console.error("create-booking-request rate limit error:", {
      message: getErrorMessage(error),
      debug: getErrorDebug(error),
    });

    return { allowed: true as const };
  }

  if ((count ?? 0) >= RATE_LIMIT_MAX_REQUESTS) {
    return {
      allowed: false as const,
      status: 429,
      error: "Слишком много заявок за короткое время. Попробуйте снова через 15 минут.",
    };
  }

  return { allowed: true as const };
}

function validatePayload(
  payload: CreateBookingRequestBody,
  request: Request,
): { data?: BookingRequestInsert; error?: string } {
  const roomId = payload.room_id?.trim();
  const roomName = payload.room_name?.trim();
  const guestName = payload.guest_name?.trim();
  const phone = payload.phone?.trim();
  const checkIn = payload.check_in?.trim();
  const checkOut = payload.check_out?.trim();
  const comment = payload.comment?.trim() ?? "";
  const source = payload.source?.trim() || "website";
  const guests = Number(payload.guests);
  const nights = Number(payload.nights);
  const amount = parseAmount(payload.amount);
  const nightlyPrice = parseAmount(payload.nightly_price);
  const clientIp = getClientIp(request);
  const userAgent = normalizeHeaderValue(request.headers.get("user-agent"), MAX_USER_AGENT_LENGTH);

  if (!roomId || !allowedRoomIds.has(roomId)) {
    return { error: "Некорректный объект." };
  }

  if (!roomName) {
    return { error: "Не указано название объекта." };
  }

  if (!guestName || guestName.length < 2) {
    return { error: "Укажите имя гостя." };
  }

  if (!phone || phone.length < 6) {
    return { error: "Укажите телефон для связи." };
  }

  if (!checkIn || !checkOut || !isIsoDate(checkIn) || !isIsoDate(checkOut)) {
    return { error: "Укажите корректные даты проживания." };
  }

  if (new Date(`${checkOut}T00:00:00Z`).getTime() <= new Date(`${checkIn}T00:00:00Z`).getTime()) {
    return { error: "Дата выезда должна быть позже даты заезда." };
  }

  if (!Number.isInteger(guests) || guests <= 0) {
    return { error: "Укажите количество гостей." };
  }

  if (!Number.isInteger(nights) || nights <= 0) {
    return { error: "Некорректная длительность проживания." };
  }

  if (Number.isNaN(amount) || Number.isNaN(nightlyPrice)) {
    return { error: "Некорректная стоимость проживания." };
  }

  return {
    data: {
      room_id: roomId,
      room_name: roomName,
      guests,
      guest_name: guestName,
      phone,
      check_in: checkIn,
      check_out: checkOut,
      nights,
      amount,
      nightly_price: nightlyPrice,
      comment: comment || null,
      source,
      client_ip: clientIp,
      user_agent: userAgent,
    },
  };
}

function formatTelegramMessage(requestId: string, payload: BookingRequestInsert) {
  const lines = [
    "Новая заявка на бронирование",
    "",
    `ID: ${requestId}`,
    `Объект: ${payload.room_name} (${payload.room_id})`,
    `Даты: ${payload.check_in} - ${payload.check_out}`,
    `Ночей: ${payload.nights}`,
    `Гости: ${payload.guests}`,
    `Имя: ${payload.guest_name}`,
    `Телефон: ${payload.phone}`,
  ];

  if (payload.nightly_price !== null) {
    lines.push(`Цена за ночь: ${payload.nightly_price} RUB`);
  }

  if (payload.amount !== null) {
    lines.push(`Стоимость: ${payload.amount} RUB`);
  }

  if (payload.comment) {
    lines.push(`Комментарий: ${payload.comment}`);
  }

  lines.push(`Источник: ${payload.source}`);

  return lines.join("\n");
}

async function sendTelegramMessage(botToken: string, chatId: string, text: string) {
  const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id: chatId,
      text,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    return {
      ok: false as const,
      error: `Telegram API error: ${response.status} ${errorText}`,
    };
  }

  return { ok: true as const };
}

Deno.serve(async (request) => {
  let stage = "start";

  try {
    stage = "method";
    if (request.method === "OPTIONS") {
      return new Response(JSON.stringify({ success: true }), {
        headers: {
          ...corsHeaders,
          "X-Function-Version": FUNCTION_VERSION,
        },
      });
    }

    if (request.method !== "POST") {
      return jsonResponse(405, { success: false, error: "Method not allowed." });
    }

    stage = "env";
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const telegramBotToken = Deno.env.get("TELEGRAM_BOT_TOKEN");
    const telegramChatId = Deno.env.get("TELEGRAM_CHAT_ID");

    if (!supabaseUrl) {
      return jsonResponse(500, { success: false, error: "Missing SUPABASE_URL" });
    }

    if (!serviceRoleKey) {
      return jsonResponse(500, { success: false, error: "Missing SUPABASE_SERVICE_ROLE_KEY" });
    }

    if (!telegramBotToken) {
      return jsonResponse(500, { success: false, error: "Missing TELEGRAM_BOT_TOKEN" });
    }

    if (!telegramChatId) {
      return jsonResponse(500, { success: false, error: "Missing TELEGRAM_CHAT_ID" });
    }

    let body: CreateBookingRequestBody;

    stage = "parse-body";
    try {
      body = await request.json();
    } catch (error) {
      return jsonResponse(400, {
        success: false,
        error: getErrorMessage(error) || "Invalid JSON body.",
        stage,
      });
    }

    stage = "validate";
    const validation = validatePayload(body, request);
    if (!validation.data) {
      return jsonResponse(400, { success: false, error: validation.error ?? "Validation failed.", stage });
    }

    stage = "create-client";
    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    stage = "rate-limit";
    const rateLimit = await checkRateLimit(supabase, validation.data.client_ip);
    if (!rateLimit.allowed) {
      return jsonResponse(rateLimit.status, {
        success: false,
        error: rateLimit.error,
        stage,
      });
    }

    stage = "insert-booking-request";
    const { data: insertedRequest, error: insertError } = await supabase
      .from("booking_requests")
      .insert(validation.data)
      .select("id")
      .single();

    if (insertError) {
      return jsonResponse(500, {
        success: false,
        error: "Failed to create booking request",
        details: getErrorMessage(insertError),
        debug: getErrorDebug(insertError),
        stage,
      });
    }

    if (!insertedRequest) {
      return jsonResponse(500, {
        success: false,
        error: "Failed to create booking request",
        details: "Insert succeeded but no booking id was returned",
        stage,
      });
    }

    let telegramSent = false;
    let telegramError: string | null = null;

    stage = "send-telegram";
    try {
      const message = formatTelegramMessage(insertedRequest.id, validation.data);
      const telegramResult = await sendTelegramMessage(telegramBotToken, telegramChatId, message);

      if (telegramResult.ok) {
        telegramSent = true;
      } else {
        telegramError = telegramResult.error;
      }
    } catch (error) {
      telegramError = getErrorMessage(error);
    }

    stage = "update-telegram-status";
    const { error: updateError } = await supabase
      .from("booking_requests")
      .update({
        telegram_sent: telegramSent,
        telegram_error: telegramError,
      })
      .eq("id", insertedRequest.id);

    if (updateError) {
      return jsonResponse(500, {
        success: false,
        error: "Booking request was created, but status update failed.",
        details: getErrorMessage(updateError),
        debug: getErrorDebug(updateError),
        stage,
        request_id: insertedRequest.id,
      });
    }

    if (!telegramSent) {
      return jsonResponse(200, {
        success: true,
        warning: "Booking created, but Telegram notification failed",
        bookingId: insertedRequest.id,
        function_version: FUNCTION_VERSION,
      });
    }

    return jsonResponse(200, {
      success: true,
      bookingId: insertedRequest.id,
      request_id: insertedRequest.id,
      telegram_sent: telegramSent,
      warning: null,
      function_version: FUNCTION_VERSION,
    });
  } catch (error) {
    const message = getErrorMessage(error);
    const debug = getErrorDebug(error);
    console.error("create-booking-request error:", {
      message,
      stage,
      debug,
      rawError: error,
    });

    return jsonResponse(500, {
      success: false,
      error: message,
      debug,
      function_version: FUNCTION_VERSION,
      stage,
    });
  }
});
