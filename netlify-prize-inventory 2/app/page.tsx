'use client';
import { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  Boxes,
  Fish,
  Gift,
  LayoutDashboard,
  LibraryBig,
  PackagePlus,
  PackageOpen,
  Search,
  Settings,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
type Prize = {
  sku: string;
  name: string;
  category: string;
  points: number;
  stock: number;
  recent: number;
  color: string;
  emoji: string;
  floor?: string;
  side?: string;
};
const prizes: Prize[] = [
  {
    sku: 'G001',
    name: '鯨魚抱枕',
    category: '絨毛玩具',
    points: 50,
    stock: 9,
    recent: 3,
    color: '#DDEFE8',
    emoji: '🐋',
  },
  {
    sku: 'G002',
    name: '海洋貼紙組',
    category: '文具',
    points: 10,
    stock: 22,
    recent: 28,
    color: '#FFF0C2',
    emoji: '🐠',
  },
  {
    sku: 'G003',
    name: '企鵝保溫杯',
    category: '生活用品',
    points: 80,
    stock: 6,
    recent: 4,
    color: '#E6ECF8',
    emoji: '🐧',
  },
  {
    sku: 'G004',
    name: '珊瑚礁拼圖',
    category: '益智玩具',
    points: 40,
    stock: 13,
    recent: 5,
    color: '#FBE6DE',
    emoji: '🧩',
  },
  {
    sku: 'G005',
    name: '海豚鑰匙圈',
    category: '飾品',
    points: 20,
    stock: 16,
    recent: 14,
    color: '#E3F0F5',
    emoji: '🐬',
  },
  {
    sku: 'G006',
    name: '水母夜燈',
    category: '生活用品',
    points: 100,
    stock: 4,
    recent: 4,
    color: '#EEE5F6',
    emoji: '🪼',
  },
];
export default function Home() {
  const [active, setActive] = useState('dashboard');
  const [query, setQuery] = useState('');
  const [notice, setNotice] = useState('');
  const [rows, setRows] = useState<Prize[]>([]);
  const [connected, setConnected] = useState(false);
  useEffect(() => {
    fetch('/api/inventory')
      .then((r) => r.json())
      .then((d) => {
        if (d.connected) {
          setRows(d.items || []);
          setConnected(true);
        }
      })
      .catch(() => {});
  }, []);
  const low = rows.filter((p) => p.stock <= 5);
  const hot = [...rows].sort((a, b) => b.recent - a.recent).slice(0, 4);
  const filtered = useMemo(
    () =>
      rows.filter((p) =>
        (p.name + p.sku + p.category + (p.floor || '') + (p.side || ''))
          .toLowerCase()
          .includes(query.toLowerCase()),
      ),
    [query, rows],
  );
  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">
            <Fish size={22} />
          </span>
          <div>
            <strong>魚章獎品櫃</strong>
            <small>庫存管理中心</small>
          </div>
        </div>
        <nav>
          {[
            ['dashboard', '總覽', LayoutDashboard],
            ['cabinet', '獎品櫃現況', LibraryBig],
            ['incoming', '進貨登錄', PackageOpen],
            ['shelf', '盤點補架', PackagePlus],
            ['inventory', '庫存總表', Boxes],
            ['settings', '連線設定', Settings],
          ].map(([id, label, Icon]: any) => (
            <button
              key={id}
              className={active === id ? 'active' : ''}
              onClick={() => setActive(id)}
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
        </nav>
        <div className="sync-card">
          <span className={connected ? 'dot' : 'dot amber'} />
          <div>
            <b>{connected ? 'Google Sheet 同步中' : 'Google Sheet 已建立'}</b>
            <small>{connected ? '資料會自動更新' : '等待啟用網站同步'}</small>
          </div>
        </div>
      </aside>
      <section className="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">PRIZE INVENTORY</p>
            <h1>
              {active === 'dashboard'
                ? '今天的獎品櫃'
                : active === 'cabinet'
                  ? '虛擬獎品櫃'
                : active === 'incoming'
                  ? '新品進貨登錄'
                : active === 'shelf'
                  ? '先盤點，再補架'
                  : active === 'inventory'
                    ? '所有庫存'
                    : 'Google Sheet 連線'}
            </h1>
          </div>
          <div className="date-pill">2026 年 9 月 10 日</div>
        </header>
        {notice && <div className="toast">✓ {notice}</div>}
        {active === 'dashboard' && <Dashboard hot={hot} low={low} all={rows} />}{' '}
        {active === 'cabinet' && <VirtualCabinet prizes={rows} />}
        {active === 'incoming' && <IncomingForm prizes={rows} onDone={(m)=>{setNotice(m);setTimeout(()=>setNotice(''),2800)}} />}
        {active === 'shelf' && (
          <ShelfForm
            prizes={rows}
            onDone={(m: string) => {
              setNotice(m);
              setTimeout(() => setNotice(''), 2800);
            }}
          />
        )}
        {active === 'inventory' && (
          <Inventory rows={filtered} query={query} setQuery={setQuery} />
        )}{' '}
        {active === 'settings' && <Connect connected={connected} />}
      </section>
    </main>
  );
}
function Dashboard({ hot, low, all }: { hot: Prize[]; low: Prize[]; all: Prize[] }) {
  return (
    <>
      <div className="metrics">
        <article>
          <span className="metric-icon green">
            <Gift />
          </span>
          <div>
            <small>啟用品項</small>
            <strong>{all.length}</strong>
            <em>共 {all.reduce((sum, prize) => sum + prize.stock, 0)} 件禮物</em>
          </div>
        </article>
        <article>
          <span className="metric-icon yellow">
            <Sparkles />
          </span>
          <div>
            <small>本週已上架</small>
            <strong>{all.reduce((sum, prize) => sum + prize.recent, 0)}</strong>
            <em>依目前試算表資料</em>
          </div>
        </article>
        <article>
          <span className="metric-icon coral">
            <AlertTriangle />
          </span>
          <div>
            <small>需要補貨</small>
            <strong>{low.length}</strong>
            <em>庫存 ≤ 5 件</em>
          </div>
        </article>
      </div>
      <div className="section-heading">
        <div>
          <p className="eyebrow">RECENTLY LOVED</p>
          <h2>近期熱銷</h2>
        </div>
        <span>
          <TrendingUp size={16} /> 近 30 天
        </span>
      </div>
      <div className="gift-grid">
        {hot.map((p, i) => (
          <article className="gift-card" key={p.sku}>
            <div className="gift-art" style={{ background: p.color }}>
              <span>{p.emoji}</span>
              {i === 0 && <b>TOP 1</b>}
            </div>
            <div className="gift-copy">
              <small>{p.category}</small>
              <h3>{p.name}</h3>
              <div>
                <span>
                  <Fish size={15} />
                  {p.points} 魚章
                </span>
                <em>{p.recent} 件上架</em>
              </div>
            </div>
          </article>
        ))}
      </div>
      <div className="low-panel">
        <div>
          <span className="metric-icon coral">
            <AlertTriangle />
          </span>
          <div>
            <p className="eyebrow">LOW STOCK</p>
            <h2>快沒庫存了</h2>
            <small>建議安排下一批進貨</small>
          </div>
        </div>
        {low.map((p) => (
          <div className="low-item" key={p.sku}>
            <span>{p.emoji}</span>
            <div>
              <b>{p.name}</b>
              <small>
                {p.sku} · {p.category}
              </small>
            </div>
            <strong>
              {p.stock}
              <small>件</small>
            </strong>
            <button onClick={() => alert('請到進貨紀錄登錄補貨')}>
              安排補貨
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
function VirtualCabinet({ prizes }: { prizes: Prize[] }) {
  const floors = [
    { level: '第 4 層', left: { label: '驚喜尋寶', skus: ['G004'] }, right: { label: '人氣收藏', skus: ['G001'] } },
    { level: '第 3 層', left: { label: '季節限定', skus: [] as string[] }, right: { label: '曼波魚限定', skus: [] as string[] } },
    { level: '第 2 層', left: { label: '生活用品', skus: ['G003','G006'] }, right: { label: '音樂星球', skus: [] as string[] } },
    { level: '第 1 層', left: { label: '文具用品', skus: ['G002'] }, right: { label: '舒壓小物', skus: ['G005'] } },
  ];
  return (
    <div className="cabinet-layout">
      <section className="virtual-cabinet">
        <div className="cabinet-top">
          <div><p className="eyebrow">LIVE CABINET</p><h2>架上有什麼</h2></div>
          <span className="cabinet-badge">4 層 · {prizes.length} 品項</span>
        </div>
        <div className="cabinet-frame">
          {floors.map((floor) => {
            return <article className="cabinet-floor" key={floor.level}>
              <header><b>{floor.level}</b><span>左區／右區</span></header>
              <div className="floor-sides">{(['left','right'] as const).map((side) => {
                const zone = floor[side];
                const items = prizes.filter((p) => zone.skus.includes(p.sku));
                return <section className="floor-zone" key={side}>
                  <h3><span>{side === 'left' ? '左' : '右'}</span>{zone.label}</h3>
                  <div className="floor-items">{items.length ? items.map((p) => {
                    const onShelf = Math.min(p.stock, p.sku === 'G002' ? 7 : p.sku === 'G005' ? 6 : p.sku === 'G006' ? 2 : p.sku === 'G004' ? 4 : p.sku === 'G003' ? 4 : 3);
                    return <div className="shelf-prize" key={p.sku}>
                      <span className="shelf-emoji" style={{background:p.color}}>{p.emoji}</span>
                      <div><b>{p.name}</b><small>{p.points} 魚章</small></div>
                      <strong className={onShelf <= 3 ? 'danger-count' : ''}>{onShelf}<small>架上</small></strong>
                    </div>
                  }) : <div className="empty-zone">尚未放置禮物</div>}</div>
                </section>
              })}</div>
            </article>
          })}
        </div>
      </section>
      <aside className="reference-card">
        <img src="/cabinet-reference.jpeg" alt="實體獎品櫃參考照片" />
        <div><p className="eyebrow">REAL CABINET</p><h3>實體櫃參考</h3><p>虛擬層架依照照片由上到下排列，方便現場人員直接對照盤點。</p></div>
      </aside>
    </div>
  );
}
const categoryRules = [
  { words: ['曼波魚','曼波','翻車魚'], category: '曼波魚限定', floor: '第3層', side: '右' },
  { words: ['音樂','樂器','音符','喇叭','耳機','鈴鼓'], category: '音樂星球', floor: '第2層', side: '右' },
  { words: ['季節','限定','聖誕','新年','端午','中秋','萬聖'], category: '季節限定', floor: '第3層', side: '左' },
  { words: ['驚喜','盲盒','尋寶','福袋','神秘','拼圖','玩具'], category: '驚喜尋寶', floor: '第4層', side: '左' },
  { words: ['熱門','人氣','收藏','公仔','抱枕'], category: '人氣收藏', floor: '第4層', side: '右' },
  { words: ['筆','貼紙','尺','橡皮擦','筆記本','文具'], category: '文具用品', floor: '第1層', side: '左' },
  { words: ['舒壓','捏捏','鑰匙圈','吊飾','療癒'], category: '舒壓小物', floor: '第1層', side: '右' },
  { words: ['杯','燈','盒','袋','毛巾','生活'], category: '生活用品', floor: '第2層', side: '左' },
];
function detectPlacement(name:string){return categoryRules.find(r=>r.words.some(w=>name.includes(w)))||{category:'待確認',floor:'未指定',side:'未指定'}}
function nextSku(prizes: Prize[]){const max=Math.max(0,...prizes.map(p=>Number(p.sku.match(/\d+/)?.[0]||0)));return `G${String(max+1).padStart(3,'0')}`}
function prizePlacement(p: Prize){return p.floor&&p.side?{floor:p.floor,side:p.side,category:p.category}:detectPlacement(p.name)}
function IncomingForm({prizes,onDone}:{prizes:Prize[];onDone:(m:string)=>void}){
  const [name,setName]=useState('曼波魚小吊飾');
  const [override,setOverride]=useState('');
  const suggestion=detectPlacement(name);
  const selected=override?categoryRules.find(r=>r.category===override)||suggestion:suggestion;
  const sku=nextSku(prizes);
  return <div className="form-layout"><form className="entry-card" onSubmit={async e=>{e.preventDefault();const fd=new FormData(e.currentTarget);await fetch('/api/inventory',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({action:'incoming',name,category:selected.category,floor:selected.floor,side:selected.side,sku,qty:Number(fd.get('qty')),price:Number(fd.get('price')),note:fd.get('note')})});onDone(`${sku} · ${name} 已建立，請放在 ${selected.floor}${selected.side}區`);}}><p className="eyebrow">SMART RECEIVING</p><h2>輸入品名，自動找位置</h2><p>系統會自動產生 SKU，並依「分類規則」建議獎品櫃位置。</p><label>禮物品名<input value={name} onChange={e=>{setName(e.target.value);setOverride('')}} placeholder="例如：曼波魚小吊飾"/></label><div className="split"><label>SKU（自動編號）<input value={sku} readOnly/></label><label>進貨數量<input name="qty" type="number" min="1" defaultValue="10" required/></label></div><label>進貨單價（元）<input name="price" type="number" min="0" defaultValue="90" required/></label><label>人工調整分類<select value={override} onChange={e=>setOverride(e.target.value)}><option value="">使用自動偵測</option>{categoryRules.map(r=><option key={r.category}>{r.category}</option>)}</select></label><label>備註<textarea name="note" placeholder="選填"/></label><button className="primary" type="submit"><PackageOpen size={18}/>確認進貨</button></form><aside className="placement-preview"><div className="detect-icon">✨</div><p className="eyebrow">CABINET PLACEMENT</p><h3>{selected.category}</h3><div className="placement-route"><span>{selected.floor}</span><b>→</b><span>{selected.side}區</span></div><dl><div><dt>自動 SKU</dt><dd>{sku}</dd></div><div><dt>偵測依據</dt><dd>{name?categoryRules.find(r=>r.category===suggestion.category)?.words.filter(w=>name.includes(w)).join('、')||'沒有符合關鍵字':'等待輸入'}</dd></div></dl></aside></div>
}
function ShelfForm({
  prizes,
  onDone,
}: {
  prizes: Prize[];
  onDone: (m: string) => void;
}) {
  const [sku, setSku] = useState(prizes[0]?.sku || '');
  const [qty, setQty] = useState(1);
  const [previous, setPrevious] = useState(5);
  const [remaining, setRemaining] = useState(3);
  const [pending, setPending] = useState(false);
  const p = prizes.find((x) => x.sku === sku) || prizes[0];
  if (!p) return null;
  const placement = prizePlacement(p);
  return (
    <div className="form-layout">
      <form
        className="entry-card"
        onSubmit={async (e) => {
          e.preventDefault();
          setPending(true);
          const fd = new FormData(e.currentTarget);
          try {
            const r = await fetch('/api/inventory', {
              method: 'POST',
              headers: { 'content-type': 'application/json' },
              body: JSON.stringify({
                week: fd.get('week'),
                date: fd.get('date'),
                sku,
                qty,
                previous,
                remaining,
                redeemed: Math.max(0, previous - remaining),
                staff: fd.get('staff'),
                note: fd.get('note'),
              }),
            });
            const d = await r.json();
            onDone(
              d.connected
                ? `${p.name} 盤點完成：換走 ${Math.max(0, previous - remaining)} 件，補上 ${qty} 件`
                : `${p.name} 已完成盤點示範；啟用連線後才會寫回`,
            );
          } finally {
            setPending(false);
          }
        }}
      >
        <p className="eyebrow">COUNT BEFORE RESTOCK</p>
        <h2>盤點架上數量</h2>
        <p>先填實際剩餘，系統算出被換走數量；確認後再填本次補上幾件。</p>
        <label>
          所屬週一
          <input name="week" type="date" defaultValue="2026-09-07" />
        </label>
        <label>
          上架日期
          <input name="date" type="date" defaultValue="2026-09-10" />
        </label>
        <label>
          禮物
          <select value={sku} onChange={(e) => setSku(e.target.value)}>
            {prizes.map((x) => (
              <option key={x.sku} value={x.sku}>
                {x.sku} · {x.name}
              </option>
            ))}
          </select>
        </label>
        <div className="audit-flow">
          <label>① 上次架上數<input min="0" type="number" value={previous} onChange={(e)=>setPrevious(Number(e.target.value))}/></label>
          <label>② 實際盤點剩餘<input min="0" max={previous} type="number" value={remaining} onChange={(e)=>setRemaining(Number(e.target.value))}/></label>
          <div className="calculated-count"><small>③ 被換走</small><strong>{Math.max(0, previous - remaining)} 件</strong></div>
        </div>
        <div className="split">
          <label>
            ④ 本次補上
            <input
              min="1"
              max={p.stock}
              type="number"
              value={qty}
              onChange={(e) => setQty(Number(e.target.value))}
            />
          </label>
          <label>
            經手人
            <input name="staff" placeholder="輸入姓名" defaultValue="小美" />
          </label>
        </div>
        <label>
          備註
          <textarea name="note" placeholder="選填，例如：放在上層右側" />
        </label>
        <button className="primary" disabled={pending} type="submit">
          <PackagePlus size={18} />
          {pending ? '正在同步…' : '確認盤點並補架'}
        </button>
      </form>
      <aside className="prize-preview">
        <div className="big-emoji" style={{ background: p.color }}>
          {p.emoji}
        </div>
        <p className="eyebrow">SELECTED PRIZE</p>
        <h3>{p.name}</h3>
        <span>
          {p.sku} · {p.category}
        </span>
        <div className="placement-route"><span>{placement.floor}</span><b>→</b><span>{placement.side}區</span></div>
        <dl>
          <div>
            <dt>兌換點數</dt>
            <dd>
              <Fish size={16} />
              {p.points}
            </dd>
          </div>
          <div>
            <dt>目前庫存</dt>
            <dd>{p.stock} 件</dd>
          </div>
          <div>
            <dt>被換走</dt>
            <dd>{Math.max(0, previous - remaining)} 件</dd>
          </div>
          <div>
            <dt>補後架上</dt>
            <dd className={remaining + qty <= 3 ? 'warn' : ''}>
              {remaining + qty} 件
            </dd>
          </div>
        </dl>
      </aside>
    </div>
  );
}
function Inventory({
  rows,
  query,
  setQuery,
}: {
  rows: Prize[];
  query: string;
  setQuery: (s: string) => void;
}) {
  return (
    <div className="table-card">
      <div className="table-tools">
        <div>
          <p className="eyebrow">ALL PRIZES</p>
          <h2>庫存總表</h2>
        </div>
        <label className="search">
          <Search size={17} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜尋名稱、SKU 或類別"
          />
        </label>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>禮物</th>
              <th>SKU</th>
              <th>類別</th>
              <th>獎品櫃位置</th>
              <th>魚章點數</th>
              <th>近 30 天</th>
              <th>目前庫存</th>
              <th>狀態</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <tr key={p.sku}>
                <td>
                  <span className="mini-emoji" style={{ background: p.color }}>
                    {p.emoji}
                  </span>
                  <b>{p.name}</b>
                </td>
                <td>{p.sku}</td>
                <td>{p.category}</td>
                <td><span className="cabinet-location">{prizePlacement(p).floor} · {prizePlacement(p).side}區</span></td>
                <td>
                  <span className="points">
                    <Fish size={14} />
                    {p.points}
                  </span>
                </td>
                <td>{p.recent} 件</td>
                <td>
                  <strong>{p.stock}</strong> 件
                </td>
                <td>
                  <span className={p.stock <= 5 ? 'status low' : 'status'}>
                    {p.stock <= 5 ? '低庫存' : '正常'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
function Connect({ connected }: { connected: boolean }) {
  return (
    <div className="connect-card">
      <span className="connect-icon">
        <Settings />
      </span>
      <p className="eyebrow">ONE-TIME SETUP</p>
      <h2>開啟即時同步</h2>
      <p>
        試算表已經建立。由於 Google
        會保護私人資料，網站正式寫入前需要在試算表做一次授權連線。
      </p>
      <ol>
        <li>在試算表開啟「擴充功能 → Apps Script」</li>
        <li>貼上我附給你的同步程式並部署為網路應用程式</li>
        <li>把部署網址填到網站的環境設定後重新發布</li>
      </ol>
      <div className="connection-row">
        <span className={connected ? 'dot' : 'dot amber'} />
        <div>
          <b>目前：{connected ? '即時同步' : '展示模式'}</b>
          <small>
            {connected
              ? '網站正在讀寫 Google Sheet'
              : '畫面與操作已完成，尚未寫回 Google Sheet'}
          </small>
        </div>
      </div>
    </div>
  );
}
