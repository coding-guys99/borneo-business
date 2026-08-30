import fs from 'node:fs'

function ok(condition,message){if(!condition)throw new Error(message)}

const source=fs.readFileSync(new URL('../lib/source-compliance.ts',import.meta.url),'utf8')
const docs=fs.readFileSync(new URL('../docs/DATA_COMPLIANCE.md',import.meta.url),'utf8')

ok(source.includes("host:'data.sarawak.gov.my'"),'Sarawak Data must have an explicit compliance rule')
ok(source.includes("host:'etendernotice.sarawak.gov.my'"),'Sarawak eTender must have an explicit compliance rule')
ok(source.includes("host:'jkr.sarawak.gov.my'"),'JKR Sarawak must have an explicit compliance rule')
ok(source.includes("reuseClass:'open-data'"),'At least one reviewed open-data source is required')
ok(source.includes("reuseClass:'public-facts-only'"),'Public procurement sources must support facts-only classification')
ok(source.includes("reuseClass:'manual-review'"),'Unknown sources must default to manual review')
ok(source.includes("crawlMethod:'manual-only'"),'Unknown sources must not be automatically crawled')
ok(source.includes('Do not bypass login, CAPTCHA, access controls, rate limits or technical restrictions.'),'eTender rule must prohibit technical circumvention')
ok(docs.includes('Do not present Borneo Business as an official government service'),'Operating rules must prohibit official impersonation')
ok(docs.includes('Unknown sources default to manual review'),'Operating rules must require source review before automation')
ok(docs.includes('Do not infer tender-specific eligibility'),'Operating rules must protect tender-specific eligibility claims')
ok(docs.includes('Do not publish sensitive personal data'),'Operating rules must include personal-data review')

console.log('SOURCE COMPLIANCE PASS')
