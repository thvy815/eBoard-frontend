import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-white text-center px-4">
      
      {/* Logo */}
      <Image
        src="/logo.jpg"
        alt="eBoard Logo"
        width={150}
        height={150}
        className="mb-4"
      />

      {/* Description */}
      <p className="text-gray-600 text-base mb-8 max-w-md">
        eBoard – Hệ thống quản lý học sinh tiểu học giúp nhà trường,
        giáo viên và phụ huynh kết nối hiệu quả.
      </p>

      {/* Buttons */}
      <div className="flex gap-4">
        <Link href="/register">
          <Button variant="primary">
            Đăng ký tài khoản
          </Button>
        </Link>

        <Link href="/login">
          <Button variant="outline">
            Đăng nhập
          </Button>
        </Link>
      </div>

    </main>
  );
}
