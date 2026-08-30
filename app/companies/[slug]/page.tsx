import { notFound } from 'next/navigation'
import { getAwardCompanyBySlug, getAwardHistoryByCompany } from '@/lib/data'
import AwardCompanyView from '@/components/award-company-view'

export default async function AwardCompanyPage({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params
  const company=await getAwardCompanyBySlug(slug)
  if(!company)notFound()
  const history=await getAwardHistoryByCompany(company.id)
  return <AwardCompanyView company={company} history={history}/>
}
