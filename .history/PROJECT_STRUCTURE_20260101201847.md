# Project Structure

Cấu trúc project được tổ chức theo best practices của React/TypeScript:

## 📁 Cấu trúc thư mục

```
src/
├── assets/               # Các file hình ảnh, logo, icon cố định của UI
│   ├── logo.png
│   ├── shoe.png
│   ├── banner.png
│   ├── nike.jpg
│   └── 404.png
│
├── components/          # Components có thể tái sử dụng
│   ├── common/         # Common components (Header, Footer, Navigation)
│   │   ├── Header.tsx
│   │   ├── Navigation.tsx
│   │   ├── Footer.tsx
│   │   ├── ScrollToTop.tsx
│   │   └── SectionHeader.tsx
│   │
│   ├── card/           # Card components
│   │   ├── ProductCard.tsx
│   │   ├── BrandCard.tsx
│   │   ├── ReleaseCard.tsx
│   │   └── InfoCard.tsx
│   │
│   └── auth/           # Authentication components
│       ├── SignUpForm.tsx
│       ├── LoginForm.tsx
│       └── SocialLogin.tsx
│
├── pages/              # Các page components, mỗi page có folder riêng
│   ├── Home/
│   │   ├── index.tsx           # Main Home page component
│   │   └── HeroCarousel.tsx    # Component dùng riêng cho Home
│   │
│   ├── ProductDetail/
│   │   └── index.tsx
│   │
│   ├── SignUp/
│   │   └── index.tsx
│   │
│   └── NotFound/
│       └── index.tsx
│
├── layouts/            # Layout components
│   └── MainLayout.tsx  # Layout chung với Header, Navigation, Footer
│
├── router/             # React Router configuration
│   └── index.tsx       # Route definitions
│
├── data/               # Static data và mock data
│   └── products.ts     # Product data và helper functions
│
├── hooks/              # Custom React hooks (empty, ready for future use)
├── lib/                # External library configurations (empty)
├── services/           # API service layer (empty, ready for API integration)
├── styles/             # Global styles (empty)
└── utils/              # Utility functions (empty)
```

## 🎯 Nguyên tắc tổ chức

### Components

- **common/**: Components được dùng ở nhiều nơi (Header, Footer, Navigation, etc.)
- **card/**: Các loại card components (ProductCard, BrandCard, etc.)
- **auth/**: Components liên quan đến authentication
- Các component cùng loại được nhóm lại thành folder

### Pages

- Mỗi page có folder riêng
- File chính là `index.tsx`
- Components chỉ dùng cho page đó nằm trong folder của page (ví dụ: `HeroCarousel` trong `Home/`)

### Assets

- Tất cả ảnh, icons được import từ `src/assets/`
- Không dùng đường dẫn tuyệt đối từ `public/`
- Import bằng ES6 modules: `import logoImg from '../assets/logo.png'`

### Router

- Tất cả route definitions trong `router/index.tsx`
- Dễ quản lý và maintain routes

### Layouts

- `MainLayout`: Wrapper chung cho các page có Header + Navigation + Footer
- Dễ dàng tạo layout khác (AdminLayout, AuthLayout, etc.)

## 🔄 Imports

### Import Components

```typescript
// Common components
import Header from "@/components/common/Header";

// Card components
import ProductCard from "@/components/card/ProductCard";

// Auth components
import SignUpForm from "@/components/auth/SignUpForm";
```

### Import Assets

```typescript
import logoImg from "@/assets/logo.png";
import shoeImg from "@/assets/shoe.png";
```

### Import Data

```typescript
import { products, getProductById } from "@/data/products";
```

## 📝 Notes

- Sử dụng `MainLayout` để wrap pages có header/footer
- Components được chia nhỏ theo chức năng để dễ maintain
- Ready cho việc thêm API services, custom hooks, utilities
