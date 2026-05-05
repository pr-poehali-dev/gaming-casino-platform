import { useState } from "react";
import Icon from "@/components/ui/icon";

const AUTH_URL = "https://functions.poehali.dev/a3cd9fbb-04c6-4d84-9c96-75a5e57efff6";
const PAYMENTS_URL = "https://functions.poehali.dev/99fa5599-2e74-49ff-bc06-fb69ba77aa4c";
const CARD_NUMBER = "2200 7021 1838 9035";
const BANK_NAME = "Т-Банк";

type Page = "home" | "games" | "cabinet" | "play";

const HERO_BG = "https://cdn.poehali.dev/projects/b1813f42-3b17-4dbd-9868-5f6d6eaff11a/files/4796c40c-6ffb-4b49-93c9-cf002c860a2c.jpg";
const CARDS_IMG = "https://cdn.poehali.dev/projects/b1813f42-3b17-4dbd-9868-5f6d6eaff11a/files/7e8c6234-33c2-4662-bcb9-a761a8076342.jpg";

interface Game {
  id: number;
  name: string;
  category: string;
  rtp: string;
  icon: string;
  hot: boolean;
  color: string;
  desc: string;
  minBet: string;
  maxBet: string;
}

const GAMES: Game[] = [
  { id: 1, name: "Баккара Роял", category: "Карты", rtp: "98.9%", icon: "♠", hot: true, color: "#C9A84C", desc: "Классическая баккара с живым дилером. Ставьте на банкира, игрока или ничью.", minBet: "100 ₽", maxBet: "500 000 ₽" },
  { id: 2, name: "Рулетка VIP", category: "Рулетка", rtp: "97.3%", icon: "◉", hot: true, color: "#E8C97A", desc: "Европейская рулетка с расширенными ставками и живым крупье.", minBet: "50 ₽", maxBet: "300 000 ₽" },
  { id: 3, name: "Блэкджек Pro", category: "Карты", rtp: "99.5%", icon: "♦", hot: false, color: "#C9A84C", desc: "Профессиональный блэкджек. Наберите 21 или ближе к нему, чем дилер.", minBet: "200 ₽", maxBet: "200 000 ₽" },
  { id: 4, name: "Европейская рулетка", category: "Рулетка", rtp: "97.3%", icon: "◎", hot: false, color: "#8B6914", desc: "Классическая европейская рулетка с одним нулём.", minBet: "10 ₽", maxBet: "100 000 ₽" },
  { id: 5, name: "Покер Техас", category: "Покер", rtp: "97.6%", icon: "♣", hot: true, color: "#E8C97A", desc: "Texas Hold'em против дилера. Соберите лучшую комбинацию из 5 карт.", minBet: "100 ₽", maxBet: "100 000 ₽" },
  { id: 6, name: "Dice Premium", category: "Кости", rtp: "98.1%", icon: "⚄", hot: false, color: "#C9A84C", desc: "Угадайте результат броска кубиков. Высокие коэффициенты.", minBet: "50 ₽", maxBet: "50 000 ₽" },
  { id: 7, name: "Dragon Tiger", category: "Карты", rtp: "96.7%", icon: "♥", hot: true, color: "#E8C97A", desc: "Дракон против Тигра — простая и быстрая карточная игра.", minBet: "100 ₽", maxBet: "250 000 ₽" },
  { id: 8, name: "Сicbo Luxe", category: "Кости", rtp: "97.2%", icon: "⚅", hot: false, color: "#8B6914", desc: "Азиатская игра в кости с множеством вариантов ставок.", minBet: "50 ₽", maxBet: "80 000 ₽" },
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

interface DepositInfo {
  payment_id: number;
  payment_code: string;
  amount: number;
  card_number: string;
  bank: string;
}

export default function Index() {
  const [page, setPage] = useState<Page>("home");
  const [activeFilter, setActiveFilter] = useState("Все");
  const [payTab, setPayTab] = useState<"deposit" | "withdraw">("deposit");
  const [amount, setAmount] = useState("");

  // Auth state
  const [authTab, setAuthTab] = useState<"login" | "register">("login");
  const [authLogin, setAuthLogin] = useState("");
  const [authEmail, setAuthEmail] = useState("");
  const [authUsername, setAuthUsername] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [token, setToken] = useState(() => localStorage.getItem("aurum_token") || "");
  const [currentUser, setCurrentUser] = useState<{username: string; balance: number; vip_level: string} | null>(null);

  // Deposit state
  const [depositLoading, setDepositLoading] = useState(false);
  const [depositInfo, setDepositInfo] = useState<DepositInfo | null>(null);
  const [depositSent, setDepositSent] = useState(false);
  const [copied, setCopied] = useState(false);

  // Game state
  const [activeGame, setActiveGame] = useState<Game | null>(null);
  const [openTabs, setOpenTabs] = useState<Game[]>([]);
  const [bet, setBet] = useState("500");
  const [gameResult, setGameResult] = useState<null | {win: boolean; amount: number; msg: string}>(null);
  const [gameLoading, setGameLoading] = useState(false);

  const openGame = (game: Game) => {
    setActiveGame(game);
    setOpenTabs(prev => prev.find(g => g.id === game.id) ? prev : [...prev, game]);
    setPage("play");
    setGameResult(null);
  };

  const closeTab = (gameId: number) => {
    const newTabs = openTabs.filter(g => g.id !== gameId);
    setOpenTabs(newTabs);
    if (activeGame?.id === gameId) {
      if (newTabs.length > 0) { setActiveGame(newTabs[newTabs.length - 1]); }
      else { setActiveGame(null); setPage("games"); }
    }
  };

  const switchTab = (game: Game) => {
    setActiveGame(game);
    setGameResult(null);
  };

  const playRound = () => {
    if (!activeGame) return;
    const betNum = Number(bet);
    if (!betNum || betNum < 50) return;
    setGameLoading(true);
    setGameResult(null);
    setTimeout(() => {
      const win = Math.random() < 0.48;
      const mult = win ? (Math.random() < 0.3 ? 3 : 2) : 0;
      const amount = win ? betNum * mult : -betNum;
      const msgs = win
        ? ["Удача на вашей стороне!", "Превосходно! Вы победили!", "Блестящий результат!"]
        : ["Увы, в этот раз не ваш день.", "Попробуйте ещё раз.", "Фортуна переменчива..."];
      setGameResult({ win, amount, msg: msgs[Math.floor(Math.random() * msgs.length)] });
      setGameLoading(false);
    }, 1200);
  };

  const saveToken = (t: string, user: {username: string; balance: number; vip_level: string}) => {
    localStorage.setItem("aurum_token", t);
    setToken(t);
    setCurrentUser(user);
  };

  const logout = () => {
    if (token) fetch(AUTH_URL, { method: "POST", headers: { "Content-Type": "application/json", "X-Session-Token": token }, body: JSON.stringify({ action: "logout" }) });
    localStorage.removeItem("aurum_token");
    setToken("");
    setCurrentUser(null);
    setDepositInfo(null);
    setDepositSent(false);
  };

  const handleAuth = async () => {
    setAuthError("");
    setAuthLoading(true);
    const body = authTab === "login"
      ? { action: "login", login: authLogin, password: authPassword }
      : { action: "register", email: authEmail, username: authUsername, password: authPassword };
    const res = await fetch(AUTH_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const data = await res.json();
    setAuthLoading(false);
    if (data.error) { setAuthError(data.error); return; }
    saveToken(data.token, { username: data.username, balance: data.balance ?? 0, vip_level: data.vip_level ?? "STANDARD" });
  };

  const handleDeposit = async () => {
    if (!amount || Number(amount) < 100) return;
    setDepositLoading(true);
    const res = await fetch(PAYMENTS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Session-Token": token },
      body: JSON.stringify({ action: "create_deposit", amount: Number(amount) })
    });
    const data = await res.json();
    setDepositLoading(false);
    if (data.error) { alert(data.error); return; }
    setDepositInfo(data);
    setDepositSent(false);
  };

  const handleConfirmSent = async () => {
    if (!depositInfo) return;
    await fetch(PAYMENTS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Session-Token": token },
      body: JSON.stringify({ action: "confirm_sent", payment_id: depositInfo.payment_id })
    });
    setDepositSent(true);
  };

  const copyCard = async () => {
    const num = CARD_NUMBER.replace(/\s/g, "");
    try {
      await navigator.clipboard.writeText(num);
    } catch {
      const el = document.createElement("textarea");
      el.value = num;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
                onClick={() => setPage(id as Page)}
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
            {openTabs.length > 0 && (
              <button onClick={() => { setPage("play"); setActiveGame(openTabs[openTabs.length - 1]); }}
                className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded font-montserrat text-xs transition-all"
                style={{ background: page === "play" ? "rgba(201,168,76,0.15)" : "rgba(201,168,76,0.07)", color: "#C9A84C", border: "1px solid rgba(201,168,76,0.3)" }}>
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                {openTabs.length} {openTabs.length === 1 ? "игра" : "игры"}
              </button>
            )}
            {currentUser ? (
              <>
                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded"
                  style={{ background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.25)" }}>
                  <Icon name="Wallet" size={14} style={{ color: "#C9A84C" }} />
                  <span className="text-sm font-montserrat font-medium" style={{ color: "#C9A84C" }}>
                    {currentUser.balance.toLocaleString("ru")} ₽
                  </span>
                </div>
                <button className="btn-gold px-4 py-2 rounded text-sm font-montserrat" onClick={() => setPage("cabinet")}>
                  {currentUser.username}
                </button>
              </>
            ) : (
              <button className="btn-gold px-4 py-2 rounded text-sm font-montserrat" onClick={() => setPage("cabinet")}>
                Войти
              </button>
            )}
          </div>
        </div>

        {/* Mobile nav */}
        <div className="md:hidden flex border-t" style={{ borderColor: "rgba(201,168,76,0.1)" }}>
          {([ ["home", "Главная", "Home"], ["games", "Игры", "Gamepad2"], ["cabinet", "Кабинет", "User"] ] as const).map(([id, label, icon]) => (
            <button key={id} onClick={() => setPage(id as Page)}
              className="flex-1 flex flex-col items-center gap-1 py-2 text-xs transition-all"
              style={{ color: page === id ? "#C9A84C" : "#6b5a3a" }}>
              <Icon name={icon} size={18} />
              {label}
            </button>
          ))}
          {openTabs.length > 0 && (
            <button onClick={() => { setPage("play"); setActiveGame(openTabs[openTabs.length - 1]); }}
              className="flex-1 flex flex-col items-center gap-1 py-2 text-xs transition-all relative"
              style={{ color: page === "play" ? "#C9A84C" : "#6b5a3a" }}>
              <div className="relative">
                <Icon name="Gamepad" size={18} />
                <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-green-400" />
              </div>
              Играю
            </button>
          )}
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
                  onClick={() => openGame(game)}>
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
                  style={{ background: "var(--dark-card)", border: `1px solid ${activeGame?.id === game.id ? "rgba(201,168,76,0.5)" : "rgba(201,168,76,0.15)"}`, animationDelay: `${i * 0.07}s` }}>
                  <div className="h-36 flex items-center justify-center text-6xl relative"
                    style={{ background: "linear-gradient(135deg, #0D0B08, #1C1814)" }}>
                    <span className="animate-float" style={{ animationDelay: `${i * 0.3}s` }}>{game.icon}</span>
                    {game.hot && (
                      <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-xs font-montserrat"
                        style={{ background: "rgba(201,168,76,0.25)", color: "#E8C97A", border: "1px solid rgba(201,168,76,0.4)" }}>
                        🔥 HOT
                      </div>
                    )}
                    {openTabs.find(g => g.id === game.id) && (
                      <div className="absolute top-3 left-3 w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    )}
                  </div>
                  <div className="p-4">
                    <div className="font-cormorant text-lg font-medium mb-1" style={{ color: "#E8D5A3" }}>{game.name}</div>
                    <div className="font-montserrat text-xs mb-1" style={{ color: "#6b5a3a" }}>{game.category}</div>
                    <div className="font-montserrat text-xs mb-3" style={{ color: "#6b5a3a" }}>Ставки: {game.minBet} — {game.maxBet}</div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-montserrat" style={{ color: "#6b5a3a" }}>RTP</div>
                        <div className="font-cormorant text-lg" style={{ color: "#C9A84C" }}>{game.rtp}</div>
                      </div>
                      <button className="btn-gold px-4 py-2 rounded text-xs font-montserrat tracking-wider"
                        onClick={() => openGame(game)}>
                        {openTabs.find(g => g.id === game.id) ? "Открыть" : "Играть"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===================== PLAY PAGE ===================== */}
      {page === "play" && activeGame && (
        <div className="pt-16 md:pt-20 min-h-screen flex flex-col" style={{ background: "var(--dark-bg)" }}>

          {/* Tabs bar */}
          <div className="flex items-center gap-0 overflow-x-auto border-b px-4 pt-2"
            style={{ borderColor: "rgba(201,168,76,0.15)", background: "var(--dark-card)" }}>
            {openTabs.map(tab => (
              <div key={tab.id}
                className="flex items-center gap-2 px-4 py-2.5 cursor-pointer transition-all flex-shrink-0 rounded-t-lg mr-1"
                style={{
                  background: activeGame.id === tab.id ? "var(--dark-bg)" : "transparent",
                  borderTop: activeGame.id === tab.id ? "1px solid rgba(201,168,76,0.4)" : "1px solid transparent",
                  borderLeft: activeGame.id === tab.id ? "1px solid rgba(201,168,76,0.2)" : "1px solid transparent",
                  borderRight: activeGame.id === tab.id ? "1px solid rgba(201,168,76,0.2)" : "1px solid transparent",
                }}
                onClick={() => switchTab(tab)}>
                <span className="text-base">{tab.icon}</span>
                <span className="font-montserrat text-xs font-medium whitespace-nowrap"
                  style={{ color: activeGame.id === tab.id ? "#C9A84C" : "#6b5a3a" }}>
                  {tab.name}
                </span>
                <button className="ml-1 w-4 h-4 rounded-full flex items-center justify-center transition-all hover:bg-red-900"
                  onClick={e => { e.stopPropagation(); closeTab(tab.id); }}
                  style={{ color: "#6b5a3a" }}>
                  <Icon name="X" size={10} />
                </button>
              </div>
            ))}
            <button onClick={() => setPage("games")}
              className="flex items-center gap-1.5 px-3 py-2 ml-2 rounded font-montserrat text-xs flex-shrink-0 transition-all"
              style={{ color: "#6b5a3a", border: "1px solid rgba(201,168,76,0.15)" }}>
              <Icon name="Plus" size={12} /> Ещё игры
            </button>
          </div>

          {/* Game area */}
          <div className="flex-1 flex flex-col lg:flex-row gap-0">

            {/* Main game view */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-10">
              {/* Game "table" */}
              <div className="w-full max-w-lg rounded-2xl overflow-hidden animate-fade-in-up"
                style={{ background: "linear-gradient(135deg, #0D0B08 0%, #1C1814 100%)", border: "1px solid rgba(201,168,76,0.25)", minHeight: 320 }}>

                {/* Table header */}
                <div className="px-6 py-4 border-b flex items-center justify-between"
                  style={{ borderColor: "rgba(201,168,76,0.15)" }}>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{activeGame.icon}</span>
                    <div>
                      <div className="font-cormorant text-xl" style={{ color: "#E8D5A3" }}>{activeGame.name}</div>
                      <div className="font-montserrat text-xs" style={{ color: "#6b5a3a" }}>{activeGame.category} · RTP {activeGame.rtp}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="font-montserrat text-xs" style={{ color: "#6b5a3a" }}>Live</span>
                  </div>
                </div>

                {/* Game table visual */}
                <div className="flex flex-col items-center justify-center py-10 px-6">
                  {!gameResult && !gameLoading && (
                    <div className="text-center animate-fade-in-up">
                      <div className="text-8xl mb-4 animate-float">{activeGame.icon}</div>
                      <p className="font-montserrat text-sm mb-2" style={{ color: "#6b5a3a" }}>{activeGame.desc}</p>
                      <p className="font-montserrat text-xs" style={{ color: "#3d3020" }}>
                        Ставки: {activeGame.minBet} — {activeGame.maxBet}
                      </p>
                    </div>
                  )}

                  {gameLoading && (
                    <div className="text-center">
                      <div className="text-7xl mb-4 animate-spin-slow">{activeGame.icon}</div>
                      <p className="font-montserrat text-sm animate-pulse" style={{ color: "#C9A84C" }}>Идёт раунд...</p>
                    </div>
                  )}

                  {gameResult && !gameLoading && (
                    <div className="text-center animate-fade-in-up">
                      <div className="text-6xl mb-3">{gameResult.win ? "🏆" : "💔"}</div>
                      <div className="font-cormorant text-4xl mb-2"
                        style={{ color: gameResult.win ? "#22c55e" : "#ef4444" }}>
                        {gameResult.win ? "+" : ""}{gameResult.amount.toLocaleString("ru")} ₽
                      </div>
                      <p className="font-montserrat text-sm" style={{ color: gameResult.win ? "#a3f0b0" : "#a89060" }}>
                        {gameResult.msg}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Betting panel */}
            <div className="lg:w-72 xl:w-80 p-4 lg:p-6 flex flex-col gap-4"
              style={{ borderLeft: "1px solid rgba(201,168,76,0.1)", background: "rgba(20,18,16,0.6)" }}>

              <div>
                <div className="font-montserrat text-xs tracking-wider mb-2" style={{ color: "#6b5a3a" }}>ВАША СТАВКА (₽)</div>
                <input type="number" value={bet} onChange={e => setBet(e.target.value)}
                  className="w-full px-4 py-3 rounded font-cormorant text-xl outline-none"
                  style={{ background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.25)", color: "#E8C97A" }}
                  onFocus={e => (e.target.style.borderColor = "#C9A84C")}
                  onBlur={e => (e.target.style.borderColor = "rgba(201,168,76,0.25)")} />
                <div className="grid grid-cols-4 gap-1.5 mt-2">
                  {["100", "500", "1000", "5000"].map(v => (
                    <button key={v} onClick={() => setBet(v)}
                      className="py-1.5 rounded text-xs font-montserrat transition-all"
                      style={{ background: bet === v ? "rgba(201,168,76,0.2)" : "rgba(201,168,76,0.06)", color: bet === v ? "#C9A84C" : "#6b5a3a", border: `1px solid ${bet === v ? "rgba(201,168,76,0.4)" : "rgba(201,168,76,0.1)"}` }}>
                      {Number(v).toLocaleString("ru")}
                    </button>
                  ))}
                </div>
                <div className="flex gap-1.5 mt-1.5">
                  <button onClick={() => setBet(String(Math.floor(Number(bet) / 2)))}
                    className="flex-1 py-1.5 rounded text-xs font-montserrat transition-all"
                    style={{ background: "rgba(201,168,76,0.06)", color: "#6b5a3a", border: "1px solid rgba(201,168,76,0.1)" }}>
                    ½
                  </button>
                  <button onClick={() => setBet(String(Number(bet) * 2))}
                    className="flex-1 py-1.5 rounded text-xs font-montserrat transition-all"
                    style={{ background: "rgba(201,168,76,0.06)", color: "#6b5a3a", border: "1px solid rgba(201,168,76,0.1)" }}>
                    ×2
                  </button>
                  <button onClick={() => setBet("MAX")}
                    className="flex-1 py-1.5 rounded text-xs font-montserrat transition-all"
                    style={{ background: "rgba(201,168,76,0.06)", color: "#6b5a3a", border: "1px solid rgba(201,168,76,0.1)" }}>
                    MAX
                  </button>
                </div>
              </div>

              <button onClick={playRound} disabled={gameLoading}
                className="btn-gold w-full py-4 rounded font-montserrat text-sm tracking-widest uppercase"
                style={{ opacity: gameLoading ? 0.6 : 1 }}>
                {gameLoading ? "Раунд идёт..." : "Сделать ставку"}
              </button>

              {currentUser && (
                <div className="rounded-lg p-3" style={{ background: "rgba(201,168,76,0.05)", border: "1px solid rgba(201,168,76,0.1)" }}>
                  <div className="font-montserrat text-xs mb-1" style={{ color: "#6b5a3a" }}>Баланс</div>
                  <div className="font-cormorant text-xl" style={{ color: "#C9A84C" }}>
                    {currentUser.balance.toLocaleString("ru")} ₽
                  </div>
                </div>
              )}

              {!currentUser && (
                <div className="rounded-lg p-3 text-center" style={{ background: "rgba(201,168,76,0.05)", border: "1px solid rgba(201,168,76,0.15)" }}>
                  <p className="font-montserrat text-xs mb-2" style={{ color: "#6b5a3a" }}>
                    Войдите для игры на реальные деньги
                  </p>
                  <button onClick={() => setPage("cabinet")} className="btn-gold px-4 py-2 rounded font-montserrat text-xs tracking-wider">
                    Войти / Регистрация
                  </button>
                </div>
              )}

              <div className="mt-auto">
                <div className="font-montserrat text-xs mb-2" style={{ color: "#3d3020" }}>Также открыты</div>
                <div className="flex flex-col gap-1.5">
                  {openTabs.filter(t => t.id !== activeGame.id).map(t => (
                    <button key={t.id} onClick={() => switchTab(t)}
                      className="flex items-center gap-2 px-3 py-2 rounded transition-all text-left"
                      style={{ background: "rgba(201,168,76,0.05)", border: "1px solid rgba(201,168,76,0.1)" }}>
                      <span>{t.icon}</span>
                      <span className="font-montserrat text-xs" style={{ color: "#a89060" }}>{t.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================== CABINET PAGE ===================== */}
      {page === "cabinet" && (
        <div className="pt-20 md:pt-24 min-h-screen">
          <div className="max-w-xl mx-auto px-6">

            {/* AUTH FORM — если не залогинен */}
            {!currentUser && (
              <div className="pt-10 animate-fade-in-up">
                <div className="text-center mb-8">
                  <p className="font-montserrat text-xs tracking-widest mb-2 uppercase" style={{ color: "#C9A84C" }}>Добро пожаловать</p>
                  <h2 className="font-cormorant text-4xl font-light" style={{ color: "#E8D5A3" }}>
                    {authTab === "login" ? "Вход в аккаунт" : "Регистрация"}
                  </h2>
                </div>

                <div className="rounded-xl overflow-hidden" style={{ background: "var(--dark-card)", border: "1px solid rgba(201,168,76,0.2)" }}>
                  <div className="flex border-b" style={{ borderColor: "rgba(201,168,76,0.15)" }}>
                    {([ ["login", "Войти"], ["register", "Создать аккаунт"] ] as const).map(([tab, label]) => (
                      <button key={tab} onClick={() => { setAuthTab(tab); setAuthError(""); }}
                        className="flex-1 py-4 font-montserrat text-sm tracking-wider transition-all"
                        style={{
                          color: authTab === tab ? "#C9A84C" : "#6b5a3a",
                          borderBottom: authTab === tab ? "2px solid #C9A84C" : "2px solid transparent",
                          background: authTab === tab ? "rgba(201,168,76,0.05)" : "transparent",
                        }}>
                        {label}
                      </button>
                    ))}
                  </div>

                  <div className="p-6 flex flex-col gap-4">
                    {authTab === "register" && (
                      <>
                        <div>
                          <label className="font-montserrat text-xs tracking-wider mb-1.5 block" style={{ color: "#6b5a3a" }}>EMAIL</label>
                          <input value={authEmail} onChange={e => setAuthEmail(e.target.value)}
                            placeholder="your@email.com" type="email"
                            className="w-full px-4 py-3 rounded font-montserrat text-sm outline-none"
                            style={{ background: "rgba(201,168,76,0.05)", border: "1px solid rgba(201,168,76,0.2)", color: "#E8D5A3" }}
                            onFocus={e => (e.target.style.borderColor = "#C9A84C")}
                            onBlur={e => (e.target.style.borderColor = "rgba(201,168,76,0.2)")} />
                        </div>
                        <div>
                          <label className="font-montserrat text-xs tracking-wider mb-1.5 block" style={{ color: "#6b5a3a" }}>ИМЯ ПОЛЬЗОВАТЕЛЯ</label>
                          <input value={authUsername} onChange={e => setAuthUsername(e.target.value)}
                            placeholder="Никнейм"
                            className="w-full px-4 py-3 rounded font-montserrat text-sm outline-none"
                            style={{ background: "rgba(201,168,76,0.05)", border: "1px solid rgba(201,168,76,0.2)", color: "#E8D5A3" }}
                            onFocus={e => (e.target.style.borderColor = "#C9A84C")}
                            onBlur={e => (e.target.style.borderColor = "rgba(201,168,76,0.2)")} />
                        </div>
                      </>
                    )}
                    {authTab === "login" && (
                      <div>
                        <label className="font-montserrat text-xs tracking-wider mb-1.5 block" style={{ color: "#6b5a3a" }}>EMAIL ИЛИ ЛОГИН</label>
                        <input value={authLogin} onChange={e => setAuthLogin(e.target.value)}
                          placeholder="Email или никнейм"
                          className="w-full px-4 py-3 rounded font-montserrat text-sm outline-none"
                          style={{ background: "rgba(201,168,76,0.05)", border: "1px solid rgba(201,168,76,0.2)", color: "#E8D5A3" }}
                          onFocus={e => (e.target.style.borderColor = "#C9A84C")}
                          onBlur={e => (e.target.style.borderColor = "rgba(201,168,76,0.2)")} />
                      </div>
                    )}
                    <div>
                      <label className="font-montserrat text-xs tracking-wider mb-1.5 block" style={{ color: "#6b5a3a" }}>ПАРОЛЬ</label>
                      <input value={authPassword} onChange={e => setAuthPassword(e.target.value)}
                        placeholder="Минимум 6 символов" type="password"
                        className="w-full px-4 py-3 rounded font-montserrat text-sm outline-none"
                        style={{ background: "rgba(201,168,76,0.05)", border: "1px solid rgba(201,168,76,0.2)", color: "#E8D5A3" }}
                        onFocus={e => (e.target.style.borderColor = "#C9A84C")}
                        onBlur={e => (e.target.style.borderColor = "rgba(201,168,76,0.2)")}
                        onKeyDown={e => e.key === "Enter" && handleAuth()} />
                    </div>

                    {authError && (
                      <div className="px-4 py-2 rounded text-sm font-montserrat"
                        style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#f87171" }}>
                        {authError}
                      </div>
                    )}

                    <button className="btn-gold w-full py-3.5 rounded font-montserrat text-sm tracking-widest uppercase mt-1"
                      onClick={handleAuth} disabled={authLoading}>
                      {authLoading ? "Загрузка..." : authTab === "login" ? "Войти" : "Зарегистрироваться"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* PROFILE — если залогинен */}
            {currentUser && (
              <div className="pt-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-8 animate-fade-in-up">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-cormorant font-bold animate-pulse-gold"
                      style={{ background: "linear-gradient(135deg, #1C1814, #2a2318)", border: "2px solid #C9A84C", color: "#C9A84C" }}>
                      {currentUser.username.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <h2 className="font-cormorant text-2xl font-medium" style={{ color: "#E8D5A3" }}>{currentUser.username}</h2>
                        <span className="px-2 py-0.5 rounded-full text-xs font-montserrat"
                          style={{ background: "rgba(201,168,76,0.2)", color: "#C9A84C", border: "1px solid rgba(201,168,76,0.3)" }}>
                          {currentUser.vip_level}
                        </span>
                      </div>
                      <div className="font-cormorant text-2xl animate-gold-shimmer">
                        {currentUser.balance.toLocaleString("ru")} ₽
                      </div>
                    </div>
                  </div>
                  <button onClick={logout} className="flex items-center gap-1.5 px-3 py-2 rounded font-montserrat text-xs transition-all"
                    style={{ color: "#6b5a3a", border: "1px solid rgba(201,168,76,0.15)" }}>
                    <Icon name="LogOut" size={13} />
                    Выйти
                  </button>
                </div>

                {/* Payment tabs */}
                <div className="rounded-xl overflow-hidden mb-6 animate-fade-in-up delay-100"
                  style={{ background: "var(--dark-card)", border: "1px solid rgba(201,168,76,0.2)" }}>
                  <div className="flex border-b" style={{ borderColor: "rgba(201,168,76,0.15)" }}>
                    {([ ["deposit", "Пополнить"], ["withdraw", "Вывести"] ] as const).map(([tab, label]) => (
                      <button key={tab} onClick={() => { setPayTab(tab); setDepositInfo(null); setDepositSent(false); }}
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
                    {/* DEPOSIT flow */}
                    {payTab === "deposit" && !depositInfo && (
                      <>
                        <label className="font-montserrat text-xs tracking-wider mb-2 block" style={{ color: "#6b5a3a" }}>СУММА (₽)</label>
                        <input type="number" value={amount} onChange={e => setAmount(e.target.value)}
                          placeholder="Минимум 100 ₽"
                          className="w-full px-4 py-3 rounded font-montserrat text-sm outline-none mb-2"
                          style={{ background: "rgba(201,168,76,0.05)", border: "1px solid rgba(201,168,76,0.2)", color: "#E8D5A3" }}
                          onFocus={e => (e.target.style.borderColor = "#C9A84C")}
                          onBlur={e => (e.target.style.borderColor = "rgba(201,168,76,0.2)")} />
                        <div className="flex gap-2 mb-5">
                          {["1000", "5000", "10000", "50000"].map(v => (
                            <button key={v} onClick={() => setAmount(v)}
                              className="flex-1 py-1.5 rounded text-xs font-montserrat transition-all"
                              style={{ background: "rgba(201,168,76,0.08)", color: "#a89060", border: "1px solid rgba(201,168,76,0.15)" }}>
                              {Number(v).toLocaleString("ru")}
                            </button>
                          ))}
                        </div>
                        <button className="btn-gold w-full py-3.5 rounded font-montserrat text-sm tracking-widest uppercase"
                          onClick={handleDeposit} disabled={depositLoading}>
                          {depositLoading ? "Создаю заявку..." : "Получить реквизиты"}
                        </button>
                      </>
                    )}

                    {/* Реквизиты для перевода */}
                    {payTab === "deposit" && depositInfo && !depositSent && (
                      <div className="animate-fade-in-up">
                        <p className="font-montserrat text-xs mb-4" style={{ color: "#a89060" }}>
                          Переведите точную сумму на карту и укажите код в комментарии:
                        </p>
                        <div className="rounded-lg p-4 mb-3" style={{ background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.25)" }}>
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <div className="font-montserrat text-xs mb-1" style={{ color: "#6b5a3a" }}>НОМЕР КАРТЫ · {BANK_NAME}</div>
                              <div className="font-cormorant text-2xl tracking-widest" style={{ color: "#E8C97A" }}>{CARD_NUMBER}</div>
                            </div>
                            <button onClick={copyCard} className="flex items-center gap-1.5 px-3 py-2 rounded font-montserrat text-xs transition-all"
                              style={{ background: copied ? "rgba(34,197,94,0.15)" : "rgba(201,168,76,0.1)", color: copied ? "#22c55e" : "#C9A84C", border: `1px solid ${copied ? "rgba(34,197,94,0.3)" : "rgba(201,168,76,0.2)"}` }}>
                              <Icon name={copied ? "Check" : "Copy"} size={13} />
                              {copied ? "Скопировано" : "Копировать"}
                            </button>
                          </div>
                          <div className="flex gap-4">
                            <div>
                              <div className="font-montserrat text-xs mb-0.5" style={{ color: "#6b5a3a" }}>СУММА</div>
                              <div className="font-cormorant text-xl" style={{ color: "#C9A84C" }}>{depositInfo.amount.toLocaleString("ru")} ₽</div>
                            </div>
                            <div>
                              <div className="font-montserrat text-xs mb-0.5" style={{ color: "#6b5a3a" }}>КОД В КОММЕНТАРИИ</div>
                              <div className="font-montserrat text-sm font-bold" style={{ color: "#E8C97A" }}>{depositInfo.payment_code}</div>
                            </div>
                          </div>
                        </div>
                        <div className="rounded-lg px-4 py-3 mb-4 flex items-start gap-2"
                          style={{ background: "rgba(234,179,8,0.08)", border: "1px solid rgba(234,179,8,0.2)" }}>
                          <Icon name="AlertCircle" size={14} style={{ color: "#eab308", flexShrink: 0, marginTop: 1 }} />
                          <p className="font-montserrat text-xs" style={{ color: "#a89060" }}>
                            Обязательно укажите код <strong style={{ color: "#E8C97A" }}>{depositInfo.payment_code}</strong> в комментарии к переводу — иначе пополнение не будет зачислено.
                          </p>
                        </div>
                        <div className="flex gap-3">
                          <button onClick={() => setDepositInfo(null)}
                            className="flex-1 py-3 rounded font-montserrat text-sm transition-all"
                            style={{ color: "#6b5a3a", border: "1px solid rgba(201,168,76,0.15)" }}>
                            Назад
                          </button>
                          <button onClick={handleConfirmSent} className="btn-gold flex-1 py-3 rounded font-montserrat text-sm tracking-wider">
                            Я оплатил ✓
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Подтверждение */}
                    {payTab === "deposit" && depositSent && (
                      <div className="text-center py-4 animate-fade-in-up">
                        <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                          style={{ background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)" }}>
                          <Icon name="Check" size={24} style={{ color: "#22c55e" }} />
                        </div>
                        <h3 className="font-cormorant text-2xl mb-2" style={{ color: "#E8D5A3" }}>Заявка принята</h3>
                        <p className="font-montserrat text-sm mb-5" style={{ color: "#6b5a3a" }}>
                          Обычно подтверждение занимает до 15 минут.<br />Баланс будет зачислен автоматически.
                        </p>
                        <button onClick={() => { setDepositInfo(null); setDepositSent(false); setAmount(""); }}
                          className="btn-gold px-6 py-2.5 rounded font-montserrat text-sm tracking-wider">
                          Новое пополнение
                        </button>
                      </div>
                    )}

                    {/* WITHDRAW */}
                    {payTab === "withdraw" && (
                      <>
                        <label className="font-montserrat text-xs tracking-wider mb-2 block" style={{ color: "#6b5a3a" }}>СУММА ВЫВОДА (₽)</label>
                        <input type="number" value={amount} onChange={e => setAmount(e.target.value)}
                          placeholder="Минимум 500 ₽"
                          className="w-full px-4 py-3 rounded font-montserrat text-sm outline-none mb-4"
                          style={{ background: "rgba(201,168,76,0.05)", border: "1px solid rgba(201,168,76,0.2)", color: "#E8D5A3" }}
                          onFocus={e => (e.target.style.borderColor = "#C9A84C")}
                          onBlur={e => (e.target.style.borderColor = "rgba(201,168,76,0.2)")} />
                        <div className="grid grid-cols-2 gap-2 mb-5">
                          {WITHDRAW_METHODS.map((m, i) => (
                            <div key={i} className="card-hover cursor-pointer rounded-lg p-3 flex items-center gap-3"
                              style={{ background: "rgba(201,168,76,0.05)", border: "1px solid rgba(201,168,76,0.15)" }}>
                              <span className="text-xl">{m.icon}</span>
                              <div>
                                <div className="font-montserrat text-xs font-medium" style={{ color: "#E8D5A3" }}>{m.label}</div>
                                <div className="font-montserrat text-xs" style={{ color: "#6b5a3a" }}>{m.min} · {m.time}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <button className="btn-gold w-full py-3.5 rounded font-montserrat text-sm tracking-widest uppercase">
                          Оформить вывод
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}