import { useEffect, useRef, useState } from 'react';
import { Camera, FlipHorizontal, Upload, Video, X, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { mediaError } from '@/lib/community';
import { toast } from 'sonner';

export function CreateCapture({mode,onFile,onBack}:{mode:'Video'|'Photo';onFile:(file:File)=>void;onBack:()=>void}) {
  const video=useRef<HTMLVideoElement>(null), picker=useRef<HTMLInputElement>(null), stream=useRef<MediaStream|null>(null), recorder=useRef<MediaRecorder|null>(null), mounted=useRef(true);
  const [live,setLive]=useState(false),[recording,setRecording]=useState(false),[facing,setFacing]=useState<'user'|'environment'>('user'),[error,setError]=useState(''),[opening,setOpening]=useState(false);
  function stopCamera(){stream.current?.getTracks().forEach(t=>t.stop());stream.current=null;setLive(false);}
  useEffect(()=>{mounted.current=true;return()=>{mounted.current=false;if(recorder.current?.state==='recording')recorder.current.stop();stream.current?.getTracks().forEach(t=>t.stop());};},[]);
  async function openCamera(direction=facing) {
    setError('');setOpening(true);stopCamera();
    try {if(!navigator.mediaDevices?.getUserMedia)throw new Error('Camera access is unavailable here. Upload a file instead.');
      const next=await navigator.mediaDevices.getUserMedia({video:{facingMode:direction},audio:mode==='Video'});
      if(!mounted.current){next.getTracks().forEach(t=>t.stop());return;}
      stream.current=next;if(video.current){video.current.srcObject=next;await video.current.play();}setLive(true);setFacing(direction);
    }catch{setError('Camera access was not available. Check your camera permission or upload a file.');}finally{setOpening(false);}
  }
  function choose(file?:File){if(!file)return;const invalid=mediaError(file);if(invalid){toast.error(invalid);return;}if(mode==='Photo'&&!file.type.startsWith('image/')||mode==='Video'&&!file.type.startsWith('video/')){toast.error(`Choose a ${mode.toLowerCase()} file.`);return;}stopCamera();onFile(file);}
  async function shutter(){
    if(!live){await openCamera();return;}
    if(mode==='Photo'){
      const el=video.current;if(!el||!el.videoWidth)return;const canvas=document.createElement('canvas');canvas.width=el.videoWidth;canvas.height=el.videoHeight;canvas.getContext('2d')?.drawImage(el,0,0);canvas.toBlob(blob=>{if(blob)choose(new File([blob],'capture.jpg',{type:'image/jpeg'}));},'image/jpeg',.9);return;
    }
    if(recording){recorder.current?.stop();return;}
    if(!stream.current||typeof MediaRecorder==='undefined'){setError('Video recording is not supported in this browser. Upload an existing video.');return;}
    const mime=['video/webm;codecs=vp9,opus','video/webm','video/mp4'].find(t=>MediaRecorder.isTypeSupported(t));
    try {const r=new MediaRecorder(stream.current,mime?{mimeType:mime}:undefined);recorder.current=r;const chunks:Blob[]=[];let bytes=0;
      r.ondataavailable=e=>{chunks.push(e.data);bytes+=e.data.size;if(bytes>48*1024*1024&&r.state==='recording')r.stop();};
      r.onstop=()=>{if(!mounted.current)return;setRecording(false);const type=r.mimeType.split(';')[0]||'video/webm';choose(new File(chunks,`recording.${type==='video/mp4'?'mp4':'webm'}`,{type}));};
      r.start(1000);setRecording(true);
    }catch{setError('Recording could not start. Upload a video instead.');}
  }
  return <div className="space-y-4"><header className="grid h-14 grid-cols-[44px_1fr_44px] items-center"><Button variant="ghost" size="icon" aria-label="Close capture" onClick={onBack}><X/></Button><h1 className="text-center font-display text-2xl font-semibold italic">New {mode}</h1><span/></header>
    <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-cocoa text-oat"><video ref={video} autoPlay muted playsInline className="h-full w-full object-cover"/>{!live&&<div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center">{mode==='Video'?<Video className="h-12 w-12"/>:<Camera className="h-12 w-12"/>}<Button onClick={()=>void openCamera()} disabled={opening}>{opening?'Opening camera…':'Open camera'}</Button>{error&&<p role="alert" className="text-sm">{error}</p>}</div>}
      <div className="absolute inset-x-0 bottom-0 space-y-5 bg-cocoa/75 px-5 py-5"><div className="flex justify-center gap-2"><Button variant="secondary" className="rounded-full" disabled={recording} onClick={()=>void openCamera()}> {mode==='Video'?'Record':'Camera'}</Button><Button variant="ghost" className="rounded-full hover:bg-cocoa-soft hover:text-oat" disabled={recording} onClick={()=>picker.current?.click()}>Upload</Button></div><div className="flex items-center justify-between"><Button variant="ghost" size="icon" aria-label="Upload from gallery" disabled={recording} onClick={()=>picker.current?.click()}><Upload/></Button><Button className="h-16 w-16 rounded-full border-4 border-oat p-0" disabled={opening} aria-label={mode==='Photo'?'Take photo':recording?'Stop recording':'Start recording'} onClick={()=>void shutter()}>{recording?<Square className="!h-7 !w-7 fill-current"/>:mode==='Photo'?<Camera className="!h-7 !w-7"/>:<span className="h-10 w-10 rounded-full bg-primary"/>}</Button><Button variant="ghost" size="icon" aria-label="Flip camera" disabled={!live||recording} onClick={()=>void openCamera(facing==='user'?'environment':'user')}><FlipHorizontal/></Button></div>{recording&&<p role="status" className="text-center text-xs">Recording…</p>}</div>
    </div><input hidden ref={picker} type="file" aria-label={`Upload ${mode.toLowerCase()}`} accept={mode==='Video'?'video/mp4,video/webm,video/quicktime':'image/jpeg,image/png,image/webp'} onChange={e=>choose(e.target.files?.[0])}/></div>;
}