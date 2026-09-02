import type {Metadata} from 'next';import './globals.css';
export const metadata:Metadata={title:{default:'رابطك — كل شيء في رابط واحد',template:'%s | رابطك'},description:'منصة عربية لإنشاء صفحة روابط ومتجر وخدمات وواتساب وتحليلات.',metadataBase:new URL(process.env.NEXT_PUBLIC_SITE_URL||'http://localhost:3000')};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang='ar' dir='rtl'><body className='min-h-screen'>{children}</body></html>}
