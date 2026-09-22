import { NextResponse } from "next/server";
import {
  createServerSupabaseClient,
  isServerSupabaseConfigured,
  verifyAuthToken,
} from "../../../../lib/supabase-server";
import type { Transaction } from "../../../../types";

export async function POST(req: Request) {
  if (!isServerSupabaseConfigured()) {
    return NextResponse.json(
      {
        success: false,
        error: "Supabase belum dikonfigurasi di server.",
        demoMode: true,
      },
      { status: 503 },
    );
  }

  const { user, error: authError } = await verifyAuthToken(req);
  if (authError || !user) {
    return NextResponse.json(
      { success: false, error: authError || "Unauthorized" },
      { status: 401 },
    );
  }

  try {
    const body = (await req.json()) as { transactions?: Transaction[] };
    const transactions = body.transactions || [];

    if (!Array.isArray(transactions) || transactions.length === 0) {
      return NextResponse.json({
        success: true,
        syncedCount: 0,
        syncedIds: [],
        message: "Tidak ada transaksi yang perlu disinkronkan.",
      });
    }

    const authHeader = req.headers.get("authorization") || "";
    const token = authHeader.replace("Bearer ", "").trim();
    const client = createServerSupabaseClient(token);

    // Map transactions into orders row schema
    const orderRows = transactions.map((tx) => ({
      user_id: user.id,
      client_uuid: tx.id,
      invoice_number: tx.invoiceNumber,
      subtotal: tx.subtotal,
      tax_amount: tx.taxAmount,
      discount_amount: tx.discountAmount,
      final_amount: tx.finalAmount,
      payment_method: tx.paymentMethod,
      payment_amount: tx.paymentAmount,
      change_amount: tx.changeAmount,
      items: tx.items,
      status: tx.status,
      created_at: tx.createdAt,
    }));

    // Single bulk upsert into orders
    const { error } = await client
      .from("orders")
      .upsert(orderRows, { onConflict: "client_uuid" });

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 },
      );
    }

    const syncedIds = transactions.map((tx) => tx.id);

    return NextResponse.json({
      success: true,
      syncedCount: syncedIds.length,
      syncedIds,
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error
        ? err.message
        : "Gagal memproses bulk sync transaksi";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
