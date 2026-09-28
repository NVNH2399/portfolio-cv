// Cấu hình "config-driven" cho các mục CRUD trong /admin.
// Thay vì viết riêng 1 trang + 1 API cho từng loại dữ liệu (education, experience,
// projects...), ta mô tả field của từng loại 1 lần ở đây, rồi 1 bộ trang/API
// generic (xem src/app/admin/[resource] và src/app/api/[resource]) đọc config
// này để tự sinh form + bảng danh sách.
//
// Muốn thêm 1 loại dữ liệu mới: thêm 1 field vào Prisma schema, rồi thêm 1 entry
// vào RESOURCES bên dưới — không cần viết thêm trang hay API route nào.

export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "date"
  | "tags" // nhập cách nhau bằng dấu phẩy -> lưu thành mảng string
  | "lines" // mỗi dòng 1 phần tử -> lưu thành mảng string
  | "checkbox"
  | "select"
  | "image"; // upload kéo-thả, lưu URL trả về từ /api/upload

export interface FieldConfig {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: { value: string; label: string }[]; // dùng cho type "select"
  helpText?: string;
}

export interface ResourceConfig {
  /** Tên hiển thị số nhiều, vd "Học vấn" */
  label: string;
  /** Tên prisma model tương ứng, vd "education" -> prisma.education */
  model: string;
  fields: FieldConfig[];
  /** Field dùng làm cột hiển thị trong bảng danh sách admin */
  listColumns: string[];
}

