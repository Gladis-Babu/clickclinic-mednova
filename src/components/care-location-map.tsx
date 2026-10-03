import { useEffect, useRef } from "react";
import type { CareLocation } from "@/lib/next-step-rules";
import "leaflet/dist/leaflet.css";

type Props={locations:CareLocation[];selectedId:string|null;onSelect:(id:string)=>void;onFailure:()=>void;label:string};
export default function CareLocationMap({locations,selectedId,onSelect,onFailure,label}:Props){
  const ref=useRef<HTMLDivElement>(null);
  useEffect(()=>{
    if(!ref.current)return;
    let disposed=false;
    let map:{remove:()=>void}|undefined;
    void import("leaflet").then(L=>{
      if(disposed||!ref.current)return;
      const instance=L.map(ref.current,{scrollWheelZoom:false}).setView([25.20,55.27],9);
      map=instance;
      const tiles=L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:"© OpenStreetMap contributors"});
      tiles.on("tileerror",onFailure).addTo(instance);
      locations.forEach(location=>L.circleMarker([location.lat,location.lng],{radius:location.id===selectedId?10:7,color:"var(--brand)",fillColor:location.id===selectedId?"var(--success)":"var(--accent)",fillOpacity:0.9,weight:3}).addTo(instance).on("click",()=>onSelect(location.id)).bindTooltip(location.name_en));
    }).catch(onFailure);
    return()=>{disposed=true;map?.remove();};
  },[locations,selectedId,onFailure,onSelect]);
  return <div ref={ref} className="h-72 w-full rounded-xl bg-mist" aria-label={label}/>;
}
