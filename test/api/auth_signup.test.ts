import { SignupSchema } from "@/lib/validation/zodSchemas";

describe("SignupSchema validation", () => {
  it("should pass for valid data", () => {
    const valid = SignupSchema.safeParse({
      businessName: "Test Dealer",
      ownerName: "Owner Name",
      phone: "1234567890",
      email: "test@dealer.com",
      password: "supersecret123",
      referralCode: null,
      location: "City"
    });
    expect(valid.success).toBe(true);
  });

  it("should fail for missing businessName", () => {
    const invalid = SignupSchema.safeParse({
      ownerName: "Owner Name",
      phone: "1234567890",
      email: "test@dealer.com",
      password: "supersecret123"
    });
    expect(invalid.success).toBe(false);
  });
});
