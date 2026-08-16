export type RoutineStepCard = {
  title: string;
  detail: string;
};

export type RoutineCautionCard = {
  title: string;
  detail: string;
};

export type StructuredRoutinePlan = {
  focus: string;
  morning: RoutineStepCard[];
  night: RoutineStepCard[];
  cautions: RoutineCautionCard[];
  source: "ai" | "template";
};
