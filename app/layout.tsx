import {PageTransitions} from '@/components/page-transitions';
import type {Metadata} from 'next';import './globals.css';import {Provider} from '@/components/provider';
export const metadata:Metadata={title:{default:'Bloom — Make room for what matters',template:'%s · Bloom'},icons:{icon:'/icon.svg'},description:'A calmer, more human way to plan your day. Work with your energy, find your focus, and grow at your own pace.'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body><a className="skip-link" href="#main-content">Skip to content</a><Provider><PageTransitions>{children}</PageTransitions></Provider></body></html>;}
