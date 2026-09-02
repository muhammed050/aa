export const SECTION_TYPES = ['profile','social','links','products','services','gallery','video','location','contact','whatsapp','booking','cta','text'] as const;
export type SectionType = typeof SECTION_TYPES[number];
export type SectionStyle = { background?: string; color?: string; radius?: number; shadow?: boolean; padding?: number; align?: 'left'|'center'|'right'; columns?: number; buttonStyle?: 'solid'|'outline'|'glass'|'minimal'|'card' };
export type Section = { id:string; type:SectionType; title?:string; subtitle?:string; visible:boolean; content:Record<string,unknown>; style?:SectionStyle };
export type Theme = { background?:string; foreground?:string; accent?:string; font?:string; buttonRadius?:number; cardRadius?:number; backgroundType?:string };
export type Page = { id:string; user_id:string; username:string; name:string; bio:string|null; avatar_url:string|null; language:string; template:number; theme:Theme; sections:Section[]; published:boolean; seo_title:string|null; seo_description:string|null; noindex:boolean };
export type Product = { id:string; page_id:string; name:string; description:string|null; price:number; currency:string; image_url:string|null; sku:string|null; stock:number|null; category:string|null; product_url:string|null; whatsapp_enabled:boolean; active:boolean; featured:boolean };
export type Service = { id:string; page_id:string; name:string; description:string|null; price:number|null; duration_minutes:number|null; image_url:string|null; booking_url:string|null; whatsapp_enabled:boolean; active:boolean };
export function makeSection(type:SectionType):Section{return {id:crypto.randomUUID(),type,title:type,visible:true,content:{},style:{background:'transparent',align:'center',radius:16,padding:16,buttonStyle:'solid'}}}
