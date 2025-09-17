'use client';

import { createContext, useContext, useReducer, Dispatch, ReactNode } from 'react';

// This will be the shape of our AI's evaluation result
export interface AssessmentResult {
  overallBandScore: number;
  cefrLevel: string;
  taskAchievementResponse: {
    bandScore: number;
    justification: string;
    strengths: string[];
    weaknesses: string[];
    improvements: string[];
  };
  coherenceAndCohesion: {
    bandScore: number;
    justification: string;
    strengths: string[];
    weaknesses: string[];
    improvements: string[];
  };
  lexicalResource: {
    bandScore: number;
    justification: string;
    strengths: string[];
    weaknesses: string[];
    improvements: string[];
  };
  grammaticalRangeAndAccuracy: {
    bandScore: number;
    justification: string;
    strengths: string[];
    weaknesses: string[];
    improvements: string[];
  };
  overallStrengths: string[];
  overallWeaknesses: string[];
  keyRecommendations: string[];
  transcribedAnswer: string;
  question: string;
  taskType: string;
}


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
      return { ...state, isLoading: action.payload, error: null };
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
