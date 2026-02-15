export type DealerWallet = {
  featured_credits: number;
};

export type Dealer = {
  id: string;
  referral_code: string;
  referrals?: { id: string }[];
};