export const RESOURCES: Record<string, ResourceConfig> = {
  education: {
    label: "Học vấn",
    model: "education",
    listColumns: ["school", "degreeVi"],
    fields: [
      { key: "school", label: "Trường", type: "text", required: true },
      { key: "degreeVi", label: "Bằng cấp (VI)", type: "text", required: true },
      { key: "degreeEn", label: "Bằng cấp (EN)", type: "text", required: true },
      { key: "gpa", label: "GPA", type: "number" },
      { key: "startYear", label: "Năm bắt đầu", type: "number", required: true },
      { key: "endYear", label: "Năm kết thúc", type: "number" },
      { key: "statusVi", label: "Trạng thái (VI)", type: "text" },
      { key: "statusEn", label: "Trạng thái (EN)", type: "text" },
      { key: "order", label: "Thứ tự hiển thị", type: "number" },
      { key: "visible", label: "Hiển thị công khai", type: "checkbox" },
    ],
  },
  experience: {
    label: "Kinh nghiệm làm việc",
    model: "experience",
    listColumns: ["company", "roleVi"],
    fields: [
      { key: "company", label: "Công ty / Đơn vị", type: "text", required: true },
      { key: "roleVi", label: "Vị trí (VI)", type: "text", required: true },
      { key: "roleEn", label: "Vị trí (EN)", type: "text", required: true },
      { key: "startDate", label: "Bắt đầu (vd 10/2024)", type: "text", required: true },
      { key: "endDate", label: "Kết thúc (để trống nếu đang làm)", type: "text" },
      { key: "bulletsVi", label: "Mô tả công việc (VI)", type: "lines", helpText: "Mỗi dòng 1 gạch đầu dòng" },
      { key: "bulletsEn", label: "Mô tả công việc (EN)", type: "lines", helpText: "Mỗi dòng 1 gạch đầu dòng" },
      { key: "order", label: "Thứ tự hiển thị", type: "number" },
      { key: "visible", label: "Hiển thị công khai", type: "checkbox" },
    ],
  },
  projects: {
    label: "Dự án",
    model: "project",
    listColumns: ["nameVi", "status"],
    fields: [
      { key: "slug", label: "Slug (không dấu, không trùng)", type: "text", required: true },
      { key: "nameVi", label: "Tên dự án (VI)", type: "text", required: true },
      { key: "nameEn", label: "Tên dự án (EN)", type: "text", required: true },
      { key: "descVi", label: "Mô tả (VI)", type: "textarea", required: true },
      { key: "descEn", label: "Mô tả (EN)", type: "textarea", required: true },
      { key: "techs", label: "Công nghệ dùng (cách nhau bằng dấu phẩy)", type: "tags" },
      {
        key: "status",
        label: "Trạng thái",
        type: "select",
        options: [
          { value: "done", label: "Hoàn thành" },
          { value: "in_progress", label: "Đang làm" },
        ],
      },
      { key: "startDate", label: "Bắt đầu", type: "text" },
      { key: "endDate", label: "Kết thúc", type: "text" },
      { key: "githubUrl", label: "Link GitHub", type: "text" },
      { key: "demoUrl", label: "Link Demo", type: "text" },
      { key: "coverImage", label: "Ảnh bìa dự án", type: "image" },
      { key: "featured", label: "Ghim nổi bật ở trang chủ", type: "checkbox" },
      { key: "visible", label: "Hiển thị công khai", type: "checkbox" },
      { key: "order", label: "Thứ tự hiển thị", type: "number" },
    ],
  },
  skills: {
    label: "Kỹ năng",
    model: "skillGroup",
    listColumns: ["labelVi"],
    fields: [
      { key: "labelVi", label: "Tên nhóm (VI)", type: "text", required: true },
      { key: "labelEn", label: "Tên nhóm (EN)", type: "text", required: true },
      { key: "items", label: "Kỹ năng (cách nhau bằng dấu phẩy)", type: "tags", required: true },
      { key: "order", label: "Thứ tự hiển thị", type: "number" },
      { key: "visible", label: "Hiển thị công khai", type: "checkbox" },
    ],
  },
  certificates: {
    label: "Chứng chỉ",
    model: "certificate",
    listColumns: ["nameVi", "issuer"],
    fields: [
      { key: "nameVi", label: "Tên chứng chỉ (VI)", type: "text", required: true },
      { key: "nameEn", label: "Tên chứng chỉ (EN)", type: "text", required: true },
      { key: "issuer", label: "Đơn vị cấp", type: "text", required: true },
      { key: "issueDate", label: "Ngày cấp", type: "date", required: true },
      { key: "code", label: "Mã chứng chỉ", type: "text" },
      { key: "imageUrl", label: "Ảnh chứng chỉ (scan)", type: "image" },
      { key: "order", label: "Thứ tự hiển thị", type: "number" },
      { key: "visible", label: "Hiển thị công khai", type: "checkbox" },
    ],
  },
  achievements: {
    label: "Thành tựu",
    model: "achievement",
    listColumns: ["titleVi"],
    fields: [
      { key: "titleVi", label: "Tiêu đề (VI)", type: "text", required: true },
      { key: "titleEn", label: "Tiêu đề (EN)", type: "text", required: true },
      { key: "descVi", label: "Mô tả (VI)", type: "textarea" },
      { key: "descEn", label: "Mô tả (EN)", type: "textarea" },
      { key: "date", label: "Ngày", type: "date" },
      { key: "imageUrl", label: "Ảnh minh hoạ", type: "image" },
      { key: "order", label: "Thứ tự hiển thị", type: "number" },
      { key: "visible", label: "Hiển thị công khai", type: "checkbox" },
    ],
  },
  documents: {
    label: "Tài liệu",
    model: "document",
    listColumns: ["titleVi"],
    fields: [
      { key: "titleVi", label: "Tên tài liệu (VI)", type: "text", required: true },
      { key: "titleEn", label: "Tên tài liệu (EN)", type: "text", required: true },
      { key: "fileUrl", label: "Link file (upload lên đâu đó rồi dán link vào)", type: "text", required: true },
      { key: "visible", label: "Hiển thị công khai", type: "checkbox" },
    ],
  },
};

export function getResourceConfig(resource: string): ResourceConfig | undefined {
  return RESOURCES[resource];
}
