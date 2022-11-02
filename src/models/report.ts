export type Report = {
  id: string;
  name: string;
  visits: number;
  clicks: number;
  cost: number;
  revenue: number;
  profit: number; // revenue - cost
  roi: number; // profit / cost in %
  ctr: number; // clicks / visits in %
  cpv: number; // cost / visits in $
  epv: number; // revenue / visits in $
  epc: number; // revenue / clicks in $
};
