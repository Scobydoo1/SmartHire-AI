# Kế hoạch Sửa Frontend Auth Flow — SmartHire-AI

**Phiên bản:** 1.0  
**Ngày:** 12/03/2026  
**Tác giả:** SmartHire Engineering  
**Trạng thái:** Đã phê duyệt — Sẵn sàng implement

---

## Mục lục

1. [Tổng quan](#1-tổng-quan)
2. [Kiến trúc Auth hiện tại](#2-kiến-trúc-auth-hiện-tại)
3. [Vấn đề đã phát hiện](#3-vấn-đề-đã-phát-hiện)
4. [Quyết định thiết kế](#4-quyết-định-thiết-kế)
5. [Phase 1 — Sửa Core Auth Logic](#5-phase-1--sửa-core-auth-logic)
6. [Phase 2 — Forgot Password](#6-phase-2--forgot-password)
7. [Phase 3 — Sign Out](#7-phase-3--sign-out)
8. [Hướng dẫn nâng cấp Role RECRUITER](#8-hướng-dẫn-nâng-cấp-role-recruiter)
9. [Danh sách file thay đổi](#9-danh-sách-file-thay-đổi)
10. [Checklist kiểm tra](#10-checklist-kiểm-tra)

---

## 1. Tổng quan

SmartHire-AI sử dụng **AWS Cognito** làm Identity Provider với Amplify v6 (`aws-amplify/auth`) trên frontend React/TypeScript. Trạng thái user được quản lý bởi **Zustand** (`authStore`).

Sau khi phân tích toàn bộ codebase, có **4 nhóm vấn đề chính** cần sửa để đảm bảo luồng xác thực hoạt động đúng với cấu hình IaC:

| #   | Vấn đề                                                   | Mức độ      | Phase |
| --- | -------------------------------------------------------- | ----------- | ----- |
| 1   | `role` hardcode thành `'recruiter'` trong `useAuthLogin` | 🔴 Critical | 1     |
| 2   | User attributes không được lưu chính xác vào store       | 🟠 High     | 1     |
| 3   | `signUp` không truyền `custom:role` vào Cognito          | 🟠 High     | 1     |
| 4   | Thiếu Forgot Password flow                               | 🟡 Medium   | 2     |
| 5   | Thiếu Sign Out trên sidebars                             | 🟡 Medium   | 3     |

---

## 2. Kiến trúc Auth hiện tại

### 2.1 Cognito Infrastructure (từ `iac/modules/auth/main.tf`)

```
Cognito User Pool: smarthire-user-pool-dev
  ├── Username attribute: email
  ├── Custom attribute: custom:role (String, mutable, 1-20 chars)
  ├── Auth flows: ALLOW_USER_SRP_AUTH, ALLOW_REFRESH_TOKEN_AUTH, ALLOW_USER_PASSWORD_AUTH
  ├── OAuth flow: Authorization Code (PKCE)
  ├── Scopes: email, openid, profile, aws.cognito.signin.user.admin
  ├── Callback URLs: http://localhost:5173/, http://localhost:5173/login
  ├── Identity Provider: Google (email + sub mapping)
  └── PostConfirmation Lambda: cognito-rds-sync → INSERT into RDS Users table
```

### 2.2 Frontend Auth Stack

```
aws-amplify/auth (Amplify v6)
  ├── signIn()              → Email/password login
  ├── signUp()              → Register với email + password + name
  ├── confirmSignUp()       → Xác nhận OTP 6 chữ số
  ├── signInWithRedirect()  → Google OAuth
  ├── fetchAuthSession()    → Lấy JWT tokens
  ├── fetchUserAttributes() → Lấy Cognito attributes (email, name, custom:role)
  ├── resetPassword()       → Gửi reset code
  ├── confirmResetPassword()→ Xác nhận reset code + mật khẩu mới
  └── signOut()             → Đăng xuất, clear tokens

Zustand AuthStore
  └── { user, token, isAuthenticated, isLoading, login(), logout(), updateUser() }

Hub (aws-amplify/utils)
  └── Events: signedIn, signedOut, tokenRefresh_failure → trigger checkUserSession
```

### 2.3 Luồng xác thực đầy đủ (sau khi fix)

```
┌─────────────────────────────────────────────────────────┐
│                     REGISTER FLOW                       │
├─────────────────────────────────────────────────────────┤
│ 1. User nhập: name, email, password                     │
│ 2. signUp({ username: email, password,                  │
│             userAttributes: { email, name,              │
│               'custom:role': 'CANDIDATE' } })           │
│ 3. Cognito gửi OTP 6 chữ số về email                   │
│ 4. confirmSignUp({ username: email, code })             │
│ 5. PostConfirmation Lambda: INSERT Users vào RDS        │
│    (custom:role = 'CANDIDATE' nếu không truyền role)    │
│ 6. navigate('/login')                                   │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                       LOGIN FLOW                        │
├─────────────────────────────────────────────────────────┤
│ 1. User nhập: email, password                           │
│ 2. signIn({ username: email, password })                │
│ 3. fetchAuthSession() → idToken (JWT)                   │
│ 4. fetchUserAttributes() → { email, name, custom:role } │
│ 5. Normalize role: custom:role.toLowerCase()            │
│    Fallback: 'candidate'                                │
│ 6. login(user, token) → Zustand store                   │
│ 7. navigate('/') → RootRoute → redirect theo role       │
│    - 'candidate' → CandidateDashboard                   │
│    - 'recruiter' → RecruiterDashboard                   │
│    - 'admin'     → DashboardHome                        │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                  GOOGLE SSO FLOW                        │
├─────────────────────────────────────────────────────────┤
│ 1. signInWithRedirect({ provider: 'Google' })           │
│ 2. Redirect → Cognito Hosted UI → Google OAuth          │
│ 3. Cognito callback → Hub event: signedIn               │
│ 4. AuthInitializer.checkUserSession() tự động chạy      │
│ 5. Lấy custom:role (nếu user mới → undefined → default  │
│    'candidate')                                         │
│ 6. navigate('/') → redirect theo role                   │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                 FORGOT PASSWORD FLOW                    │
├─────────────────────────────────────────────────────────┤
│ Step 1 — Request Reset:                                 │
│   resetPassword({ username: email })                    │
│   Cognito gửi code 6 chữ số về email                   │
│                                                         │
│ Step 2 — Confirm Reset:                                 │
│   confirmResetPassword({ username, confirmationCode,    │
│                          newPassword })                 │
│   toast.success → navigate('/login')                    │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                    SIGN OUT FLOW                        │
├─────────────────────────────────────────────────────────┤
│ 1. User click Logout trên sidebar                       │
│ 2. signOut() → Amplify clear tokens (localStorage)      │
│ 3. Hub event: signedOut → logout() Zustand              │
│ 4. navigate('/login')                                   │
└─────────────────────────────────────────────────────────┘
```

---

## 3. Vấn đề đã phát hiện

### 3.1 Bug Critical: Role hardcode trong `useAuthLogin.ts`

**File:** `frontend/src/components/auth/hooks/useAuthLogin.ts` — dòng 54

```typescript
// ❌ SAI — hardcode role
const loggedUser: User = {
  id: attributes.sub || "",
  email: attributes.email || values.email,
  name: "User", // ❌ không lấy từ attributes
  role: "recruiter", // ❌ hardcode
};
```

**Nguyên nhân:** User attributes không được đọc đúng từ Cognito. Role luôn là `'recruiter'` bất kể Cognito attribute.

```typescript
// ✅ ĐÚNG
const rawRole = attributes["custom:role"] ?? "CANDIDATE";
const normalized = rawRole.toLowerCase();
const userRole: User["role"] =
  normalized === "recruiter" ||
  normalized === "admin" ||
  normalized === "candidate"
    ? normalized
    : "candidate";

const loggedUser: User = {
  id: attributes.sub || "",
  email: attributes.email || values.email,
  name: attributes.name || "User", // ✅ đọc đúng key từ Cognito
  role: userRole, // ✅ từ Cognito custom:role
};
```

### 3.2 Bug High: `custom:role` và `name` không được set khi `signUp`

Cognito App Client ban đầu chỉ có `write_attributes = ["email", "custom:role"]`, thiếu `name` → lỗi `NotAuthorizedException: A client attempted to write unauthorized attribute`.

**Fix IaC:** Thêm `name` vào `read_attributes` và `write_attributes` trong `iac/modules/auth/main.tf`, sau đó `terraform apply`.

```hcl
read_attributes  = ["email", "name", "custom:role"]
write_attributes = ["email", "name", "custom:role"]
```

Sau khi apply, `signUp` truyền đầy đủ cả `name` và `custom:role: 'CANDIDATE'`.

### 3.3 Bug High: `AuthInitializer` trong `App.tsx` cùng lỗi

**File:** `frontend/src/App.tsx` — `checkUserSession` function

Cùng pattern lỗi như `useAuthLogin.ts` nhưng đã có logic đọc `custom:role`. Cần thống nhất normalize theo cùng pattern.

### 3.4 Missing: Forgot Password

Link `to="#"` trong `Login.tsx` không có trang đích. User không thể đặt lại mật khẩu.

### 3.5 Missing: Sign Out

Không có nút Logout trên `CandidateAppSidebar` và `RecruiterAppSidebar`. User không có cách đăng xuất từ UI.

---

## 4. Quyết định thiết kế

| Câu hỏi                            | Quyết định                                              | Lý do                                                     |
| ---------------------------------- | ------------------------------------------------------- | --------------------------------------------------------- |
| User có tự chọn role khi register? | **Không** — mặc định `CANDIDATE`                        | Tránh abuse, admin kiểm soát role RECRUITER               |
| Implement Forgot Password?         | **Có** — 2-step (email → code + new password)           | Cognito hỗ trợ sẵn `resetPassword` API                    |
| Implement Sign Out?                | **Có** — `useSignOut` hook + nút Logout sidebar         | UX cần thiết                                              |
| Role casing trong store?           | **Lowercase** — `'candidate'`, `'recruiter'`, `'admin'` | Khớp với type `User['role']`                              |
| User name?                         | Chỉ dùng `name` (fullname)                              | Cognito standard attribute, không tách firstName/lastName |

---

## 5. Phase 1 — Sửa Core Auth Logic

### 5.1 `useAuthLogin.ts`

**Thay đổi:**

- Đọc `attributes['custom:role']`, normalize lowercase, fallback `'candidate'`
- Đọc `attributes.name` (fullname) từ Cognito

**Snippet sau khi sửa:**

```typescript
// Fetch JWT Token
const session = await fetchAuthSession();
const token = session.tokens?.idToken?.toString() || "";

// Fetch User Attributes from Cognito
const attributes = await fetchUserAttributes();

// Normalize role from Cognito custom attribute
const rawRole = (attributes["custom:role"] ?? "CANDIDATE").toLowerCase();
const userRole: User["role"] =
  rawRole === "recruiter" || rawRole === "admin" || rawRole === "candidate"
    ? rawRole
    : "candidate";

const loggedUser: User = {
  id: attributes.sub || "",
  email: attributes.email || values.email,
  name: attributes.name || "User",
  role: userRole,
};

login(loggedUser, token);
toast.success("Successfully logged in");
navigate("/");
```

### 5.2 `useAuthRegister.ts`

**Thay đổi:**

- Thêm `'custom:role': 'CANDIDATE'` vào `userAttributes`
- Clear `registeredEmail` sau khi confirm thành công

```typescript
await signUp({
  username: values.email,
  password: values.password,
  options: {
    userAttributes: {
      email: values.email,
      name: values.name,
      "custom:role": "CANDIDATE",
    },
  },
});
```

### 5.3 `App.tsx` — `AuthInitializer`

**Thay đổi:**

- Unify role normalization logic (thêm helper function)
- Dùng `attributes.name` thay vì `attributes.given_name`

```typescript
// Helper — dùng cả trong useAuthLogin và AuthInitializer
function normalizeRole(raw?: string): User["role"] {
  const r = (raw ?? "").toLowerCase();
  return r === "recruiter" || r === "admin" || r === "candidate"
    ? r
    : "candidate";
}
```

---

## 6. Phase 2 — Forgot Password

### 6.1 `useForgotPassword.ts` (file mới)

**Path:** `frontend/src/components/auth/hooks/useForgotPassword.ts`

```typescript
interface UseForgotPasswordReturn {
  step: "REQUEST" | "CONFIRM";
  pendingEmail: string;
  isSubmitting: boolean;
  error: string | null;
  requestReset: (email: string) => Promise<void>;
  confirmReset: (code: string, newPassword: string) => Promise<void>;
}
```

**API Amplify sử dụng:**

| Step             | Amplify function       | Tham số                                       |
| ---------------- | ---------------------- | --------------------------------------------- |
| Gửi code         | `resetPassword`        | `{ username: email }`                         |
| Đặt mật khẩu mới | `confirmResetPassword` | `{ username, confirmationCode, newPassword }` |

### 6.2 `ForgotPassword.tsx` (file mới)

**Path:** `frontend/src/components/auth/ForgotPassword.tsx`

**UI Structure:**

```
Step REQUEST:
  ┌─ AuthLayout ─────────────────────────────┐
  │  Tiêu đề: "Quên mật khẩu"               │
  │  Mô tả: "Nhập email để nhận code"        │
  │  Form:                                   │
  │    [Email input]                         │
  │    [Gửi code] button                     │
  │  Link: ← Quay lại đăng nhập              │
  └──────────────────────────────────────────┘

Step CONFIRM:
  ┌─ AuthLayout ─────────────────────────────┐
  │  Tiêu đề: "Đặt mật khẩu mới"            │
  │  Mô tả: "Code đã gửi đến {email}"       │
  │  Form:                                   │
  │    [Code input — 6 chữ số]               │
  │    [New password input + strength]       │
  │    [Confirm password input]              │
  │    [Xác nhận] button                     │
  └──────────────────────────────────────────┘
```

**Zod Schemas:**

```typescript
const requestSchema = z.object({
  email: z.string().email(),
});

const confirmSchema = z
  .object({
    code: z.string().length(6, "Code phải 6 chữ số"),
    newPassword: z
      .string()
      .min(8)
      .regex(/[a-z]/, "Cần ít nhất 1 chữ thường")
      .regex(/[A-Z]/, "Cần ít nhất 1 chữ in hoa")
      .regex(/[0-9]/, "Cần ít nhất 1 chữ số")
      .regex(/[^A-Za-z0-9]/, "Cần ít nhất 1 ký tự đặc biệt"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Mật khẩu không khớp",
    path: ["confirmPassword"],
  });
```

### 6.3 Route và Link

**`App.tsx`** — thêm route:

```tsx
<Route path="/forgot-password" element={<ForgotPassword />} />
```

**`Login.tsx`** — sửa link Forgot password:

```tsx
// ❌ Trước
<Link to="#">Forgot password?</Link>

// ✅ Sau
<Link to="/forgot-password">Forgot password?</Link>
```

### 6.4 Exports

**`auth/index.ts`:**

```typescript
export { ForgotPassword } from "./ForgotPassword";
```

**`auth/hooks/index.ts`:**

```typescript
export { useForgotPassword } from "./useForgotPassword";
```

---

## 7. Phase 3 — Sign Out

### 7.1 `useSignOut.ts` (file mới)

**Path:** `frontend/src/components/auth/hooks/useSignOut.ts`

```typescript
import { useCallback, useState } from "react";
import { signOut } from "aws-amplify/auth";

interface UseSignOutReturn {
  handleSignOut: () => Promise<void>;
  isLoading: boolean;
}

export const useSignOut = (): UseSignOutReturn => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = useCallback(async () => {
    setIsLoading(true);
    try {
      await signOut();
      // Hub event 'signedOut' → AuthInitializer.logout() → Zustand clear
    } catch (err) {
      console.error("Sign out failed:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { handleSignOut, isLoading };
};
```

> **Lưu ý:** Không cần gọi `useAuthStore.logout()` thủ công.  
> `signOut()` → Hub fires `signedOut` → `AuthInitializer` listener → `logout()` tự động.

### 7.2 Nút Logout trên Sidebars

**Thêm vào `CandidateAppSidebar.tsx` và `RecruiterAppSidebar.tsx`:**

```tsx
import { useSignOut } from '@/components/auth'
import { LogOut } from 'lucide-react'

// Trong component sidebar:
const { handleSignOut, isLoading } = useSignOut()

// Trong phần footer sidebar:
<SidebarMenuItem>
  <SidebarMenuButton
    onClick={handleSignOut}
    disabled={isLoading}
    className="text-zinc-400 hover:text-red-400 hover:bg-red-500/10"
  >
    {isLoading
      ? <Loader2 className="h-4 w-4 animate-spin" />
      : <LogOut className="h-4 w-4" />
    }
    <span>Log out</span>
  </SidebarMenuButton>
</SidebarMenuItem>
```

---

## 8. Hướng dẫn nâng cấp Role RECRUITER

Sau khi đăng ký, user mặc định là `CANDIDATE`. Để nâng cấp lên `RECRUITER`:

### Cách 1: AWS Console (GUI)

```
1. Mở AWS Console → Cognito → User Pools
2. Chọn: smarthire-user-pool-dev
3. Vào tab: Users
4. Tìm user theo email
5. Chọn user → Edit user attributes
6. Tìm custom:role → đổi thành: RECRUITER
7. Save changes
```

### Cách 2: AWS CLI

```bash
aws cognito-idp admin-update-user-attributes \
  --user-pool-id <USER_POOL_ID> \
  --username <USER_EMAIL> \
  --user-attributes Name=custom:role,Value=RECRUITER \
  --region ap-southeast-1
```

### Cách 3: Terraform (batch setup)

```hcl
resource "aws_cognito_user" "recruiter_example" {
  user_pool_id = aws_cognito_user_pool.smarthire_pool.id
  username     = "recruiter@company.com"

  attributes = {
    email          = "recruiter@company.com"
    "custom:role"  = "RECRUITER"
    email_verified = true
  }
}
```

### Khi nào Frontend pick up role mới?

Frontend đọc `custom:role` khi:

1. User **đăng nhập lại** (login mới)
2. Token **refresh** → `Hub: tokenRefresh` → `checkUserSession()` chạy lại

> Không cần deploy lại frontend khi thay đổi role trên Cognito.

---

## 9. Danh sách file thay đổi

### Files sửa đổi

| File                                                        | Loại | Thay đổi                                                              |
| ----------------------------------------------------------- | ---- | --------------------------------------------------------------------- |
| `frontend/src/components/auth/hooks/useAuthLogin.ts`        | Sửa  | Fix role normalization, fix user name attribute                       |
| `frontend/src/components/auth/hooks/useAuthRegister.ts`     | Sửa  | Add `custom:role: 'CANDIDATE'`, clear registeredEmail                 |
| `frontend/src/App.tsx`                                      | Sửa  | Fix AuthInitializer role/name handling, thêm `/forgot-password` route |
| `frontend/src/components/auth/Login.tsx`                    | Sửa  | Sửa link Forgot password `to="#"` → `to="/forgot-password"`           |
| `frontend/src/components/auth/index.ts`                     | Sửa  | Export `ForgotPassword`                                               |
| `frontend/src/components/auth/hooks/index.ts`               | Sửa  | Export `useForgotPassword`, `useSignOut`                              |
| `frontend/src/components/dashboard/CandidateAppSidebar.tsx` | Sửa  | Thêm nút Logout                                                       |
| `frontend/src/components/dashboard/RecruiterAppSidebar.tsx` | Sửa  | Thêm nút Logout                                                       |

### Files tạo mới

| File                                                      | Mô tả                                      |
| --------------------------------------------------------- | ------------------------------------------ |
| `frontend/src/components/auth/ForgotPassword.tsx`         | 2-step forgot password UI component        |
| `frontend/src/components/auth/hooks/useForgotPassword.ts` | Hook: resetPassword + confirmResetPassword |
| `frontend/src/components/auth/hooks/useSignOut.ts`        | Hook: signOut với loading state            |

---

## 10. Checklist kiểm tra

### Phase 1 — Core Auth Logic

- [ ] Đăng ký tài khoản mới → kiểm tra Cognito console: `custom:role = CANDIDATE` được set
- [ ] Đăng nhập bằng email/password → Zustand DevTools: `user.role === 'candidate'`
- [ ] Zustand DevTools: `user.name` = tên đầy đủ (không phải `'User'`)
- [ ] Refresh trang → AuthInitializer khôi phục session, role đúng
- [ ] Google SSO → Hub fires `signedIn` → role = `'candidate'` → redirect sang `CandidateDashboard`
- [ ] Admin set `custom:role = RECRUITER` trên Cognito → user re-login → `user.role === 'recruiter'` → redirect sang `RecruiterDashboard`

### Phase 2 — Forgot Password

- [ ] Click "Forgot password?" trên Login → navigate đến `/forgot-password`
- [ ] Nhập email sai format → Zod validation hiện lỗi
- [ ] Nhập email hợp lệ → toast "Code đã gửi" → chuyển sang Step CONFIRM
- [ ] Nhập code sai → Cognito trả lỗi → toast error hiện đúng message
- [ ] Nhập code đúng + mật khẩu mới → toast success → navigate `/login`
- [ ] Đăng nhập bằng mật khẩu mới → thành công

### Phase 3 — Sign Out

- [ ] Nút Logout hiện ở footer sidebar trên `CandidateDashboard`
- [ ] Nút Logout hiện ở footer sidebar trên `RecruiterDashboard`
- [ ] Click Logout → Amplify clear tokens → redirect về `/login`
- [ ] Sau logout, truy cập `ProtectedRoute` → redirect về `/login`
- [ ] Sau logout, refresh trang → không restore session cũ

---

_Tài liệu này được tạo từ phân tích codebase SmartHire-AI tại commit hiện tại (12/03/2026)._  
_Để convert sang PDF: VS Code → Command Palette → "Markdown: Export to PDF" (cần extension Markdown PDF)._
