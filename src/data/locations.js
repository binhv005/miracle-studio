import { img } from './images.js'

// Location groups only — no specific venue names are claimed.
export const locations = [
  { id: 'beaches', title: 'Biển nhiệt đới' },
  { id: 'architecture', title: 'Kiến trúc châu Âu' },
  { id: 'resorts', title: 'Resort sang trọng' },
  { id: 'sunset', title: 'Hoàng hôn lãng mạn' },
]

// Photo row, in display order.
// w = desktop width (vw), mt = top offset (vw) for the staggered rhythm, deco = line ornament.
const tile = (key, alt, position, w, mt, ratio, deco) => ({ ...img[key], alt, position, w, mt, ratio, deco })

export const locationTiles = [
  tile('loc-beach-palm', 'Chú rể đứng cạnh cây dừa nghiêng trên bãi biển', '50% 50%', 12, 9, 'aspect-[3/4.4]'),
  tile('loc-beach-palms', 'Hai cây dừa và võng trên bãi cát trắng Phú Quốc', '50% 85%', 19, 5, 'aspect-[4/3]', 'bow-right'),
  tile('loc-euro-bridge', 'Cô dâu với váy đuôi dài trên cầu kiến trúc cổ điển', '45% 60%', 14, 0, 'aspect-[3/4.2]', 'bouquet-top'),
  tile('loc-euro-plaza', 'Cô dâu chú rể giữa quảng trường kiến trúc châu Âu', '60% 55%', 18, 3.5, 'aspect-[4/3]', 'sprig-bottom'),
  tile('loc-sunset-kiss', 'Cặp đôi hôn nhau trên biển lúc chạng vạng', '50% 40%', 12.5, 8, 'aspect-[3/4.2]'),
  tile('loc-resort-garden', 'Gia đình trong khu vườn nhiệt đới của resort', '50% 50%', 17.5, 1.5, 'aspect-[4/3]', 'bow-top'),
  tile('loc-sunset-palm', 'Bóng cặp đôi dưới tán dừa lúc mặt trời lặn', '50% 60%', 11.5, 7, 'aspect-[3/4.4]'),
]
