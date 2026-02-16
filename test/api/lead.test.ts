import { LeadSchema } from "@/lib/validation/zodSchemas";

describe("LeadSchema validation", () => {
  it("should pass for valid data", () => {
    const valid = LeadSchema.safeParse({
      car_id: "b3b1c2d3-4e5f-6789-0123-456789abcdef",
      name: "Test User",
      email: "test@example.com",
      phone: "1234567890",
      message: "Interested in this car."
    });
    expect(valid.success).toBe(true);
  });

  it("should fail for missing car_id", () => {
    const invalid = LeadSchema.safeParse({
      name: "Test User",
      email: "test@example.com",
      phone: "1234567890"
    });
    expect(invalid.success).toBe(false);
  });
});
