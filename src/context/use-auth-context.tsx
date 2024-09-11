'use client'
import React, {useState, createContext, useContext} from 'react'

type InitialValuesProps = {
  currentStep: number,
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>
}

const InitialValues: InitialValuesProps = {
  currentStep: 1,
  setCurrentStep: () => undefined
}

const authContext = createContext(InitialValues)

const { Provider } = authContext
 
export const AuthContextProvider = ({children} : {
  children: React.ReactNode
}) => {
  const [currentStep, setCurrentStep] = useState<number>(InitialValues.currentStep)

  const values = {
    currentStep,
    setCurrentStep
  }
  return (
    <Provider value={values}>
      {children}
    </Provider>
  )
}

export const useAuthContext = () => {
  const state = useContext(authContext)
  return state
}