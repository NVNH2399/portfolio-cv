import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  // --- Profile (singleton) ---
  await prisma.profile.deleteMany();
  await prisma.profile.create({
    data: {
      name: "Nguyễn Văn Ngọc Hãi",
      titleVi: "Kỹ sư Công nghệ thông tin",
      titleEn: "Fullstack Web Developer · Intern/Fresher",
      email: "hai772038@gmail.com",
      phone: "0967 326 154",
      location: "Tam Nông, Đồng Tháp, Việt Nam",
      github: "https://github.com/RikakiNguyen",
      summaryVi:
        "Sinh viên Công nghệ thông tin với nền tảng vững về phát triển web Fullstack. Đã xây dựng thực tế các hệ thống thương mại điện tử hoàn chỉnh sử dụng PHP, MySQL và JavaScript. Hiện đang theo học liên thông tại Đại học Cần Thơ, đồng thời tích cực phát triển các dự án cá nhân.",
      summaryEn:
        "IT student with a solid foundation in fullstack web development. Has built complete e-commerce systems using PHP, MySQL and JavaScript. Currently pursuing a bachelor's degree at Can Tho University while actively building personal projects.",
    },
  });

  // --- Education ---
  await prisma.education.deleteMany();
  await prisma.education.createMany({
    data: [
      {
        school: "Đại học Cần Thơ",
        degreeVi: "Cử nhân Công nghệ thông tin (hệ liên thông)",
        degreeEn: "B.Eng. in Information Technology (bridge program)",
        gpa: 3.46,
        startYear: 2025,
        endYear: 2027,
        statusVi: "Đang học",
        statusEn: "In progress",
        order: 1,
      },
      {
        school: "Trường Cao đẳng Cộng đồng Đồng Tháp",
        degreeVi: "Kỹ sư thực hành Công nghệ thông tin",
        degreeEn: "Associate Engineer in Information Technology",
        gpa: 3.76,
        startYear: 2022,
        endYear: 2025,
        statusVi: "Tốt nghiệp loại Xuất sắc, 20/03/2025",
        statusEn: "Graduated with Excellence, Mar 20, 2025",
        order: 2,
      },
    ],
  });

  // --- Experience ---
  await prisma.experience.deleteMany();
  await prisma.experience.create({
    data: {
      company: "Trường Cao đẳng Cộng đồng Đồng Tháp",
      roleVi: "Thực tập sinh Fullstack Developer",
      roleEn: "Fullstack Developer Intern",
      startDate: "10/2024",
      endDate: "01/2025",
      bulletsVi: [
        "Phân tích yêu cầu và thiết kế kiến trúc MVC cho hệ thống thương mại điện tử end-to-end",
        "Xây dựng giao diện responsive với HTML5, CSS3, Bootstrap, JavaScript/jQuery tương thích đa thiết bị",
        "Phát triển back-end với PHP, thiết kế cơ sở dữ liệu MySQL",
      ],
      bulletsEn: [
        "Analyzed requirements and designed MVC architecture for an end-to-end e-commerce system",
        "Built responsive UI with HTML5, CSS3, Bootstrap and JavaScript/jQuery across devices",
        "Developed the back-end with PHP and designed the MySQL database schema",
      ],
      order: 1,
    },
  });

  // --- Projects ---
  await prisma.project.deleteMany();
  await prisma.project.createMany({
    data: [
      {
        slug: "ecommerce-do-an-nhanh",
        nameVi: "E-commerce Đồ Ăn Nhanh",
        nameEn: "Fast-Food E-commerce",
        descVi:
          "Hệ thống thương mại điện tử Fullstack hoàn chỉnh: duyệt sản phẩm → giỏ hàng → thanh toán → xác nhận đơn hàng. Vai trò solo developer.",
        descEn:
          "Complete fullstack e-commerce flow: browse products → cart → checkout → order confirmation. Solo developer.",
        techs: ["PHP", "MySQL", "Bootstrap", "JavaScript", "jQuery"],
        status: "done",
        startDate: "10/2024",
        endDate: "01/2025",
        featured: true,
        order: 1,
      },
      {
        slug: "task-nova",
        nameVi: "Task Nova — Quản lý công việc nhóm",
        nameEn: "Task Nova — Team Task Manager",
        descVi: "Ứng dụng quản lý task với tính năng phân công, theo dõi tiến độ và deadline.",
        descEn: "Task management app with assignment, progress tracking and deadlines.",
        techs: ["PHP", "MySQL", "JavaScript"],
        status: "in_progress",
        startDate: "2025",
        order: 2,
      },
      {
        slug: "verses-of-memory",
        nameVi: "Verses of Memory — Lưu giữ khoảnh khắc",
        nameEn: "Verses of Memory",
        descVi: "Dự án cá nhân đang trong quá trình phát triển: lưu giữ khoảnh khắc lịch sử và tuyển tập thơ kháng chiến.",
        descEn: "Personal project in progress: preserving historical moments and a collection of wartime poetry.",
        techs: ["Next.js", "PostgreSQL", "Prisma"],
        status: "in_progress",
        startDate: "2025",
        featured: true,
        order: 3,
      },
      {
        slug: "website-ban-laptop",
        nameVi: "Website Bán Laptop",
        nameEn: "Laptop Store Website",
        descVi: "Thiết kế và phát triển giao diện front-end responsive. Đạt điểm 9.5/10 môn Thiết kế Web.",
        descEn: "Designed and developed a responsive front-end. Scored 9.5/10 in Web Design course.",
        techs: ["HTML", "CSS3", "JavaScript"],
        status: "done",
        startDate: "07/2022",
        endDate: "11/2022",
        order: 4,
      },
      {
        slug: "personal-cv-website",
        nameVi: "Personal Information (CV Website)",
        nameEn: "Personal Information (CV Website)",
        descVi: "Website CV/Portfolio cá nhân — trình bày thông tin và các dự án đã/đang thực hiện.",
        descEn: "Personal CV/portfolio website presenting profile info and past/ongoing projects.",
        techs: ["Next.js", "PostgreSQL", "Tailwind CSS"],
        status: "done",
        startDate: "2025",
        featured: true,
        order: 5,
      },
    ],
  });

  // --- Skills ---
  await prisma.skillGroup.deleteMany();
  await prisma.skillGroup.createMany({
    data: [
      { labelVi: "Back-end", labelEn: "Back-end", items: ["PHP", "RESTful API", "MVC Architecture", "Authentication"], order: 1 },
      { labelVi: "Front-end", labelEn: "Front-end", items: ["HTML", "CSS", "JavaScript (ES6+)", "Bootstrap", "jQuery", "Responsive Design"], order: 2 },
      { labelVi: "Cơ sở dữ liệu", labelEn: "Database", items: ["MySQL", "PostgreSQL", "MongoDB", "Database Design", "Query Optimization"], order: 3 },
      { labelVi: "Công cụ", labelEn: "Tools", items: ["Git", "GitHub", "VS Code", "XAMPP", "cPanel"], order: 4 },
      { labelVi: "Đang học", labelEn: "Currently learning", items: ["Next.js", "Laravel", "Docker", "API Design"], order: 5 },
    ],
  });

  // --- Certificates ---
  await prisma.certificate.deleteMany();
  await prisma.certificate.create({
    data: {
      nameVi: "Kỹ thuật sửa chữa, cài đặt và lắp ráp máy tính",
      nameEn: "Computer Repair, Installation & Assembly Techniques",
      issuer: "UNESCO & Trường Cao đẳng Cộng đồng Đồng Tháp",
      issueDate: new Date("2024-07-21"),
      code: "118/2024/LRCĐMT-K24",
      order: 1,
    },
  });

  // --- Cấu hình các phần trên trang chủ (bìa / giới thiệu / dự án / kỹ năng) ---
  await prisma.homeSection.deleteMany();
  await prisma.homeSection.createMany({
    data: [
      { key: "cover", labelVi: "Trang bìa", visible: true, order: 1 },
      { key: "intro", labelVi: "Giới thiệu", visible: true, order: 2 },
      { key: "projects", labelVi: "Dự án", visible: true, order: 3 },
      { key: "skills", labelVi: "Kỹ năng", visible: true, order: 4 },
    ],
  });

  // --- Admin user ---
  const adminUsername = process.env.SEED_ADMIN_USERNAME || "admin";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || "changeme123";
  const passwordHash = await bcrypt.hash(adminPassword, 10);
  await prisma.adminUser.deleteMany();
  await prisma.adminUser.create({
    data: { username: adminUsername, passwordHash },
  });

  console.log("Seed xong! Tài khoản admin:", adminUsername, "/ mật khẩu:", adminPassword);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
