import { useState } from "react";
import Icon from "@/components/ui/icon";

type Page = "home" | "games" | "cabinet";

const HERO_BG = "https://cdn.poehali.dev/projects/b1813f42-3b17-4dbd-9868-5f6d6eaff11a/files/4796c40c-6ffb-4b49-93c9-cf002c860a2c.jpg";
const CARDS_IMG = "https://cdn.poehali.dev/projects/b1813f42-3b17-4dbd-9868-5f6d6eaff11a/files/7e8c6234-33c2-4662-bcb9-a761a8076342.jpg";

const GAMES = [
  { id: 1, name: "Баккара Роял", category: "Карты", rtp: "98.9%", icon: "♠", hot: true },
  { id: 2, name: "Рулетка VIP", category: "Рулетка", rtp: "97.3%", icon: "◉", hot: true },
  { id: 3, name: "Блэкджек Pro", category: "Карты", rtp: "99.5%", icon: "♦", hot: false },
  { id: 4, name: "Европейская рулетка", category: "Рулетка", rtp: "97.3%", icon: "◎", hot: false },
  { id: 5, name: "Покер Техас", category: "Покер", rtp: "97.6%", icon: "♣", hot: true },
  { id: 6, name: "Dice Premium", category: "Кости", rtp: "98.1%", icon: "⚄", hot: false },
  { id: 7, name: "Dragon Tiger", category: "Карты", rtp: "96.7%", icon: "♥", hot: true },
  { id: 8, name: "Сicbo Luxe", category: "Кости", rtp: "97.2%", icon: "⚅", hot: false },
];

const TRANSACTIONS = [
  { id: 1, type: "deposit", label: "Пополнение", method: "Visa *4521", amount: "+50 000 ₽", date: "04.05.2026", status: "success" },
  { id: 2, type: "game", label: "Баккара Роял", method: "Выигрыш", amount: "+12 500 ₽", date: "03.05.2026", status: "success" },
  { id: 3, type: "withdraw", label: "Вывод средств", method: "USDT TRC20", amount: "-30 000 ₽", date: "02.05.2026", status: "pending" },
  { id: 4, type: "game", label: "Рулетка VIP", method: "Ставка", amount: "-5 000 ₽", date: "01.05.2026", status: "success" },
  { id: 5, type: "deposit", label: "Пополнение", method: "Crypto BTC", amount: "+100 000 ₽", date: "29.04.2026", status: "success" },
];

const PAYMENT_METHODS = [
  { icon: "💳", label: "Visa / Mastercard", tag: "Мгновенно" },
  { icon: "₿", label: "Bitcoin", tag: "~30 мин" },
  { icon: "◎", label: "USDT TRC20", tag: "~5 мин" },
  { icon: "🏦", label: "СБП / Банк РФ", tag: "~1 час" },
];

const WITHDRAW_METHODS = [
  { icon: "💳", label: "Visa / Mastercard", min: "от 1 000 ₽", time: "1-3 дня" },
  { icon: "₿", label: "Bitcoin (BTC)", min: "от 5 000 ₽", time: "~1 час" },
  { icon: "◎", label: "USDT TRC20", min: "от 500 ₽", time: "~20 мин" },
  { icon: "🏦", label: "СБП / Перевод", min: "от 1 000 ₽", time: "~2 часа" },
];

