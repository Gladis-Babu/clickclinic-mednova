import { useCallback, useMemo, useState } from "react";
import { AlertTriangle, CalendarCheck, Check, LocateFixed, MapPinned } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLang } from "@/lib/i18n";
import { useNextStepText } from "@/lib/next-step-copy";
import { usePatientText } from "@/lib/patient-copy";
import { demoCareLocations, distanceKm, transition, type CareLocation, type FollowUpStatus, type NextStepType } from "@/lib/next-step-rules";
import CareLocationMap from "@/components/care-location-map";
import { DemoControlNote } from "@/components/demo-control-note";

type Props={type:NextStepType;fasting?:boolean;onStatus?:(s:FollowUpStatus)=>void;onEvent:(action:"auditLocation"|"auditBooked"|"auditCompleted",detail:string)=>void};
export function NextStepCard({type,fasting,onStatus,onEvent}:Props){
  const {lang}=useLang(); const text=useNextStepText(); const pt=usePatientText();
  const [status,setStatus]=useState<FollowUpStatus>("recommended");
  const [selectedId,setSelectedId]=useState<string|null>(null);
  const [ordered,setOrdered]=useState(demoCareLocations);
  const [locating,setLocating]=useState(false); const [geoMessage,setGeoMessage]=useState("");
  const [mapFailed,setMapFailed]=useState(false);
  const selected=useMemo(()=>ordered.find(x=>x.id===selectedId),[ordered,selectedId]);
  const pick=useCallback((id:string)=>{const location=demoCareLocations.find(x=>x.id===id);if(!location)return;setSelectedId(id);setStatus("location_chosen");onStatus?.("location_chosen");onEvent("auditLocation",location.name_en);},[onEvent,onStatus]);
  const advance=(to:FollowUpStatus,action:"auditBooked"|"auditCompleted")=>{if(transition(status,to)!=="allowed")return;setStatus(to);onStatus?.(to);onEvent(action,selected?.name_en??"");};
  const nearest=()=>{if(!navigator.geolocation){setGeoMessage(text.locationDenied);return;}setLocating(true);setGeoMessage("");navigator.geolocation.getCurrentPosition(p=>{const point={lat:p.coords.latitude,lng:p.coords.longitude};setOrdered([...demoCareLocations].sort((a,b)=>distanceKm(point,a)-distanceKm(point,b)));setLocating(false);},()=>{setLocating(false);setGeoMessage(text.locationDenied);},{timeout:6000});};
  const stages:FollowUpStatus[]=["recommended","location_chosen","booked","completed"];
  const labels={recommended:text.recommended,location_chosen:text.locationChosen,booked:text.booked,completed:text.completed};
  const rank=stages.indexOf(status);
  return <section className="rounded-2xl bg-paper ring-1 ring-border" aria-labelledby="next-step-title">
    <div className="border-b border-border p-5 sm:p-6"><p className="text-xs font-semibold uppercase text-brand">{text.title}</p><h3 id="next-step-title" className="mt-2 max-w-2xl font-display text-2xl font-semibold">{type==="diagnostic_consultation"?text.diagnostic:text.pre}</h3><p className="mt-3 text-sm font-medium">{text.timeframe} <span className="font-normal text-muted-foreground">({text.guidance})</span></p></div>
    <div role="list" className="grid grid-cols-2 border-b border-border sm:grid-cols-4">{stages.map((s,i)=><div role="listitem" key={s} className={`flex min-h-16 items-center gap-2 border-border px-3 py-3 text-xs font-medium sm:border-e ${i<=rank?"text-brand":"text-muted-foreground"}`}><span aria-hidden="true" className={`grid size-6 shrink-0 place-items-center rounded-full ring-1 ${i<=rank?"bg-brand text-brand-foreground ring-brand":"bg-mist ring-border"}`}>{i<rank?<Check className="size-3.5"/>:i+1}</span><span>{labels[s]}</span></div>)}</div>
    <div className="grid gap-5 p-5 lg:grid-cols-[1.05fr_0.95fr] lg:p-6">
      <div><div className="mb-3 flex items-center justify-between"><h4 className="flex items-center gap-2 text-sm font-semibold"><MapPinned className="size-4 text-brand"/>{text.map}</h4><Button variant="outline" size="sm" onClick={nearest} disabled={locating}><LocateFixed/>{locating?text.locating:text.nearest}</Button></div>{mapFailed?<div className="grid h-72 place-items-center rounded-xl bg-mist p-6 text-center text-sm text-muted-foreground">{text.mapUnavailable}</div>:<CareLocationMap locations={ordered} selectedId={selectedId} onSelect={pick} onFailure={()=>setMapFailed(true)} label={text.map}/>}<p className="mt-2 text-[11px] text-muted-foreground">© OpenStreetMap contributors</p>{geoMessage&&<p role="status" className="mt-2 text-xs text-operational">{geoMessage}</p>}</div>
      <div><h4 className="mb-3 text-sm font-semibold">{text.list}</h4><div className="space-y-2">{ordered.map((location:CareLocation)=><article key={location.id} className={`rounded-xl p-3 ring-1 ${selectedId===location.id?"bg-brand/5 ring-brand/40":"bg-background ring-border"}`}><div className="flex items-start justify-between gap-3"><div><p className="text-sm font-semibold">{lang==="ar"?location.name_ar:location.name_en}</p><p className="mt-0.5 text-xs text-muted-foreground">{location.address} · {location.service_type==="lab"?text.serviceLab:text.serviceConsultation}</p></div>{selectedId===location.id&&<Check className="size-4 shrink-0 text-success"/>}</div><Button variant={selectedId===location.id?"secondary":"outline"} size="sm" className="mt-3 w-full" onClick={()=>pick(location.id)}>{selectedId===location.id?text.chosen:text.choose}</Button></article>)}</div></div>
    </div>
    <div className="border-t border-border p-5 sm:p-6"><p className="flex items-start gap-2 text-xs text-operational"><AlertTriangle className="mt-0.5 size-4 shrink-0"/>{text.demo}</p><p className="mt-2 text-xs text-muted-foreground">{pt.ramadan}{fasting?` ${pt.fasting}`:""}</p><div className="mt-4 flex flex-col gap-2 sm:flex-row"><Button disabled={status!=="location_chosen"} onClick={()=>advance("booked","auditBooked")}><CalendarCheck/>{text.bookedButton}</Button><Button variant="outline" disabled={status!=="booked"} onClick={()=>advance("completed","auditCompleted")}><Check/>{text.completedButton}</Button></div><DemoControlNote demo={text.demoAction} actual={text.liveAction} className="mt-4" /></div>
  </section>;
}
