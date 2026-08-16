import { createTask, getTaskId, getYouCamRuntime } from "./youcam";

type SimulationInput = {
  fileId?: string | null;
  imageUrl?: string | null;
  forceDemo?: boolean;
};

export async function runSkinSimulation(input: SimulationInput) {
  const runtime = getYouCamRuntime();

  if (runtime.shouldMock || input.forceDemo || (!input.fileId && !input.imageUrl)) {
    const taskId = `mock-simulation-${Date.now()}`;
    return {
      mode: "demo" as const,
      status: "processing" as const,
      message: "Demo skin simulation started. Showing representative improvement preview.",
      pollingUrl: `/api/skinova/simulation-status/${encodeURIComponent(taskId)}`
    };
  }

  const task = await createTask({
    workflow: "skin-simulation",
    fileId: input.fileId || undefined,
    imageUrl: input.imageUrl || undefined
  });
  const taskId = getTaskId(task);

  if (!taskId) {
    throw new Error("Skin simulation could not be started. Please try again.");
  }

  return {
    mode: "live" as const,
    status: "processing" as const,
    message: "Live YouCam Skin Simulation started.",
    pollingUrl: `/api/skinova/simulation-status/${encodeURIComponent(taskId)}`
  };
}
