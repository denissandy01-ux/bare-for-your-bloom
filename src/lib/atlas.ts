import africa from '@/assets/atlas-africa.jpg';
import caribbean from '@/assets/atlas-caribbean.jpg';
import latin from '@/assets/atlas-latin.jpg';
import asia from '@/assets/atlas-asia.jpg';
import europe from '@/assets/atlas-europe.jpg';
import oceania from '@/assets/atlas-oceania.jpg';
import world from '@/assets/atlas-world.jpg';
import { PRODUCTS } from './data';
export { world as atlasHero };
export const REGIONS=[
 {id:'africa',name:'Africa',description:'Discover African beauty brands',image:africa},
 {id:'caribbean',name:'Caribbean',description:'Island beauty and innovation',image:caribbean},
 {id:'latin-america',name:'Latin America',description:'Discover Latin beauty',image:latin},
 {id:'asia',name:'Asia',description:'Explore Asian beauty',image:asia},
 {id:'europe',name:'Europe',description:'Explore European beauty',image:europe},
 {id:'north-america',name:'North America',description:'Discover emerging brands',image:world},
 {id:'oceania',name:'Oceania',description:'Explore Pacific beauty',image:oceania},
] as const;
export type RegionId=(typeof REGIONS)[number]['id'];
export interface Country {id:string;name:string;flag:string;regions:RegionId[]}
export const COUNTRIES:Country[]=[
 {id:'nigeria',name:'Nigeria',flag:'🇳🇬',regions:['africa']},{id:'ghana',name:'Ghana',flag:'🇬🇭',regions:['africa']},{id:'south-africa',name:'South Africa',flag:'🇿🇦',regions:['africa']},
 {id:'haiti',name:'Haiti',flag:'🇭🇹',regions:['caribbean']},{id:'jamaica',name:'Jamaica',flag:'🇯🇲',regions:['caribbean']},{id:'dominican-republic',name:'Dominican Republic',flag:'🇩🇴',regions:['caribbean','latin-america']},
 {id:'brazil',name:'Brazil',flag:'🇧🇷',regions:['latin-america']},{id:'mexico',name:'Mexico',flag:'🇲🇽',regions:['latin-america','north-america']},
 {id:'south-korea',name:'South Korea',flag:'🇰🇷',regions:['asia']},{id:'japan',name:'Japan',flag:'🇯🇵',regions:['asia']},{id:'india',name:'India',flag:'🇮🇳',regions:['asia']},
 {id:'france',name:'France',flag:'🇫🇷',regions:['europe']},{id:'united-kingdom',name:'United Kingdom',flag:'🇬🇧',regions:['europe']},
 {id:'united-states',name:'United States',flag:'🇺🇸',regions:['north-america']},{id:'canada',name:'Canada',flag:'🇨🇦',regions:['north-america']},
 {id:'australia',name:'Australia',flag:'🇦🇺',regions:['oceania']},{id:'new-zealand',name:'New Zealand',flag:'🇳🇿',regions:['oceania']},
];
export interface Brand { id:string;name:string;countryId:string;manufacturingCountry?:string;regions:RegionId[];image:string;philosophy:string;demo:boolean;emerging:boolean;productIds:string[];founder:{name:string;title:string;story:string};countriesServed:string[];shoppingLinks:{url:string;label:string;countries:string[];international:boolean}[] }
const origins:Record<string,{id:string;countryId:string;region:RegionId;philosophy:string}>={
 'COSRX':{id:'cosrx',countryId:'south-korea',region:'asia',philosophy:'Focused skincare, built around everyday skin concerns.'},
 'Lumière':{id:'lumiere',countryId:'united-states',region:'north-america',philosophy:'Gentle care for a comfortable canvas.'},
 'Rooted Sun':{id:'rooted-sun',countryId:'united-states',region:'north-america',philosophy:'Start with deep skin. Welcome every canvas.'},
 'La Roche-Posay':{id:'la-roche-posay',countryId:'france',region:'europe',philosophy:'Skin comfort at the center of care.'},
 'Pattern':{id:'pattern',countryId:'united-states',region:'north-america',philosophy:'Celebrate the full range of curl patterns.'},
 'ILIA':{id:'ilia',countryId:'united-states',region:'north-america',philosophy:'Let real skin show through.'},
 'Bump Patrol':{id:'bump-patrol',countryId:'united-states',region:'north-america',philosophy:'Grooming centered on skin comfort.'},
 'The Ordinary':{id:'the-ordinary',countryId:'canada',region:'north-america',philosophy:'Clear ingredient names. Straightforward care.'},
};
const existing:Brand[]=PRODUCTS.map(p=>{const o=origins[p.brand];if(!o)throw new Error('Missing brand origin');return {...o,regions:[o.region],name:p.brand,image:p.image,founder:p.founder,productIds:[p.id],demo:true,emerging:!!p.launchpad,countriesServed:[],shoppingLinks:[]};});
const samples=[
 ['lakou-botanics','Lakou Botanics','haiti','caribbean','Care rooted in community, made for everyday rituals.'],
 ['eko-texture','Eko Texture','nigeria','africa','Texture care that celebrates coils and curls.'],
 ['rio-canvas','Rio Canvas','brazil','latin-america','Light-touch beauty for real skin and natural texture.'],
 ['pacific-kind','Pacific Kind','australia','oceania','Simple skin rituals, with comfort at their heart.'],
] as const;
export const BRANDS:Brand[]=[...existing,...samples.map(([id,name,countryId,region,philosophy])=>({id,name,countryId,regions:[region],image:REGIONS.find(r=>r.id===region)?.image??world,philosophy,demo:true,emerging:true,productIds:[],founder:{name:'Illustrative founder collective',title:'Demonstration story',story:philosophy+' This fictional brand illustrates how independent founders will share their story; it is not a live business listing.'},countriesServed:[],shoppingLinks:[]}))];
// Confirmed official product pages are references, not shipping or partnership confirmations.
const ordinary=BRANDS.find(b=>b.id==='the-ordinary');if(ordinary)ordinary.shoppingLinks=[{url:'https://theordinary.com/en-us/100-plant-derived-squalane-face-oil-100398.html',label:'Official product page',countries:[],international:false}];
const ilia=BRANDS.find(b=>b.id==='ilia');if(ilia)ilia.shoppingLinks=[{url:'https://iliabeauty.com/products/super-serum-skin-tint-spf-40',label:'Official product page',countries:[],international:false}];
export const brandById=(id:string)=>BRANDS.find(b=>b.id===id);
export const brandForProduct=(id:string)=>BRANDS.find(b=>b.productIds.includes(id));
export const countryById=(id:string)=>COUNTRIES.find(c=>c.id===id);
export const regionById=(id:string)=>REGIONS.find(r=>r.id===id);
export function shoppingStatus(brand:Brand,country:string){return brand.shoppingLinks.some(l=>l.countries.includes(country))?'Available in Your Country':brand.shoppingLinks.some(l=>l.international)?'International Shipping Available':'Availability Not Confirmed';}
export function searchAtlas(query:string){const q=query.trim().toLowerCase();return {countries:COUNTRIES.filter(c=>c.name.toLowerCase().includes(q)),brands:BRANDS.filter(b=>`${b.name} ${countryById(b.countryId)?.name??''}`.toLowerCase().includes(q)),products:PRODUCTS.filter(p=>`${p.name} ${p.brand} ${p.category}`.toLowerCase().includes(q))};}
export function atlasHead(title:string,description:string){return {meta:[{title:`${title} · Becoming Bare`},{name:'description',content:description},{property:'og:title',content:`${title} · Becoming Bare`},{property:'og:description',content:description},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary_large_image'}]};}
