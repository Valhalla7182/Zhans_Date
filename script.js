const screen = document.getElementById("screen");
const stepCount = document.getElementById("stepCount");
let selected = { date: "", time: "", restaurant: "", customDate: "", customRestaurant: "", customImage: "" };
let noClicks = 0;

const restaurants = [
  { id: "standup", name: "Central Stand Up (если пн)", image: "assets/central-standup.png" },
  { id: "reneecafe", name: "Renée Café", image: "assets/renee-cafe.png" },
  { id: "AuroraCafeShop", name: "Aurora Café", image: "assets/aurora-cafe.png" }
];

function updateStep(n) { stepCount.textContent = `0${n} — 03`; }
function renderInvite() {
  updateStep(1);
  screen.innerHTML = `
    <p class="eyebrow">Жансая, это для тебя</p>
    <h1>Можно украсть<br>тебя на <em>свидание?</em></h1>
    <p class="intro">Хочу провести с тобой красивый вечер: вкусная еда и много поводов улыбаться.</p>
    <div class="button-area" id="buttonArea">
      <button class="btn btn-primary" id="yesBtn">Да, с удовольствием ♡</button>
      <button class="btn btn-quiet" id="noBtn" type="button">Нет 🙈</button>
    </div>
    <p class="microcopy">P.S. Я очень надеюсь на правильный ответ :)</p>`;
  document.getElementById("yesBtn").addEventListener("click", renderChoices);
  document.getElementById("noBtn").addEventListener("click", dodgeNo);
}
function dodgeNo() {
  const btn = document.getElementById("noBtn");
  const area = document.getElementById("buttonArea");
  if (!btn || !area) return;
  noClicks++;
  const maxX = Math.max(0, area.clientWidth - btn.offsetWidth);
  const maxY = 58;
  btn.style.position = "absolute";
  btn.style.left = `${Math.random() * maxX}px`;
  btn.style.top = `${Math.random() * maxY + 50}px`;
  btn.style.transform = `rotate(${Math.random() * 16 - 8}deg)`;
  const jokes = ["Ой, не туда 🙈", "Попробуй ещё раз", "Кажется, кнопка против", "Нет? Не расслышал 😌"];
  btn.textContent = jokes[noClicks % jokes.length];
}
function dateOptions() {
  return [
    { value: "2026-11-01", label: "Воскресенье", sub: "1 ноября" },
    { value: "2026-11-02", label: "Понедельник", sub: "2 ноября" },
    { value: "2026-11-05", label: "Четверг", sub: "5 ноября" }
  ];
}
function renderChoices() {
  updateStep(2);
  const dates = dateOptions();
  screen.innerHTML = `
    <p class="eyebrow">Глава вторая · планируем вечер</p>
    <h2 class="form-title">Выбирай, как<br><em>будем красиветь</em></h2>
    <p class="form-subtitle">Выбери удобный день, время и место.</p>
    <form id="dateForm">
      <div class="field-group"><label class="field-label">Когда?</label><div class="choice-grid">
        ${dates.map(d => `<label class="choice date-choice"><input type="radio" name="date" value="${d.value}" ${selected.date===d.value?"checked":""}><span><strong>${d.label}</strong><small>${d.sub}</small></span></label>`).join("")}
        <label class="choice date-choice"><input type="radio" name="date" value="custom" ${selected.date==="custom"?"checked":""}><span><strong>Свой вариант</strong><small>Выбрать дату</small></span></label>
      </div><div class="custom-date-wrap" id="customDateWrap" ${selected.date==="custom"?"":"hidden"}><label class="field-label" for="customDate">Какая дата тебе удобна?</label><input class="custom-input" id="customDate" type="date" value="${selected.customDate}"></div></div>
      <div class="field-group"><label class="field-label">Во сколько?</label><div class="choice-grid time-grid">${["18:00","19:00","19:30","20:00"].map(t => `<label class="choice"><input type="radio" name="time" value="${t}" ${selected.time===t?"checked":""}><span>${t}</span></label>`).join("")}</div></div>
      <div class="field-group"><label class="field-label">Куда пойдём?</label><div class="choice-grid restaurant-grid">
        ${restaurants.map(r => `<label class="choice restaurant-choice"><input type="radio" name="restaurant" value="${r.id}" ${selected.restaurant===r.id?"checked":""}><span class="restaurant-card-content"><img class="restaurant-image" src="${r.image}" alt="${r.name}" loading="lazy"><span class="restaurant-info"><strong>${r.name}</strong></span></span></label>`).join("")}
        <label class="choice restaurant-choice"><input type="radio" name="restaurant" value="custom" ${selected.restaurant==="custom"?"checked":""}><span class="restaurant-card-content"><div class="restaurant-image image-placeholder"><span>＋</span><small>Свой вариант</small></div><span class="restaurant-info"><strong>Свой вариант</strong></span></span></label>
      </div><div class="custom-restaurant-wrap" id="customRestaurantWrap" ${selected.restaurant==="custom"?"":"hidden"}><label class="field-label" for="customRestaurant">Название ресторана или места</label><input class="custom-input" id="customRestaurant" maxlength="100" placeholder="Например, место с красивым видом" value="${selected.customRestaurant}"><label class="field-label image-field-label" for="customImage">Ссылка на картинку (необязательно)</label><input class="custom-input" id="customImage" type="url" placeholder="https://..." value="${selected.customImage}"><p class="image-help">Добавь ссылку на фото — оно появится в предпросмотре.</p><img class="custom-preview" id="customPreview" alt="Предпросмотр" ${selected.customImage?`src="${selected.customImage}"`:"hidden"}></div></div>
      <button class="btn btn-primary submit-btn" type="submit">Это будет наш вечер ♡</button></form><button class="back-link" id="backBtn" type="button">← Назад</button>`;
  const form=document.getElementById("dateForm");
  form.addEventListener("change",e=>{if(e.target.name==="date"){selected.date=e.target.value;document.getElementById("customDateWrap").hidden=selected.date!=="custom";}if(e.target.name==="time")selected.time=e.target.value;if(e.target.name==="restaurant"){selected.restaurant=e.target.value;document.getElementById("customRestaurantWrap").hidden=selected.restaurant!=="custom";}});
  document.getElementById("customDate").oninput=e=>selected.customDate=e.target.value;
  document.getElementById("customRestaurant").oninput=e=>selected.customRestaurant=e.target.value;
  document.getElementById("customImage").oninput=e=>{selected.customImage=e.target.value;const img=document.getElementById("customPreview");if(/^https?:\/\//i.test(selected.customImage)){img.src=selected.customImage;img.hidden=false;img.onerror=()=>img.hidden=true;}else img.hidden=true;};
  form.addEventListener("submit",e=>{e.preventDefault();const d=new FormData(form);selected.date=d.get("date");selected.time=d.get("time");selected.restaurant=d.get("restaurant");if(!selected.date||!selected.time||!selected.restaurant)return;if(selected.date==="custom"&&!selected.customDate){alert("Выбери свою дату ♡");return;}if(selected.restaurant==="custom"&&!selected.customRestaurant.trim()){alert("Напиши, куда хочешь пойти ♡");return;}renderConfirm();});
  document.getElementById("backBtn").addEventListener("click",renderInvite);
}
function formatDate(value) {
  const v = value === "custom" ? selected.customDate : value;
  const d = new Date(`${v}T12:00:00`);
  return new Intl.DateTimeFormat("ru-RU", { weekday:"long", day:"numeric", month:"long", ...(selected.date === "custom" ? {year:"numeric"} : {}) }).format(d);
}
function chosenRestaurantName() { return selected.restaurant === "custom" ? selected.customRestaurant.trim() : (restaurants.find(r => r.id === selected.restaurant) || {}).name || selected.restaurant; }
function renderConfirm() {
  updateStep(3);
  const restaurant = restaurants.find(r => r.id === selected.restaurant);
  screen.innerHTML = `
    <div class="success-mark">♡</div>
    <p class="eyebrow">Уже предвкушаю</p>
    <h2 class="form-title">Кажется, нас ждёт<br><em>хороший вечер</em></h2>
    <p class="form-subtitle">Твой выбор сохранён на этой странице. Нажми кнопку ниже, чтобы отправить его мне.</p>
    <div class="result-box">
      <div class="result-line"><b>День</b><span>${formatDate(selected.date)}</span></div>
      <div class="result-line"><b>Время</b><span>${selected.time}</span></div>
      <div class="result-line"><b>Ресторан</b><span>${chosenRestaurantName()}</span></div>
    </div>
    <p class="intro" style="font-family:'Playfair Display',serif;font-size:17px;color:#9d5a6d;line-height:1.6;margin-bottom:18px">Пусть этот вечер станет одним из тех, которые хочется вспоминать с улыбкой♡</p>
    <button class="btn btn-primary submit-btn" id="sendBtn">Отправить мой выбор ♡</button>
    <p id="sendStatus" class="error" role="status"></p>
    <button class="back-link" id="editBtn" type="button">Изменить выбор</button>`;
  document.getElementById("sendBtn").addEventListener("click", sendChoice);
  document.getElementById("editBtn").addEventListener("click", renderChoices);
}
async function sendChoice() {
  const button = document.getElementById("sendBtn");
  const status = document.getElementById("sendStatus");
  button.disabled = true;
  button.textContent = "Отправляем…";
  status.textContent = "";
  try {
    const restaurant = restaurants.find(r => r.id === selected.restaurant);
    const response = await fetch("/api/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date: selected.date === "custom" ? selected.customDate : selected.date,
        dateLabel: formatDate(selected.date),
        time: selected.time,
        restaurant: chosenRestaurantName(),
        customImage: selected.restaurant === "custom" ? selected.customImage : "",
        source: "Приглашение для Жансаи"
      })
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.error || "Не удалось отправить выбор.");
    button.textContent = "Отправлено с любовью ♡";
    status.style.color = "#65856b";
    status.textContent = "Готово! Твой выбор отправлен.";
  } catch (err) {
    button.disabled = false;
    button.textContent = "Попробовать отправить ещё раз";
    status.textContent = "Пока не удалось отправить ответ. Проверь подключение и попробуй ещё раз.";
  }
}
document.getElementById("yesBtn").addEventListener("click", renderChoices);
document.getElementById("noBtn").addEventListener("click", dodgeNo);
