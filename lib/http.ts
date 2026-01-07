import { NextResponse } from "next/server";

export function jsonOk<T>(data: T, init?: ResponseInit) {
  return NextResponse.json(data, { status: init?.status ?? 200, ...init });
}

export function jsonBadRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

export function jsonUnauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export function jsonNotFound() {
  return NextResponse.json({ error: "Not found" }, { status: 404 });
}

export function jsonServiceUnavailable(message: string) {
  return NextResponse.json({ error: message }, { status: 503 });
}

export function jsonServerError(message = "Server error") {
  return NextResponse.json({ error: message }, { status: 500 });
}


