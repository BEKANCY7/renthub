/// <reference types="jest" />
import { DEMO_MODE, mockApiCall, shouldUseMockData } from "../config";

describe("DEMO_MODE", () => {
  it("is enabled by default in this build", () => {
    expect(DEMO_MODE).toBe(true);
  });
});

describe("shouldUseMockData", () => {
  it("mirrors DEMO_MODE", () => {
    expect(shouldUseMockData()).toBe(DEMO_MODE);
  });
});

describe("mockApiCall", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("resolves with the provided data after the configured delay", async () => {
    const promise = mockApiCall({ id: 1, name: "Test" }, 200);
    jest.advanceTimersByTime(200);
    await expect(promise).resolves.toEqual({ id: 1, name: "Test" });
  });

  it("uses the default 500ms delay when none is provided", async () => {
    const promise = mockApiCall("hello");
    jest.advanceTimersByTime(499);
    let settled = false;
    promise.then(() => {
      settled = true;
    });
    await Promise.resolve();
    expect(settled).toBe(false);

    jest.advanceTimersByTime(1);
    await expect(promise).resolves.toBe("hello");
  });

  it("preserves complex object shapes", async () => {
    const payload = { nested: { list: [1, 2, 3] }, ok: true };
    const promise = mockApiCall(payload, 0);
    jest.advanceTimersByTime(0);
    await expect(promise).resolves.toBe(payload);
  });
});
