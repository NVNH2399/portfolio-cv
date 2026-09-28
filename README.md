# Portfolio + CV — Nguyễn Văn Ngọc Hãi

Next.js (App Router) + TypeScript + Tailwind CSS v4 + Prisma + PostgreSQL.

Một codebase, hai trang công khai (`/` portfolio, `/cv` CV song ngữ có nút in/PDF)
và một khu vực quản trị (`/admin`) để sửa dữ liệu — không cần đụng code hay sửa
tay file JSON nữa.

## 1. Cài đặt lần đầu

```bash
npm install --legacy-peer-deps
```

> Dùng `--legacy-peer-deps` vì một vài gói (đặc biệt là Prisma bản mới) hiện
> khai báo peer dependency hơi chặt so với React 19 — không ảnh hưởng gì đến
> hoạt động thực tế của dự án.

## 2. Tạo database free (Neon)

1. Vào https://neon.tech, đăng ký free, tạo 1 project mới.
2. Copy "Connection string" (dạng `postgresql://...`).
3. Copy file `.env.example` thành `.env`, dán connection string vào `DATABASE_URL`.
4. Tạo thêm `SESSION_SECRET` bằng lệnh: `openssl rand -base64 32` (hoặc chuỗi
   ngẫu nhiên dài bất kỳ), dán vào `.env`.
5. Đặt `SEED_ADMIN_USERNAME` / `SEED_ADMIN_PASSWORD` — đây sẽ là tài khoản
   đăng nhập trang `/admin` sau khi seed.

> **Lưu ý (Prisma 7):** kể từ Prisma 7, connection URL không còn khai báo
> trong `schema.prisma` nữa mà nằm ở `prisma.config.ts` (dùng cho CLI:
> migrate, studio...), còn lúc chạy thật `PrismaClient` kết nối DB qua
> "driver adapter" (`@prisma/adapter-pg`) khai báo trong `src/lib/prisma.ts`.
> Cả 2 chỗ đều đọc chung biến `DATABASE_URL` trong `.env`, bạn chỉ cần điền
> đúng 1 chỗ trong `.env` là đủ, không cần sửa gì thêm.

## 3. Khởi tạo bảng + đổ dữ liệu mẫu

> **Đã chạy `migrate dev` từ trước rồi?** Schema vừa có thêm bảng `Media` và vài
> field ảnh mới (`Certificate.imageUrl`, `Achievement.imageUrl`) — chỉ cần chạy
> lại đúng 2 lệnh sau (không cần `--name init` nữa, đặt tên khác cho migration
> mới, và **không cần seed lại**, dữ liệu cũ vẫn giữ nguyên):
> ```bash
> npx prisma generate
> npx prisma migrate dev --name add-media-and-images
> ```
> Còn nếu đây là lần đầu setup thì làm theo đủ 3 lệnh bên dưới như bình thường.

```bash
npx prisma generate
npx prisma migrate dev --name init
npm run prisma:seed
```

Lệnh seed sẽ đổ sẵn đúng nội dung CV hiện tại của bạn vào DB (Profile, Học vấn,
Kinh nghiệm, 5 dự án, Kỹ năng, Chứng chỉ) để bạn có ngay giao diện để xem, rồi
sửa dần qua `/admin` thay vì code từ con số 0.

## 3.5. Upload ảnh/video (Vercel Blob)

Tính năng kéo-thả ảnh/video trong `/admin` (ảnh đại diện, ảnh bìa dự án, gallery
dự án, ảnh chứng chỉ...) lưu file qua **Vercel Blob** — free, tích hợp sẵn với
Next.js, không cần server riêng.

**Cách lấy token (cần làm 1 lần):**

1. Đẩy code lên GitHub và import vào Vercel trước (xem mục 6 bên dưới) — Blob
   store gắn liền với 1 project trên Vercel, nên cần project đó tồn tại trước.
2. Vào project trên https://vercel.com → tab **Storage** → **Create Database**
   → chọn **Blob** → đặt tên bất kỳ → Create.
3. Vercel tự thêm biến `BLOB_READ_WRITE_TOKEN` vào Environment Variables của
   project trên Vercel (cho môi trường production).
4. Để chạy **local** cũng upload được: chạy `npx vercel link` (nối thư mục này
   với đúng project vừa tạo), rồi `npx vercel env pull .env.local` để tự động
   tải biến `BLOB_READ_WRITE_TOKEN` về máy. Next.js sẽ tự đọc `.env.local`.

Chưa setup Blob thì toàn bộ trang vẫn chạy bình thường — chỉ riêng nút upload
ảnh/video sẽ báo lỗi "Upload thất bại" cho tới khi có token.

## 3.6. Chế độ sáng / tối

