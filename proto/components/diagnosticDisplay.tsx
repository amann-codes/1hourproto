import { DiagnosticResult } from "@/lib/types";

export default function DiagnosticDisplay({ data }: { data: DiagnosticResult }) {
    return (
        <div className="h-full flex flex-col space-y-10 animate-in fade-in duration-500">
            <section>
                <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Effective Level</h2>
                <p className="text-sm font-bold border-b border-gray-200 pb-4">{data.effectiveLevel}</p>
            </section>

            <section>
                <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Blocking Gaps</h2>
                <div className="space-y-3">
                    {data.blockingGaps.map((gap, i) => (
                        <p key={i} className="text-xs leading-relaxed font-medium text-gray-900 bg-gray-50 p-2 border-l-2 border-gray-900">
                            {gap}
                        </p>
                    ))}
                </div>
            </section>

            <section>
                <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">14-Day Upgrade Plan</h2>
                <div className="grid grid-cols-1 gap-2">
                    {data.upgradePlan.map((step, i) => (
                        <div key={i} className="flex gap-4 items-baseline">
                            <span className="text-[10px] font-mono font-bold text-gray-400 w-16 shrink-0">{step.split(':')[0]}</span>
                            <span className="text-xs text-gray-700">{step.split(':').slice(1).join(':').trim()}</span>
                        </div>
                    ))}
                </div>
            </section>

            <section>
                <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Do NOT spend time on:</h2>
                <ul className="space-y-1">
                    {data.ignoreList.map((item, i) => (
                        <li key={i} className="text-[10px] font-bold text-gray-500 uppercase tracking-tight">- {item}</li>
                    ))}
                </ul>
            </section>
        </div>
    );
}