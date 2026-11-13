# Miracle Studio — Landing page

Landing page cho **MIRACLE STUDIO** – chụp ảnh cưới, sự kiện và cho thuê váy cưới tại Phú Quốc.

## Công nghệ

- React 18 + Vite 5
- Tailwind CSS 3
- Framer Motion, GSAP (ScrollTrigger, SplitText), Lenis (cuộn mượt)
- Lucide React (icon)
- Font tự host qua `@fontsource`: Great Vibes (tiêu đề), Playfair Display, Be Vietnam Pro

## Chạy dự án

```bash
npm install
npm run dev       # môi trường phát triển
npm run build     # build production vào dist/
npm run preview   # xem thử bản build
```

## Cấu trúc

```
src/
  components/        # mỗi section một file (Hero, About, Services, Locations, Portfolio, …)
    ui/              # primitives (Photo, Reveal, ImageReveal, Line, Marquee),
                     # LiquidImage (shader WebGL), CurvedCarousel (băng chuyền 3D)
  data/              # nội dung: site, services, locations, portfolio, testimonials, images
  lib/               # smooth.js (Lenis + cuộn về đầu trang), useK95Effects.js (hiệu ứng reveal)
  assets/images/     # ảnh đã tối ưu (WebP, 2 kích thước) + logo
public/              # favicon, ảnh Open Graph
LoGo/, SanPham/      # ảnh gốc của thương hiệu
```

## Ghi chú nội dung

- `src/data/testimonials.js`: chỉ thêm **đánh giá thật** của khách hàng; khi còn trống, section hiển thị tỷ lệ đề xuất trên Facebook.
- `src/data/site.js`: `whatsapp` để `null` cho tới khi studio xác nhận số WhatsApp.
- Form liên hệ chưa có backend: khi gửi, thông tin được tóm tắt để khách gửi qua Messenger hoặc gọi hotline (xem `src/components/Contact.jsx`).
