import { NextResponse } from "next/server";
import {
  createServerSupabaseClient,
  isServerSupabaseConfigured,
  verifyAuthToken,
} from "../../../lib/supabase-server";
import type { StoreProfile } from "../../../types";

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

    const { data, error } = await client
      .from("tenants")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 },
      );
    }

    if (!data) {
      return NextResponse.json({ success: true, data: null });
    }

    const profile: StoreProfile = {
      id: "default",
      name: data.store_name,
      ownerName: data.owner_name || "",
      phone: data.phone || "",
      address: data.address || "",
      receiptFooter: data.receipt_footer || "",
      mode: data.mode || "solo",
      adminPin: data.admin_pin || null,
      businessType: data.business_type || "hybrid",
      currency: data.currency || "IDR",
      isOnboarded: true,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };

    return NextResponse.json({ success: true, data: profile });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Gagal mengambil data toko";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}

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
    const body = (await req.json()) as Partial<StoreProfile>;
    if (!body.name || !body.name.trim()) {
      return NextResponse.json(
        { success: false, error: "Nama toko wajib diisi" },
        { status: 400 },
      );
    }

    const authHeader = req.headers.get("authorization") || "";
    const token = authHeader.replace("Bearer ", "").trim();
    const client = createServerSupabaseClient(token);

    const now = new Date().toISOString();
    const { data, error } = await client
      .from("tenants")
      .upsert(
        {
          user_id: user.id,
          store_name: body.name.trim(),
          owner_name: body.ownerName?.trim() || "",
          phone: body.phone?.trim() || "",
          address: body.address?.trim() || "",
          receipt_footer: body.receiptFooter?.trim() || "",
          mode: body.mode || "solo",
          admin_pin: body.adminPin || null,
          business_type: body.businessType || "hybrid",
          currency: body.currency || "IDR",
          updated_at: body.updatedAt || now,
        },
        { onConflict: "user_id" },
      )
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Gagal menyimpan data toko";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}

// PUT: Alias ke POST (Full update / upsert)
export async function PUT(req: Request) {
  return POST(req);
}

// PATCH: Partial update (bisa update field tertentu saja seperti mode, pin, telp, dll)
export async function PATCH(req: Request) {
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
    const body = (await req.json()) as Partial<StoreProfile>;
    const authHeader = req.headers.get("authorization") || "";
    const token = authHeader.replace("Bearer ", "").trim();
    const client = createServerSupabaseClient(token);

    const updatePayload: Record<string, unknown> = {
      updated_at: body.updatedAt || new Date().toISOString(),
    };

    if (body.name !== undefined) updatePayload.store_name = body.name.trim();
    if (body.ownerName !== undefined)
      updatePayload.owner_name = body.ownerName.trim();
    if (body.phone !== undefined) updatePayload.phone = body.phone.trim();
    if (body.address !== undefined) updatePayload.address = body.address.trim();
    if (body.receiptFooter !== undefined)
      updatePayload.receipt_footer = body.receiptFooter.trim();
    if (body.mode !== undefined) updatePayload.mode = body.mode;
    if (body.adminPin !== undefined) updatePayload.admin_pin = body.adminPin;
    if (body.businessType !== undefined)
      updatePayload.business_type = body.businessType;
    if (body.currency !== undefined) updatePayload.currency = body.currency;

    const { data, error } = await client
      .from("tenants")
      .update(updatePayload)
      .eq("user_id", user.id)
      .select()
      .maybeSingle();

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Gagal mengupdate data toko";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
