export interface DiagnosticResult {
    effectiveLevel: string;
    blockingGaps: string[];
    upgradePlan: string[];
    ignoreList: string[];
}

export interface AnalysisState {
    loading: boolean;
    result: DiagnosticResult | null;
    error: string | null;
}