Nút bật/tắt nằm ở góc phải thanh điều hướng của portfolio (`/`), áp dụng cho cả
trang chủ. Lựa chọn được lưu vào `localStorage` của trình duyệt nên lần sau
vào lại vẫn giữ nguyên. Trang `/cv` và toàn bộ khu vực `/admin` **cố định
sáng** — CV cần trông giống hệt bản in, còn admin là công cụ nội bộ nên không
cần đổi màu.



```bash
npm run dev
```

- `http://localhost:3000` — trang portfolio
- `http://localhost:3000/cv` — trang CV (nút "In / PDF" ở góc trên)
- `http://localhost:3000/admin` — đăng nhập bằng `SEED_ADMIN_USERNAME` / `SEED_ADMIN_PASSWORD`

## 5. Kiến trúc admin — "config-driven CRUD"

Thay vì viết riêng 1 trang + 1 API cho mỗi loại dữ liệu (Học vấn, Kinh nghiệm,
Dự án, Kỹ năng, Chứng chỉ...), toàn bộ field của từng loại được khai báo MỘT
LẦN DUY NHẤT trong `src/lib/resources.ts`. Một bộ trang generic
(`src/app/admin/[resource]/...`) và API generic (`src/app/api/[resource]/...`)
đọc config đó để tự sinh ra form + bảng danh sách + API CRUD.

Muốn thêm 1 loại dữ liệu mới: thêm model vào `prisma/schema.prisma`, migrate,
rồi thêm 1 entry vào `RESOURCES` trong `resources.ts` — không cần viết thêm
trang hay route nào cả.

`Profile` là bảng đặc biệt (chỉ có 1 record) nên có trang + API riêng
(`/admin/profile`, `/api/profile`) thay vì theo pattern generic ở trên.

## 6. Deploy free lên Vercel

1. Đẩy code lên GitHub.
2. Vào https://vercel.com → New Project → import repo này.
3. Ở phần Environment Variables, khai báo đúng các biến trong `.env`
   (`DATABASE_URL`, `SESSION_SECRET`).
4. Deploy. Build command mặc định (`prisma generate && next build`) đã được
   cấu hình sẵn trong `package.json`.
5. Sau lần deploy đầu tiên, chạy migrate + seed nhắm vào DB Neon production
   (chạy trên máy bạn, trỏ `DATABASE_URL` production):
   ```bash
   npx prisma migrate deploy
   npm run prisma:seed
   ```

## 7. Việc còn cần làm tiếp (gợi ý bước sau)

> **Vừa thêm bảng `HomeSection` (mục "Bố cục trang chủ" trong admin).** Chạy
> `npx prisma generate` rồi `npx prisma db push` như mọi lần đổi schema. Nếu
> database đã có dữ liệu từ trước (không chạy lại seed), tự thêm 4 dòng mặc
> định bằng SQL sau (chạy 1 lần, qua Neon SQL Editor hoặc `psql`):
> ```sql
> INSERT INTO "HomeSection" (key, "labelVi", visible, "order") VALUES
>   ('cover', 'Trang bìa', true, 1),
>   ('intro', 'Giới thiệu', true, 2),
>   ('projects', 'Dự án', true, 3),
>   ('skills', 'Kỹ năng', true, 4)
> ON CONFLICT (key) DO NOTHING;
> ```
> Không chạy SQL này thì trang chủ vẫn tự dùng thứ tự mặc định (không lỗi),
> chỉ là trang `/admin/sections` sẽ hiện danh sách trống cho tới khi có dữ liệu.


- Viết lại nội dung Profile/summary bằng giọng văn của riêng bạn thay vì giữ
  nguyên bản seed.
- Thêm ảnh thật cho từng dự án (`coverImage`) và hiển thị trên trang chủ.
- Cân nhắc thêm xác thực 2 lớp hoặc rate-limit cho `/admin/login` nếu domain
  công khai lâu dài.
- Viết thêm 1-2 bullet điểm nổi bật (Achievements) qua `/admin/achievements`.

## Lưu ý về môi trường code hiện tại

Codebase này được viết trong 1 sandbox không có quyền truy cập
`binaries.prisma.sh`, nên chưa chạy được `prisma generate`/`migrate`/`build`
đầy đủ để tự kiểm chứng runtime tại đây. Đã kiểm tra thủ công: tên field khớp
giữa `schema.prisma`, `seed.ts`, các component; type-check bằng `tsc --noEmit`
không phát hiện lỗi nào ngoài các lỗi "no exported member" do thiếu Prisma
Client generate (sẽ tự hết khi bạn chạy bước 1-3 ở trên). Nếu gặp lỗi khi
chạy thật, gửi lại thông báo lỗi để mình fix tiếp.
