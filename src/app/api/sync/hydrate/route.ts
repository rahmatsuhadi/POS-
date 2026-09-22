import { NextResponse } from "next/server";
import {
  createServerSupabaseClient,
  isServerSupabaseConfigured,
  verifyAuthToken,
} from "../../../../lib/supabase-server";
import type { StoreProfile, Transaction } from "../../../../types";

export async function GET(req: Request) {
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
    const authHeader = req.headers.get("authorization") || "";
    const token = authHeader.replace("Bearer ", "").trim();
    const client = createServerSupabaseClient(token);

    // 1. Fetch Store Profile (Tenant)
    const { data: tenantData, error: tenantErr } = await client
      .from("tenants")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (tenantErr) {
      return NextResponse.json(
        { success: false, error: tenantErr.message },
        { status: 500 },
      );
    }

    let storeProfile: StoreProfile | null = null;
    if (tenantData) {
      storeProfile = {
        id: "default",
        name: tenantData.store_name,
        ownerName: tenantData.owner_name || "",
        phone: tenantData.phone || "",
        address: tenantData.address || "",
        receiptFooter: tenantData.receipt_footer || "",
        mode: tenantData.mode || "solo",
        adminPin: tenantData.admin_pin || null,
        businessType: tenantData.business_type || "hybrid",
        currency: tenantData.currency || "IDR",
        isOnboarded: true,
        createdAt: tenantData.created_at,
        updatedAt: tenantData.updated_at,
      };
    }

    // 2. Fetch User's Orders
    const { data: ordersData, error: ordersErr } = await client
      .from("orders")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (ordersErr) {
      return NextResponse.json(
        { success: false, error: ordersErr.message },
        { status: 500 },
      );
    }

    const transactions: Transaction[] = (ordersData || []).map((order) => ({
      id: order.client_uuid || order.id,
      invoiceNumber: order.invoice_number,
      subtotal: Number(order.subtotal),
      taxAmount: Number(order.tax_amount || 0),
      discountAmount: Number(order.discount_amount || 0),
      finalAmount: Number(order.final_amount),
      paymentMethod: order.payment_method,
      paymentAmount: Number(order.payment_amount),
      changeAmount: Number(order.change_amount),
      items: order.items || [],
      status: order.status || "completed",
      synced: true,
      createdAt: order.created_at,
    }));

    return NextResponse.json({
      success: true,
      data: {
        storeProfile,
        transactions,
      },
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Gagal memproses data hydrate";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
