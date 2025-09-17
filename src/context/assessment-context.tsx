'use client';

import type { EvaluateIELTSWritingOutput } from '@/ai/flows/evaluate-ielts-writing';
import { createContext, useContext, useReducer, Dispatch, ReactNode } from 'react';

// We can reuse the output type from the flow
export type AssessmentResult = EvaluateIELTSWritingOutput & {
  task?: {
    type: string;
    question: string;
    word_count: number;
  }
};


type State = {
  isLoading: boolean;
  error: string | null;
  result: AssessmentResult | null;
};

type Action =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_RESULT'; payload: AssessmentResult | null };

const initialState: State = {
  isLoading: false,
  error: null,
  result: null,
};

const AssessmentContext = createContext<{
  state: State;
  dispatch: Dispatch<Action>;
} | undefined>(undefined);

function assessmentReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload, error: null, result: null };
    case 'SET_RESULT':
      return { ...state, result: action.payload, isLoading: false, error: null };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false, result: null };
    default:
      return state;
  }
}

export function AssessmentProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(assessmentReducer, initialState);
  return (
    <AssessmentContext.Provider value={{ state, dispatch }}>
      {children}
    </AssessmentContext.Provider>
  );
}

export function useAssessment() {
  const context = useContext(AssessmentContext);
  if (context === undefined) {
    throw new Error('useAssessment must be used within an AssessmentProvider');
  }
  return context;
}
