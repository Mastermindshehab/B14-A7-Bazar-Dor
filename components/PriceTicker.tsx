
const tickerItems = [
  { emoji: "🍚", name: "মিনিকেট চাল", price: "৭০ টাকা/কেজি", change: "▲ ২.১%", up: true },
  { emoji: "🧅", name: "পেঁয়াজ", price: "৬০ টাকা/কেজি", change: "▼ ২.৯%", up: false },
  { emoji: "🥔", name: "আলু", price: "৩০ টাকা/কেজি", change: "▼ ১.৫%", up: false },
  { emoji: "🐟", name: "রুই মাছ", price: "৩৫০ টাকা/কেজি", change: "▲ ১.২%", up: true },
  { emoji: "🥚", name: "ডিম", price: "১৫০ টাকা/ডজন", change: "— ০.০%", up: null },
];

export default function PriceTicker() {
  const items = [...tickerItems, ...tickerItems];

  return (
    <div className="ticker border-b border-[#e3eae3] bg-white">
      <div className="ticker-track flex w-max items-center">
        {items.map((item, index) => (
          <div
            key={`${item.name}-${index}`}
            className="flex items-center gap-2 border-r border-gray-100 px-4 py-3 text-xs"
          >
            <span>{item.emoji}</span>
            <span className="font-medium text-gray-700">
              {item.name}
            </span>
            <span className="text-gray-500">
              {item.price}
            </span>
            <span
              className={
                item.up === true
                  ? "font-bold text-red-600"
                  : item.up === false
                    ? "font-bold text-green-700"
                    : "font-bold text-gray-400"
              }
            >
              {item.change}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
