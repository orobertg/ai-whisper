"use client";
import { Tldraw } from "tldraw";
import "tldraw/tldraw.css";

export default function Canvas() {
  return (
    <div className="card overflow-hidden" style={{height: 420}}>
      <Tldraw />
    </div>
  );
}