export default function Index() {
  const [page, setPage] = useState<Page>("home");
  const [activeFilter, setActiveFilter] = useState("Все");
  const [payTab, setPayTab] = useState<"deposit" | "withdraw">("deposit");
  const [amount, setAmount] = useState("");

  const categories = ["Все", "Карты", "Рулетка", "Покер", "Кости"];
  const filteredGames = activeFilter === "Все" ? GAMES : GAMES.filter(g => g.category === activeFilter);

  return (
    <div className="min-h-screen noise-bg" style={{ backgroundColor: "var(--dark-bg)", color: "#E8D5A3" }}>

      {/* NAVIGATION */}
      <nav className="fixed top-0 left-0 right-0 z-50 dark-glass">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setPage("home")}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center animate-pulse-gold"
              style={{ background: "linear-gradient(135deg, #8B6914, #C9A84C)" }}>
              <span className="text-xs font-bold" style={{ color: "#0D0B08" }}>A</span>
            </div>
            <span className="font-cormorant text-xl font-semibold tracking-widest animate-gold-shimmer">AURUM</span>
          </div>

          <div className="hidden md:flex items-center gap-1">
            {([ ["home", "Главная", "Home"], ["games", "Игры", "Gamepad2"], ["cabinet", "Кабинет", "User"] ] as const).map(([id, label, icon]) => (
              <button
                key={id}
                onClick={() => setPage(id)}
                className="flex items-center gap-2 px-4 py-2 rounded text-sm font-montserrat font-medium transition-all duration-300"
                style={{
                  color: page === id ? "#C9A84C" : "#a89060",
                  background: page === id ? "rgba(201,168,76,0.1)" : "transparent",
                  borderBottom: page === id ? "1px solid #C9A84C" : "1px solid transparent",
                }}
              >
                <Icon name={icon} size={15} />
                {label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded"
              style={{ background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.25)" }}>
              <Icon name="Wallet" size={14} style={{ color: "#C9A84C" }} />
              <span className="text-sm font-montserrat font-medium" style={{ color: "#C9A84C" }}>127 500 ₽</span>
            </div>
            <button className="btn-gold px-4 py-2 rounded text-sm font-montserrat"
              onClick={() => setPage("cabinet")}>
              Войти
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        <div className="md:hidden flex border-t" style={{ borderColor: "rgba(201,168,76,0.1)" }}>
          {([ ["home", "Главная", "Home"], ["games", "Игры", "Gamepad2"], ["cabinet", "Кабинет", "User"] ] as const).map(([id, label, icon]) => (
            <button key={id} onClick={() => setPage(id)}
              className="flex-1 flex flex-col items-center gap-1 py-2 text-xs transition-all"
              style={{ color: page === id ? "#C9A84C" : "#6b5a3a" }}>
              <Icon name={icon} size={18} />
              {label}
            </button>
          ))}
        </div>
      </nav>

      {/* ===================== HOME PAGE ===================== */}
      {page === "home" && (
        <div className="pt-16 md:pt-20">

          {/* HERO */}
          <section className="relative h-[90vh] flex items-center overflow-hidden">
            <div className="absolute inset-0">
              <img src={HERO_BG} alt="AURUM Casino" className="w-full h-full object-cover" />
              <div className="absolute inset-0" style={{
                background: "linear-gradient(135deg, rgba(13,11,8,0.92) 0%, rgba(13,11,8,0.6) 50%, rgba(13,11,8,0.85) 100%)"
              }} />
            </div>

            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10 animate-spin-slow hidden lg:block"
              style={{ border: "1px solid #C9A84C", right: "-150px" }} />
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full opacity-20 animate-spin-slow hidden lg:block"
              style={{ border: "1px solid #C9A84C", right: "-50px", animationDirection: "reverse", animationDuration: "15s" }} />

            <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-6 animate-fade-in-up"
                  style={{ background: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.3)" }}>
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-xs font-montserrat tracking-widest" style={{ color: "#C9A84C" }}>ОНЛАЙН 2 847 ИГРОКОВ</span>
                </div>

                <h1 className="font-cormorant text-6xl md:text-8xl font-light mb-4 animate-fade-in-up delay-100"
                  style={{ lineHeight: "1.0" }}>
                  <span className="animate-gold-shimmer">Элитная</span>
                  <br />
                  <span style={{ color: "#E8D5A3" }}>платформа</span>
                </h1>

                <p className="font-montserrat text-base font-light mb-8 animate-fade-in-up delay-200"
                  style={{ color: "#a89060", lineHeight: "1.7" }}>
                  Исключительный опыт игры для тех, кто ценит качество.<br />
                  Мгновенные выплаты. Честные шансы. Полная конфиденциальность.
                </p>

                <div className="flex flex-wrap gap-4 animate-fade-in-up delay-300">
                  <button className="btn-gold px-8 py-3.5 rounded-sm font-montserrat text-sm tracking-widest uppercase"
                    onClick={() => setPage("games")}>
                    Начать игру
                  </button>
                  <button className="px-8 py-3.5 rounded-sm font-montserrat text-sm tracking-widest uppercase transition-all duration-300"
                    style={{ border: "1px solid rgba(201,168,76,0.4)", color: "#C9A84C" }}
                    onClick={() => setPage("cabinet")}>
                    Регистрация
                  </button>
                </div>
              </div>
            </div>

            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-float">
              <span className="text-xs font-montserrat tracking-widest" style={{ color: "rgba(201,168,76,0.5)" }}>ПРОКРУТИТЬ</span>
              <Icon name="ChevronDown" size={16} style={{ color: "rgba(201,168,76,0.5)" }} />
            </div>
          </section>

          {/* STATS */}
          <section className="py-12 border-y" style={{ borderColor: "rgba(201,168,76,0.15)", background: "rgba(20,18,16,0.8)" }}>
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { value: "12 лет", label: "На рынке" },
                { value: "500K+", label: "Игроков" },
                { value: "98.7%", label: "Средний RTP" },
                { value: "15 мин", label: "Средний вывод" },
              ].map((stat, i) => (
                <div key={i} className="text-center animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                  <div className="font-cormorant text-4xl md:text-5xl font-light animate-gold-shimmer">{stat.value}</div>
                  <div className="font-montserrat text-xs tracking-widest mt-1 uppercase" style={{ color: "#6b5a3a" }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </section>

          {/* FEATURED GAMES */}
          <section className="py-20 max-w-7xl mx-auto px-6">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="font-montserrat text-xs tracking-widest mb-2 uppercase" style={{ color: "#C9A84C" }}>Топ игры</p>
                <h2 className="font-cormorant text-4xl md:text-5xl font-light" style={{ color: "#E8D5A3" }}>
                  Избранные столы
                </h2>
              </div>
              <button className="hidden md:flex items-center gap-2 font-montserrat text-sm transition-all hover:gap-3"
                style={{ color: "#C9A84C" }} onClick={() => setPage("games")}>
                Все игры <Icon name="ArrowRight" size={16} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {GAMES.slice(0, 4).map((game, i) => (
                <div key={game.id} className="card-hover cursor-pointer rounded-lg p-5 animate-fade-in-up"
                  style={{
                    background: "var(--dark-card)",
                    border: "1px solid rgba(201,168,76,0.15)",
                    animationDelay: `${i * 0.1}s`
                  }}
                  onClick={() => setPage("games")}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                      style={{ background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.2)" }}>
                      {game.icon}
                    </div>
                    {game.hot && (
                      <span className="text-xs font-montserrat px-2 py-0.5 rounded-full"
                        style={{ background: "rgba(201,168,76,0.2)", color: "#C9A84C" }}>HOT</span>
                    )}
                  </div>
                  <div className="font-cormorant text-lg font-medium mb-1" style={{ color: "#E8D5A3" }}>{game.name}</div>
                  <div className="font-montserrat text-xs mb-3" style={{ color: "#6b5a3a" }}>{game.category}</div>
                  <div className="flex items-center justify-between">
                    <span className="font-montserrat text-xs" style={{ color: "#a89060" }}>RTP {game.rtp}</span>
                    <div className="w-6 h-6 rounded-full flex items-center justify-center"
                      style={{ background: "rgba(201,168,76,0.15)" }}>
                      <Icon name="Play" size={10} style={{ color: "#C9A84C" }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* PROMO BANNER */}
          <section className="py-8 px-6 max-w-7xl mx-auto mb-16">
            <div className="relative rounded-xl overflow-hidden">
              <img src={CARDS_IMG} alt="Promo" className="w-full h-64 md:h-80 object-cover" />
              <div className="absolute inset-0 flex flex-col justify-center px-10 md:px-16"
                style={{ background: "linear-gradient(90deg, rgba(13,11,8,0.95) 40%, rgba(13,11,8,0.4) 100%)" }}>
                <div className="inline-block px-3 py-1 rounded-full mb-4 w-fit"
                  style={{ background: "rgba(201,168,76,0.2)", border: "1px solid rgba(201,168,76,0.4)" }}>
                  <span className="text-xs font-montserrat tracking-widest" style={{ color: "#C9A84C" }}>ПРИВЕТСТВЕННЫЙ БОНУС</span>
                </div>
                <h3 className="font-cormorant text-4xl md:text-6xl font-light mb-3" style={{ color: "#E8D5A3" }}>
                  До <span className="animate-gold-shimmer">300%</span>
                </h3>
                <p className="font-montserrat text-sm mb-6 max-w-xs" style={{ color: "#a89060" }}>
                  На первые три депозита.<br />Без скрытых условий.
                </p>
                <button className="btn-gold px-6 py-3 rounded-sm font-montserrat text-sm tracking-wider w-fit uppercase"
                  onClick={() => setPage("cabinet")}>
                  Получить бонус
                </button>
              </div>
            </div>
          </section>

          {/* FOOTER */}
          <footer className="border-t py-10 px-6 text-center" style={{ borderColor: "rgba(201,168,76,0.1)" }}>
            <div className="font-cormorant text-2xl animate-gold-shimmer mb-3">AURUM</div>
            <p className="font-montserrat text-xs" style={{ color: "#3d3020" }}>
              © 2026 AURUM Casino. Играйте ответственно. 18+
            </p>
          </footer>
        </div>
      )}

      {/* ===================== GAMES PAGE ===================== */}
      {page === "games" && (
        <div className="pt-20 md:pt-24 min-h-screen">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-10 pt-6">
              <p className="font-montserrat text-xs tracking-widest mb-2 uppercase" style={{ color: "#C9A84C" }}>Каталог</p>
              <h2 className="font-cormorant text-4xl md:text-6xl font-light" style={{ color: "#E8D5A3" }}>
                Игровые столы
              </h2>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2 mb-8">
              {categories.map(cat => (
                <button key={cat} onClick={() => setActiveFilter(cat)}
                  className="px-4 py-2 rounded-sm font-montserrat text-xs tracking-wider transition-all duration-300"
                  style={{
                    background: activeFilter === cat ? "linear-gradient(135deg, #8B6914, #C9A84C)" : "rgba(201,168,76,0.08)",
                    color: activeFilter === cat ? "#0D0B08" : "#a89060",
                    border: activeFilter === cat ? "none" : "1px solid rgba(201,168,76,0.2)",
                    fontWeight: activeFilter === cat ? "600" : "400",
                  }}>
                  {cat}
                </button>
              ))}
            </div>

            {/* Games grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
              {filteredGames.map((game, i) => (
                <div key={game.id} className="card-hover cursor-pointer rounded-lg overflow-hidden animate-fade-in-up"
                  style={{ background: "var(--dark-card)", border: "1px solid rgba(201,168,76,0.15)", animationDelay: `${i * 0.07}s` }}>
                  <div className="h-36 flex items-center justify-center text-6xl relative"
                    style={{ background: "linear-gradient(135deg, #0D0B08, #1C1814)" }}>
                    <span className="animate-float" style={{ animationDelay: `${i * 0.3}s` }}>{game.icon}</span>
                    {game.hot && (
                      <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-xs font-montserrat"
                        style={{ background: "rgba(201,168,76,0.25)", color: "#E8C97A", border: "1px solid rgba(201,168,76,0.4)" }}>
                        🔥 HOT
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="font-cormorant text-lg font-medium mb-1" style={{ color: "#E8D5A3" }}>{game.name}</div>
                    <div className="font-montserrat text-xs mb-3" style={{ color: "#6b5a3a" }}>{game.category}</div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-montserrat" style={{ color: "#6b5a3a" }}>RTP</div>
                        <div className="font-cormorant text-lg" style={{ color: "#C9A84C" }}>{game.rtp}</div>
                      </div>
                      <button className="btn-gold px-4 py-2 rounded text-xs font-montserrat tracking-wider">
                        Играть
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===================== CABINET PAGE ===================== */}
      {page === "cabinet" && (
        <div className="pt-20 md:pt-24 min-h-screen">
          <div className="max-w-5xl mx-auto px-6">

            {/* Profile header */}
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-10 pt-6 animate-fade-in-up">
              <div className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-cormorant font-bold animate-pulse-gold"
                style={{ background: "linear-gradient(135deg, #1C1814, #2a2318)", border: "2px solid #C9A84C", color: "#C9A84C" }}>
                АВ
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="font-cormorant text-3xl font-medium" style={{ color: "#E8D5A3" }}>Александр Волков</h2>
                  <span className="px-2 py-0.5 rounded-full text-xs font-montserrat"
                    style={{ background: "rgba(201,168,76,0.2)", color: "#C9A84C", border: "1px solid rgba(201,168,76,0.3)" }}>
                    VIP GOLD
                  </span>
                </div>
                <div className="font-montserrat text-xs" style={{ color: "#6b5a3a" }}>Участник с января 2024 · ID: #AV-48291</div>
              </div>
              <div className="md:ml-auto flex flex-col items-end gap-1">
                <div className="font-montserrat text-xs tracking-wider" style={{ color: "#6b5a3a" }}>БАЛАНС</div>
                <div className="font-cormorant text-4xl animate-gold-shimmer">127 500 ₽</div>
              </div>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
              {[
                { label: "Депозиты", value: "350 000 ₽", icon: "TrendingUp" },
                { label: "Выводы", value: "198 000 ₽", icon: "TrendingDown" },
                { label: "Выигрыши", icon: "Trophy", value: "47 раз" },
                { label: "Бонусный счёт", value: "3 200 ₽", icon: "Gift" },
              ].map((item, i) => (
                <div key={i} className="rounded-lg p-4 animate-fade-in-up"
                  style={{ background: "var(--dark-card)", border: "1px solid rgba(201,168,76,0.15)", animationDelay: `${i * 0.1}s` }}>
                  <div className="flex items-center gap-2 mb-2">
                    <Icon name={item.icon} size={14} style={{ color: "#C9A84C" }} />
                    <span className="font-montserrat text-xs" style={{ color: "#6b5a3a" }}>{item.label}</span>
                  </div>
                  <div className="font-cormorant text-xl" style={{ color: "#E8D5A3" }}>{item.value}</div>
                </div>
              ))}
            </div>

            {/* Payment section */}
            <div className="rounded-xl mb-8 overflow-hidden animate-fade-in-up delay-200"
              style={{ background: "var(--dark-card)", border: "1px solid rgba(201,168,76,0.2)" }}>
              <div className="flex border-b" style={{ borderColor: "rgba(201,168,76,0.15)" }}>
                {([ ["deposit", "Пополнить"], ["withdraw", "Вывести"] ] as const).map(([tab, label]) => (
                  <button key={tab} onClick={() => setPayTab(tab)}
                    className="flex-1 py-4 font-montserrat text-sm tracking-wider transition-all"
                    style={{
                      color: payTab === tab ? "#C9A84C" : "#6b5a3a",
                      borderBottom: payTab === tab ? "2px solid #C9A84C" : "2px solid transparent",
                      background: payTab === tab ? "rgba(201,168,76,0.05)" : "transparent",
                    }}>
                    {label}
                  </button>
                ))}
              </div>

              <div className="p-6">
                <div className="mb-5">
                  <label className="font-montserrat text-xs tracking-wider mb-2 block" style={{ color: "#6b5a3a" }}>
                    СУММА (₽)
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    placeholder="Введите сумму..."
                    className="w-full px-4 py-3 rounded font-montserrat text-sm outline-none transition-all"
                    style={{
                      background: "rgba(201,168,76,0.05)",
                      border: "1px solid rgba(201,168,76,0.2)",
                      color: "#E8D5A3",
                    }}
                    onFocus={e => (e.target.style.borderColor = "#C9A84C")}
                    onBlur={e => (e.target.style.borderColor = "rgba(201,168,76,0.2)")}
                  />
                  <div className="flex gap-2 mt-2">
                    {["1000", "5000", "10000", "50000"].map(v => (
                      <button key={v} onClick={() => setAmount(v)}
                        className="flex-1 py-1.5 rounded text-xs font-montserrat transition-all"
                        style={{ background: "rgba(201,168,76,0.08)", color: "#a89060", border: "1px solid rgba(201,168,76,0.15)" }}>
                        {Number(v).toLocaleString("ru")}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <label className="font-montserrat text-xs tracking-wider mb-3 block" style={{ color: "#6b5a3a" }}>
                    СПОСОБ {payTab === "deposit" ? "ПОПОЛНЕНИЯ" : "ВЫВОДА"}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {(payTab === "deposit" ? PAYMENT_METHODS : WITHDRAW_METHODS).map((m, i) => (
                      <div key={i} className="card-hover cursor-pointer rounded-lg p-3 flex items-center gap-3"
                        style={{ background: "rgba(201,168,76,0.05)", border: "1px solid rgba(201,168,76,0.15)" }}>
                        <span className="text-xl">{m.icon}</span>
                        <div>
                          <div className="font-montserrat text-xs font-medium" style={{ color: "#E8D5A3" }}>{m.label}</div>
                          <div className="font-montserrat text-xs" style={{ color: "#6b5a3a" }}>
                            {"tag" in m ? m.tag : `${"min" in m ? m.min : ""} · ${"time" in m ? m.time : ""}`}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button className="btn-gold w-full py-3.5 rounded font-montserrat text-sm tracking-widest uppercase">
                  {payTab === "deposit" ? "Пополнить баланс" : "Вывести средства"}
                </button>
              </div>
            </div>

            {/* Transaction history */}
            <div className="rounded-xl mb-16 overflow-hidden animate-fade-in-up delay-300"
              style={{ background: "var(--dark-card)", border: "1px solid rgba(201,168,76,0.2)" }}>
              <div className="px-6 py-4 border-b flex items-center gap-2"
                style={{ borderColor: "rgba(201,168,76,0.15)" }}>
                <Icon name="History" size={16} style={{ color: "#C9A84C" }} />
                <span className="font-montserrat text-sm font-medium" style={{ color: "#E8D5A3" }}>История транзакций</span>
              </div>

              <div>
                {TRANSACTIONS.map((tx, i) => (
                  <div key={tx.id} className="px-6 py-4 flex items-center gap-4 transition-all hover:bg-opacity-50"
                    style={{ borderBottom: i < TRANSACTIONS.length - 1 ? "1px solid rgba(201,168,76,0.08)" : "none" }}>
                    <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{
                        background: tx.type === "deposit" ? "rgba(34,197,94,0.15)" : tx.type === "withdraw" ? "rgba(201,168,76,0.15)" : "rgba(139,105,20,0.2)",
                      }}>
                      <Icon
                        name={tx.type === "deposit" ? "ArrowDownLeft" : tx.type === "withdraw" ? "ArrowUpRight" : "Gamepad2"}
                        size={14}
                        style={{ color: tx.type === "deposit" ? "#22c55e" : "#C9A84C" }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-montserrat text-sm font-medium truncate" style={{ color: "#E8D5A3" }}>{tx.label}</div>
                      <div className="font-montserrat text-xs" style={{ color: "#6b5a3a" }}>{tx.method} · {tx.date}</div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="font-cormorant text-lg font-medium"
                        style={{ color: tx.amount.startsWith("+") ? "#22c55e" : "#E8D5A3" }}>
                        {tx.amount}
                      </div>
                      <div className="font-montserrat text-xs"
                        style={{ color: tx.status === "success" ? "#22c55e" : "#C9A84C" }}>
                        {tx.status === "success" ? "Выполнено" : "В обработке"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}