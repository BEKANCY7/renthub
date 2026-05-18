import {
  containsContactInfo,
  filterMessage,
  generateWarningMessage,
  logContactSharingAttempt,
} from "../messageFilter";

describe("filterMessage", () => {
  it("returns the original message unchanged when no contact info is present", () => {
    const msg = "Hello, I am interested in renting the apartment.";
    const result = filterMessage(msg);
    expect(result.wasFiltered).toBe(false);
    expect(result.filteredMessage).toBe(msg);
    expect(result.detectedPatterns).toEqual([]);
  });

  it("filters phone numbers", () => {
    const result = filterMessage("Call me at 555-123-4567 anytime.");
    expect(result.wasFiltered).toBe(true);
    expect(result.detectedPatterns).toContain("PHONE");
    expect(result.filteredMessage).not.toContain("555-123-4567");
    expect(result.filteredMessage).toContain("Phone number removed");
  });

  it("filters email addresses", () => {
    const result = filterMessage("Email me at user@example.com please.");
    expect(result.wasFiltered).toBe(true);
    expect(result.detectedPatterns).toContain("EMAIL");
    expect(result.filteredMessage).not.toContain("user@example.com");
    expect(result.filteredMessage).toContain("Email address removed");
  });

  it("filters multiple types in the same message", () => {
    const result = filterMessage(
      "Email me at user@example.com or call 555-123-4567."
    );
    expect(result.wasFiltered).toBe(true);
    expect(result.detectedPatterns).toContain("EMAIL");
    expect(result.detectedPatterns).toContain("PHONE");
    expect(result.filteredMessage).not.toContain("user@example.com");
    expect(result.filteredMessage).not.toContain("555-123-4567");
  });

  it("filters WhatsApp links", () => {
    const result = filterMessage("Reach me on https://wa.me/15551234567 anytime");
    expect(result.wasFiltered).toBe(true);
    expect(result.detectedPatterns).toContain("MESSAGING_LINKS");
    expect(result.filteredMessage).not.toContain("wa.me/15551234567");
  });

  it("filters Telegram messaging links", () => {
    const result = filterMessage("Message me at https://t.me/myhandle now");
    expect(result.wasFiltered).toBe(true);
    expect(result.detectedPatterns).toContain("MESSAGING_LINKS");
    expect(result.filteredMessage).not.toContain("t.me/myhandle");
  });

  it("preserves the surrounding text around filtered content", () => {
    const result = filterMessage(
      "Hello, my email is test@example.org thanks."
    );
    expect(result.filteredMessage).toContain("Hello,");
    expect(result.filteredMessage).toContain("thanks.");
    expect(result.filteredMessage).not.toContain("test@example.org");
  });

  it("returns an empty detectedPatterns list when nothing matches", () => {
    const result = filterMessage("Just a friendly hello!");
    expect(result.detectedPatterns).toEqual([]);
  });
});

describe("containsContactInfo", () => {
  it("returns true when a phone number is present", () => {
    expect(containsContactInfo("call 555-987-6543")).toBe(true);
  });

  it("returns true when an email is present", () => {
    expect(containsContactInfo("write to me at foo@bar.com")).toBe(true);
  });

  it("returns true when a messaging link is present", () => {
    expect(containsContactInfo("https://wa.me/15551112222")).toBe(true);
  });

  it("returns false for plain conversational text", () => {
    expect(
      containsContactInfo("Hi! Is the property available next week?")
    ).toBe(false);
  });
});

describe("generateWarningMessage", () => {
  it("returns an empty string when no patterns are detected", () => {
    expect(generateWarningMessage([])).toBe("");
  });

  it("mentions phone numbers when only PHONE is detected", () => {
    const warning = generateWarningMessage(["PHONE"]);
    expect(warning).toContain("phone numbers");
    expect(warning).not.toContain("email addresses");
  });

  it("mentions email addresses when only EMAIL is detected", () => {
    const warning = generateWarningMessage(["EMAIL"]);
    expect(warning).toContain("email addresses");
    expect(warning).not.toContain("phone numbers");
  });

  it("mentions both when PHONE and EMAIL are detected", () => {
    const warning = generateWarningMessage(["PHONE", "EMAIL"]);
    expect(warning).toContain("phone numbers");
    expect(warning).toContain("email addresses");
  });

  it("mentions messaging links for SOCIAL_MEDIA", () => {
    const warning = generateWarningMessage(["SOCIAL_MEDIA"]);
    expect(warning).toContain("external messaging links");
  });

  it("mentions messaging links for MESSAGING_LINKS", () => {
    const warning = generateWarningMessage(["MESSAGING_LINKS"]);
    expect(warning).toContain("external messaging links");
  });

  it("falls back to a generic message for other pattern types", () => {
    const warning = generateWarningMessage(["EXTERNAL_URLS"]);
    expect(warning).toContain("contact information");
  });

  it("always includes the security base warning when patterns exist", () => {
    const warning = generateWarningMessage(["PHONE"]);
    expect(warning).toContain("For your security");
  });
});

describe("logContactSharingAttempt", () => {
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it("logs the user id and detected patterns", () => {
    logContactSharingAttempt("user-123", "my email is foo@bar.com", [
      "EMAIL",
    ]);
    expect(consoleSpy).toHaveBeenCalledTimes(1);
    const [prefix, payload] = consoleSpy.mock.calls[0];
    expect(prefix).toContain("user-123");
    expect(payload).toMatchObject({
      userId: "user-123",
      detectedPatterns: ["EMAIL"],
    });
    expect(typeof payload.timestamp).toBe("string");
  });

  it("truncates long original messages to 50 chars plus ellipsis", () => {
    const long = "a".repeat(200);
    logContactSharingAttempt("u1", long, ["EMAIL"]);
    const payload = consoleSpy.mock.calls[0][1];
    expect(payload.originalMessage).toBe("a".repeat(50) + "...");
  });

  it("does not append ellipsis for messages 50 chars or shorter", () => {
    const short = "short message";
    logContactSharingAttempt("u1", short, ["EMAIL"]);
    const payload = consoleSpy.mock.calls[0][1];
    expect(payload.originalMessage).toBe(short);
  });
});
