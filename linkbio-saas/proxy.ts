import {NextResponse} from "next/server";import type {NextRequest} from "next/server";
export async function proxy(req:NextRequest){const path=req.nextUrl.pathname;if(!path.startsWith("/dashboard"))return NextResponse.next();return NextResponse.next()}
export const config={matcher:["/dashboard/:path*"]};
