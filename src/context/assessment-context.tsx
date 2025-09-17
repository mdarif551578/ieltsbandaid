'use client';

import { createContext, useContext, useReducer, Dispatch, ReactNode } from 'react';

export interface AssessmentResult {
  candidate: {
    name: string;
    email: string;
  };
  task: {
    type: string;
    question: string;
    word_count: number;
  };
  assessment: {
    task_achievement_or_response: {
      band: number;
      justification: string;
      examples: {
        strengths: string[];
        weaknesses: string[];
      };
      improvements: string[];
    };
    coherence_and_cohesion: {
      band: number;
      justification: string;
      examples: {
        strengths: string[];
        weaknesses: string[];
      };
      improvements: string[];
    };
    lexical_resource: {
      band: number;
      justification: string;
      examples: {
        strengths: string[];
        weaknesses: string[];
      };
      improvements: string[];
    };
    grammatical_range_and_accuracy: {
      band: number;
      justification: string;
      examples: {
        strengths: string[];
        weaknesses: string[];
      };
      improvements: string[];
    };
    overall_band_score: number;
  };
  feedback: {
    overall_strengths: string[];
    overall_weaknesses: string[];
    key_recommendations: string[];
    summary: string;
  };
  transcribedAnswer: string;
  cefrLevel: string;
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
