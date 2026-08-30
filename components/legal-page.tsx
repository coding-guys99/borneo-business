'use client'
import {usePathname} from 'next/navigation'
import FormalPolicyPage from '@/components/formal-policy-page'

export type LegalSection={title:string;body:string[]}
const routeMap:Record<string,'about'|'purpose'|'dataSources'|'dataAccuracy'|'translation'|'terms'|'privacy'|'disclaimer'|'thirdParty'>={
 '/about':'about','/purpose':'purpose','/trust/data-sources':'dataSources','/trust/data-accuracy':'dataAccuracy','/trust/translation':'translation','/legal/terms':'terms','/legal/privacy':'privacy','/legal/disclaimer':'disclaimer','/legal/third-party':'thirdParty'
}
export default function LegalPage(_: {eyebrow:string;title:string;intro:string;sections:LegalSection[];note?:string}){const path=usePathname();return <FormalPolicyPage page={routeMap[path]??'about'}/>}
