import {NextRequest,NextResponse} from 'next/server'

const allowedHosts=new Set(['etendernotice.sarawak.gov.my','jkr.sarawak.gov.my'])

function decodeEntities(input:string){return input
  .replace(/&nbsp;/gi,' ')
  .replace(/&amp;/gi,'&')
  .replace(/&lt;/gi,'<')
  .replace(/&gt;/gi,'>')
  .replace(/&quot;/gi,'"')
  .replace(/&#39;/gi,"'")
  .replace(/&#(\d+);/g,(_,n)=>String.fromCharCode(Number(n)))}

function htmlToText(html:string){return decodeEntities(html)
  .replace(/<script[\s\S]*?<\/script>/gi,' ')
  .replace(/<style[\s\S]*?<\/style>/gi,' ')
  .replace(/<(br|\/p|\/div|\/tr|\/li|\/h[1-6]|\/td|\/th)>/gi,'\n')
  .replace(/<[^>]+>/g,' ')
  .replace(/[ \t]+/g,' ')
  .replace(/\n\s*\n+/g,'\n')
  .trim()}

export async function GET(req:NextRequest){
  const raw=req.nextUrl.searchParams.get('url')
  if(!raw)return NextResponse.json({error:'Missing source URL'},{status:400})
  let url:URL
  try{url=new URL(raw)}catch{return NextResponse.json({error:'Invalid source URL'},{status:400})}
  if(url.protocol!=='https:'||!allowedHosts.has(url.hostname))return NextResponse.json({error:'Unsupported official source'},{status:400})

  try{
    const response=await fetch(url.toString(),{cache:'no-store',headers:{'User-Agent':'BorneoBusiness/1.0'}})
    if(!response.ok)return NextResponse.json({error:'Official source could not be retrieved'},{status:502})
    const contentType=response.headers.get('content-type')||''
    if(contentType.includes('application/pdf')){
      const bytes=await response.arrayBuffer()
      return new NextResponse(bytes,{headers:{'Content-Type':'application/pdf','Content-Disposition':'attachment; filename="official-tender-document.pdf"'}})
    }
    const html=await response.text()
    const text=htmlToText(html)
    if(text.length<50)return NextResponse.json({error:'Official source did not return readable tender content'},{status:502})
    return NextResponse.json({sourceUrl:url.toString(),text})
  }catch{return NextResponse.json({error:'Official source could not be retrieved'},{status:502})}
}
