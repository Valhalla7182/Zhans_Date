export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID } = process.env;
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    return res.status(500).json({ error: "Notifications are not configured" });
  }

  const { dateLabel, time, restaurant, source, customImage } = req.body || {};
  if (![dateLabel, time, restaurant].every(v => typeof v === "string" && v.length > 0)) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const text = [
    "💌 Жансая выбрала свидание!",
    "",
    `📅 День: ${dateLabel}`,
    `🕖 Время: ${time}`,
    `🍽️ Ресторан: ${restaurant}`,
    ...(typeof customImage === "string" && /^https?:\/\//i.test(customImage) ? [`🖼️ Фото: ${customImage}`] : []),
    "",
    `Источник: ${source || "Сайт-приглашение"}`
  ].join("\n");

  try {
    const tg = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text })
    });
    const data = await tg.json();
    if (!tg.ok || !data.ok) {
      return res.status(502).json({ error: "Telegram notification failed" });
    }
    return res.status(200).json({ ok: true });
  } catch {
    return res.status(502).json({ error: "Could not reach Telegram" });
  }
}
