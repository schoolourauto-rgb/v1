import { CarInsertSchema } from "@/lib/validation/zodSchemas";

describe("CarInsertSchema validation", () => {
  it("should pass for valid data", () => {
    const valid = CarInsertSchema.safeParse({
      make: "Toyota",
      model: "Corolla",
      price: 10000
    });
    expect(valid.success).toBe(true);
  });

  it("should fail for missing make", () => {
    const invalid = CarInsertSchema.safeParse({
      model: "Corolla",
      price: 10000
    });
    expect(invalid.success).toBe(false);
  });
});
