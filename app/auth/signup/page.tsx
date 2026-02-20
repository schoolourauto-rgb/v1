import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Signup | OurAuto",
  description: "Create your dealer account on OurAuto.",
};

import SignupClient from "./SignupClient";

export default function SignupPage() {
  return <SignupClient />;
}
