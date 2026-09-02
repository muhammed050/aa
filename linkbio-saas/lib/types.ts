export type SectionType = "profile"|"social"|"links"|"products"|"services"|"gallery"|"video"|"location"|"contact"|"whatsapp"|"booking"|"cta"|"text";
export type Section = { id:string; type:SectionType; title?:string; visible:boolean; content:Record<string,unknown>; style?:Record<string,unknown> };
export type Page = { id:string; user_id:string; username:string; name:string; bio:string|null; avatar_url:string|null; language:string; template:number; theme:Record<string,unknown>; sections:Section[]; published:boolean; seo_title:string|null; seo_description:string|null; noindex:boolean };
export type Product = { id:string; name:string; description:string|null; price:number; currency:string; image_url:string|null; whatsapp_enabled:boolean; active:boolean; featured:boolean };
export type Service = { id:string; name:string; description:string|null; price:number|null; duration_minutes:number|null; image_url:string|null; booking_url:string|null; whatsapp_enabled:boolean; active:boolean };
