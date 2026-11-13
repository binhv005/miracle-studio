import { img } from './images.js'

// Only categories that have real photos in the brand folder are listed.
export const categories = [
  { id: 'all', label: 'Tất cả' },
  { id: 'prewedding', label: 'Ảnh cưới' },
  { id: 'family', label: 'Gia đình' },
  { id: 'event', label: 'Sự kiện' },
]

const p = (name, category, alt, position = '50% 50%') => ({ ...img[name], id: name, category, alt, position })

export const portfolio = [
  p('pf-sunset-couple', 'prewedding', 'Cặp đôi nắm tay trên biển hoàng hôn'),
  p('pf-family-beach', 'family', 'Gia đình nắm tay nhau đi dọc bờ biển'),
  p('pf-palm-swing', 'prewedding', 'Cô dâu ngồi xích đu dưới cây dừa'),
  p('pf-ring', 'prewedding', 'Cô gái khoe nhẫn cầu hôn trên biển'),
  p('pf-maternity', 'family', 'Ảnh bầu gia đình bên bờ biển'),
  p('pf-family-sunset', 'family', 'Bố cõng con trên vai lúc hoàng hôn'),
  p('pf-anniversary', 'prewedding', 'Cặp đôi kỷ niệm 5 năm bên bóng bay lúc hoàng hôn'),
  p('pf-group-event', 'event', 'Nhóm gia đình lớn trong trang phục trắng tại studio'),
  p('pf-palm-sunset', 'prewedding', 'Cặp đôi dưới cây dừa nghiêng trên bãi biển'),
  p('pf-family-shore', 'family', 'Gia đình dạo bước trên bờ biển chiều'),
  p('pf-bw-kiss', 'prewedding', 'Ảnh đen trắng cặp đôi hôn nhau, khoe nhẫn'),
  p('pf-family-waves', 'family', 'Gia đình ngắm sóng biển chiều'),
  p('pf-family-fun', 'family', 'Gia đình vui đùa trên bãi biển'),
  p('pf-kids-grass', 'family', 'Hai chị em ngồi trên bãi cỏ nhìn ra biển'),
  p('pf-family-pier', 'family', 'Gia đình ngắm hoàng hôn bên cây cầu'),
  p('pf-mother-child', 'family', 'Mẹ bế con trên biển hoàng hôn'),
  p('pf-family-home', 'family', 'Gia đình trong căn phòng sang trọng'),
  p('pf-family-lawn', 'family', 'Gia đình năm người trên bãi cỏ'),
]
