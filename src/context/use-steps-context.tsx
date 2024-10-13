'use client';
import React, { useState, createContext, useContext } from 'react';
/**
 * starts at step 1 and can keep going
 * use it wherever you need to display different UI based on steps
 */
type InitialValuesProps = {
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
};

const InitialValues: InitialValuesProps = {
  currentStep: 1,
  setCurrentStep: () => undefined,
};

const stepsContext = createContext(InitialValues);

const { Provider } = stepsContext;

export const StepsProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentStep, setCurrentStep] = useState<number>(
    InitialValues.currentStep
  );

  const values = {
    currentStep,
    setCurrentStep,
  };
  return <Provider value={values}>{children}</Provider>;
};

export const useStepsContext = () => {
  const state = useContext(stepsContext);
  return state;
};
