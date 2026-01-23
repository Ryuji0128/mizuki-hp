"use client";

import Link from "next/link";

const menuItems = [
  {
    label: "俳句投稿",
    description: "俳句の作成・編集・削除",
    path: "/portal-admin/blog",
    icon: "🖊️",
  },
  {
    label: "お問い合わせ一覧",
    description: "お問い合わせの確認・管理",
    path: "/portal-admin/inquiry",
    icon: "📩",
  },
  {
    label: "お知らせ管理",
    description: "お知らせの作成・編集・削除",
    path: "/portal-admin/news",
    icon: "📢",
  },
];

export default function AdminDashboard() {
  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">管理画面</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition flex flex-col items-center text-center gap-2"
          >
            <span className="text-3xl">{item.icon}</span>
            <span className="text-lg font-semibold">{item.label}</span>
            <span className="text-sm text-gray-500">{item.description}</span>
          </Link>
        ))}
      </div>
    </main>
  );
}
