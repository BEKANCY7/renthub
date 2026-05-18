/**
 * @jest-environment jsdom
 */

jest.mock("../api", () => ({
  clearAuthTokens: jest.fn(),
  logoutFromExternalAPI: jest.fn(),
}));

import { logout } from "../logout";
import { clearAuthTokens, logoutFromExternalAPI } from "../api";

describe("logout", () => {
  const mockedLogoutApi = logoutFromExternalAPI as jest.MockedFunction<
    typeof logoutFromExternalAPI
  >;
  const mockedClearTokens = clearAuthTokens as jest.MockedFunction<
    typeof clearAuthTokens
  >;

  let assignSpy: jest.Mock;
  let originalLocation: Location;

  beforeEach(() => {
    jest.clearAllMocks();

    // Replace window.location with a mock that captures href assignments
    originalLocation = window.location;
    assignSpy = jest.fn();
    delete (window as any).location;
    (window as any).location = {
      ...originalLocation,
      set href(value: string) {
        assignSpy(value);
      },
      get href() {
        return originalLocation.href;
      },
    };

    document.cookie = "auth_token=abc123; path=/";
  });

  afterEach(() => {
    (window as any).location = originalLocation;
  });

  it("calls logoutFromExternalAPI and clearAuthTokens on success", async () => {
    mockedLogoutApi.mockResolvedValueOnce(undefined as any);

    await logout();

    expect(mockedLogoutApi).toHaveBeenCalledTimes(1);
    expect(mockedClearTokens).toHaveBeenCalledTimes(1);
  });

  it("still clears tokens and redirects when the API call rejects", async () => {
    mockedLogoutApi.mockRejectedValueOnce(new Error("network down"));
    const errSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    await logout();

    expect(mockedClearTokens).toHaveBeenCalledTimes(1);
    expect(assignSpy).toHaveBeenCalledWith("/login");
    expect(errSpy).toHaveBeenCalled();
    errSpy.mockRestore();
  });

  it("clears the auth_token cookie", async () => {
    mockedLogoutApi.mockResolvedValueOnce(undefined as any);

    await logout();

    expect(document.cookie).not.toContain("auth_token=abc123");
  });

  it("redirects to the provided callbackUrl", async () => {
    mockedLogoutApi.mockResolvedValueOnce(undefined as any);

    await logout("/goodbye");

    expect(assignSpy).toHaveBeenCalledWith("/goodbye");
  });

  it("defaults the redirect to /login when no url is passed", async () => {
    mockedLogoutApi.mockResolvedValueOnce(undefined as any);

    await logout();

    expect(assignSpy).toHaveBeenCalledWith("/login");
  });
});
