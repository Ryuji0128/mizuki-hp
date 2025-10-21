// export { GET, POST } from "@/lib/auth";

// 🔸 認証を一時的に無効化
export async function GET() {
    return new Response("Auth temporarily disabled", { status: 200 });
}

export async function POST() {
    return new Response("Auth temporarily disabled", { status: 200 });
}
