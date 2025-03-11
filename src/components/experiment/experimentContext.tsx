import { type Experiment } from '@/api/models';
import { createContext, type PropsWithChildren, useContext } from 'react';

const experimentContext = createContext<Experiment | undefined>(undefined);

export const useExperiment = () => {
  const experiment = useContext(experimentContext);
  if (!experiment) {
    throw new Error('useExperiment must be used within an ExperimentProvider');
  }
  return experiment;
};
export const ExperimentProvider = ({
  experiment,
  children,
}: PropsWithChildren<{ experiment: Experiment }>) => (
  <experimentContext.Provider value={experiment}>{children}</experimentContext.Provider>
);
