"use client";

import React, { useState } from "react";
import { analyzeResumeAction } from "@/lib/gemini";
import { DiagnosticResult } from "@/lib/types";
import DiagnosticDisplay from "@/components/diagnosticDisplay";

export default function RootPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DiagnosticResult | null>(null);
  const [role, setRole] = useState("");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const buffer = await file.arrayBuffer();
      const base64 = btoa(
        new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), "")
      );

      const diagnostic = await analyzeResumeAction(base64, role);
      setResult(diagnostic);
    } catch (err) {
      alert("Diagnostic failed. Ensure the file is a valid PDF.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex h-screen w-full bg-white overflow-hidden text-gray-900">
      <section className="w-1/3 border-r border-gray-100 p-10 flex flex-col justify-between bg-gray-50/50">
        <div className="space-y-12">
          <h1 className="text-xl font-black tracking-tighter uppercase">Resume Diagnostic</h1>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-500">Benchmark Role</label>
              <input
                type="text"
                placeholder="Senior Backend Engineer"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-white border border-gray-200 p-3 text-xs outline-none focus:border-black transition-colors"
              />
            </div>

            <div className="relative group">
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                disabled={loading}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
              />
              <div className="border-2 border-dashed border-gray-200 group-hover:border-black p-8 text-center transition-all">
                <p className="text-xs font-bold uppercase tracking-widest">
                  {loading ? "Processing..." : "Upload / Drop Resume PDF"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="flex-1 p-16 overflow-y-auto">
        {result ? (
          <DiagnosticDisplay data={result} />
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.4em]">
              {loading ? "Calculating Signals..." : "Awaiting Document"}
            </p>
          </div>
        )}
      </section>
    </main>
  );
}