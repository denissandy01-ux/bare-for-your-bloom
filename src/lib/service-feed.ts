import nails from '@/assets/specialist-nails.jpg';
import braids from '@/assets/service-braids.jpg';
import blowout from '@/assets/service-blowout.jpg';
import brows from '@/assets/service-brows.jpg';
import curls from '@/assets/feed-olive-waves.jpg';
export interface ServicePost {id:string; specialistId:string;image:string;title:string;caption:string;category:string;texture?:string}
export const SERVICE_FEED:ServicePost[]=[
 {id:'s1',specialistId:'imani-brooks',image:nails,title:'Your nails, only stronger.',caption:'Structured gel, thoughtful prep and a shade that feels like you.',category:'Nails'},
 {id:'s2',specialistId:'sofia-reyes',image:curls,title:'A salon for every pattern.',caption:'Texture-first shaping. Your curls set the plan.',category:'Hair',texture:'3 Curly'},
 {id:'s3',specialistId:'amara-reed',image:braids,title:'Knotless. Weightless. Yours.',caption:'Clean parts and a gentle finish, with care for the scalp underneath.',category:'Braids',texture:'4C Coily'},
 {id:'s4',specialistId:'sofia-reyes',image:blowout,title:'The soft, bouncy blowout.',caption:'Volume with movement, finished around your natural texture.',category:'Blowout',texture:'2 Wavy'},
 {id:'s5',specialistId:'zara-mitchell',image:brows,title:'Brows, softly defined.',caption:'Natural shaping that follows your face, never a stencil.',category:'Brows'}
];
export function mixFeed<T>(products:T[],services:ServicePost[]):({kind:'product';post:T}|{kind:'service';post:ServicePost})[]{
 const mixed:({kind:'product';post:T}|{kind:'service';post:ServicePost})[]=[];
 for(let i=0;i<Math.max(products.length,services.length);i++){const p=products[i],s=services[i];if(p)mixed.push({kind:'product',post:p});if(s)mixed.push({kind:'service',post:s});}return mixed;
}
