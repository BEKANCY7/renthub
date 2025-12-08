// Configuration for demo mode
export const DEMO_MODE = true;

// Mock API response helper
export async function mockApiCall<T>(data: T, delay = 500): Promise<T> {
  if (!DEMO_MODE) {
    throw new Error("This should only be used in demo mode");
  }
  await new Promise((resolve) => setTimeout(resolve, delay));
  return data;
}

// Check if we should use real API or mock data
export function shouldUseMockData(): boolean {
  return DEMO_MODE;
}
