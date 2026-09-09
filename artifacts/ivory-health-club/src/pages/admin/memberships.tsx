import { useState } from "react";
import {
  getListMembershipPlansQueryKey,
  useCreateMembershipPlan,
  useGetMembershipBreakdown,
  useListMembershipPlans,
  useUpdateMembershipPlan,
  type MembershipPlan,
} from "@workspace/api-client-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Pencil, Plus } from "lucide-react";

type PlanFormState = {
  name: string;
  tier: string;
  price: string;
  pricePeriod: "monthly" | "annual";
  description: string;
  perks: string;
  discounts: string;
  maxMembers: string;
};

const emptyPlanForm: PlanFormState = {
  name: "",
  tier: "",
  price: "",
  pricePeriod: "monthly",
  description: "",
  perks: "",
  discounts: "",
  maxMembers: "",
};

export default function AdminMemberships() {
  const { data: breakdown, isLoading } = useGetMembershipBreakdown();
  const { data: plans, isLoading: plansLoading, isError: plansError } = useListMembershipPlans();
  const createPlan = useCreateMembershipPlan();
  const updatePlan = useUpdateMembershipPlan();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<MembershipPlan | null>(null);
  const [form, setForm] = useState<PlanFormState>(emptyPlanForm);

  const COLORS = ['#29166F', '#4A329A', '#F8C301', '#FFD54A', '#140A3A', '#8b5cf6', '#d946ef'];
  const isPending = createPlan.isPending || updatePlan.isPending;

  const updateForm = (field: keyof PlanFormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const openAddPlan = () => {
    setEditingPlan(null);
    setForm(emptyPlanForm);
    setDialogOpen(true);
  };

  const openEditPlan = (plan: MembershipPlan) => {
    setEditingPlan(plan);
    setForm({
      name: plan.name,
      tier: plan.tier,
      price: String(plan.price),
      pricePeriod: plan.pricePeriod === "annual" ? "annual" : "monthly",
      description: plan.description,
      perks: plan.perks.join("\n"),
      discounts: plan.discounts ?? "",
      maxMembers: plan.maxMembers ? String(plan.maxMembers) : "",
    });
    setDialogOpen(true);
  };

  const closeDialog = () => {
    if (isPending) return;
    setDialogOpen(false);
    setEditingPlan(null);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const price = Number(form.price);

    if (!Number.isFinite(price) || price < 0) {
      toast({ title: "Enter a valid price", variant: "destructive" });
      return;
    }

    if (editingPlan) {
      updatePlan.mutate(
        {
          id: editingPlan.id,
          data: { price, pricePeriod: form.pricePeriod },
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getListMembershipPlansQueryKey() });
            toast({ title: "Plan price updated" });
            closeDialog();
          },
          onError: () => toast({ title: "Could not update plan price", variant: "destructive" }),
        },
      );
      return;
    }

    if (!form.name.trim() || !form.tier.trim()) {
      toast({ title: "Add a plan name and tier", variant: "destructive" });
      return;
    }

    createPlan.mutate(
      {
        data: {
          name: form.name.trim(),
          tier: form.tier.trim(),
          price,
          pricePeriod: form.pricePeriod,
          description: form.description.trim() || undefined,
          perks: form.perks
            .split("\n")
            .map((perk) => perk.trim())
            .filter(Boolean),
          discounts: form.discounts.trim() || undefined,
          maxMembers: form.maxMembers ? Number(form.maxMembers) : undefined,
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListMembershipPlansQueryKey() });
          toast({ title: "Membership plan added" });
          closeDialog();
        },
        onError: (error) => {
          toast({
            title: "Could not add membership plan",
            description: error instanceof Error ? error.message : "A plan with this tier may already exist.",
            variant: "destructive",
          });
        },
      },
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-serif font-bold text-secondary">Membership Analytics</h1>
        <Button onClick={openAddPlan} className="bg-secondary text-white hover:bg-primary hover:text-secondary">
          <Plus /> Add plan
        </Button>
      </div>

      <section className="rounded-md border border-gray-100 bg-white p-6 shadow-sm">
        <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-xl font-bold text-secondary">Plan prices</h2>
            <p className="mt-1 text-sm text-gray-500">Changes here update the prices shown on the public Membership page.</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="border-b border-gray-100 bg-gray-50 text-xs font-medium uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3">Plan</th>
                <th className="px-4 py-3">Tier</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Billing</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {plansLoading ? (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-500">Loading plans...</td></tr>
              ) : plansError ? (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-red-600">Plans could not be loaded.</td></tr>
              ) : !plans?.length ? (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-500">No membership plans found.</td></tr>
              ) : (
                plans.map((plan) => (
                  <tr key={plan.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{plan.name}</td>
                    <td className="px-4 py-3 text-xs uppercase text-gray-500">{plan.tier.replace(/_/g, " ")}</td>
                    <td className="px-4 py-3 font-bold text-secondary">₦{plan.price.toLocaleString("en-NG")}</td>
                    <td className="px-4 py-3 capitalize text-gray-500">{plan.pricePeriod}</td>
                    <td className="px-4 py-3 text-right">
                      <Button size="sm" variant="outline" onClick={() => openEditPlan(plan)}>
                        <Pencil /> Edit price
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-md shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-secondary mb-6">Plan Distribution</h2>
          
          {isLoading ? (
            <div className="h-[300px] flex items-center justify-center text-gray-500">Loading chart...</div>
          ) : !breakdown || breakdown.length === 0 ? (
            <div className="h-[300px] flex items-center justify-center text-gray-500">No data available</div>
          ) : (
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={breakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={2}
                    dataKey="count"
                    nameKey="planName"
                  >
                    {breakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [`${value} members`, 'Count']}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-md shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-secondary mb-6">Data Table</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-500 uppercase font-medium border-b border-gray-100">
                <tr>
                  <th className="px-4 py-3">Plan Name</th>
                  <th className="px-4 py-3">Tier</th>
                  <th className="px-4 py-3 text-right">Member Count</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  <tr><td colSpan={3} className="text-center py-4">Loading...</td></tr>
                ) : breakdown?.map((item, i) => (
                  <tr key={i}>
                    <td className="px-4 py-3 font-medium text-gray-900">{item.planName}</td>
                    <td className="px-4 py-3 text-gray-500 uppercase text-xs">{item.tier.replace('_', ' ')}</td>
                    <td className="px-4 py-3 text-right font-bold text-secondary">{item.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={(open) => open ? setDialogOpen(true) : closeDialog()}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl text-secondary">
              {editingPlan ? "Edit plan price" : "Add membership plan"}
            </DialogTitle>
            <DialogDescription>
              {editingPlan
                ? "Update the price and billing period shown to members."
                : "Add a plan and its price to the membership catalogue."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!editingPlan && (
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2 text-sm font-medium text-secondary">
                  <span>Plan name</span>
                  <Input value={form.name} onChange={(event) => updateForm("name", event.target.value)} placeholder="e.g. Platinum Single" required maxLength={120} disabled={isPending} />
                </label>
                <label className="space-y-2 text-sm font-medium text-secondary">
                  <span>Tier key</span>
                  <Input value={form.tier} onChange={(event) => updateForm("tier", event.target.value)} placeholder="e.g. platinum_single" required maxLength={60} disabled={isPending} />
                </label>
              </div>
            )}
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-sm font-medium text-secondary">
                <span>Price (₦)</span>
                <Input type="number" min="0" step="0.01" value={form.price} onChange={(event) => updateForm("price", event.target.value)} placeholder="300000" required disabled={isPending} />
              </label>
              <label className="space-y-2 text-sm font-medium text-secondary">
                <span>Billing period</span>
                <select value={form.pricePeriod} onChange={(event) => updateForm("pricePeriod", event.target.value)} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring" disabled={isPending}>
                  <option value="monthly">Monthly</option>
                  <option value="annual">Annual</option>
                </select>
              </label>
            </div>
            {!editingPlan && (
              <>
                <label className="block space-y-2 text-sm font-medium text-secondary">
                  <span>Description <span className="font-normal text-gray-400">(optional)</span></span>
                  <Textarea value={form.description} onChange={(event) => updateForm("description", event.target.value)} placeholder="Describe this membership plan" maxLength={500} rows={3} disabled={isPending} />
                </label>
                <label className="block space-y-2 text-sm font-medium text-secondary">
                  <span>Perks <span className="font-normal text-gray-400">(one per line, optional)</span></span>
                  <Textarea value={form.perks} onChange={(event) => updateForm("perks", event.target.value)} placeholder={"Gym\nSwimming\nSauna"} rows={3} disabled={isPending} />
                </label>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="space-y-2 text-sm font-medium text-secondary">
                    <span>Discounts <span className="font-normal text-gray-400">(optional)</span></span>
                    <Input value={form.discounts} onChange={(event) => updateForm("discounts", event.target.value)} placeholder="10% off events" maxLength={255} disabled={isPending} />
                  </label>
                  <label className="space-y-2 text-sm font-medium text-secondary">
                    <span>Maximum members <span className="font-normal text-gray-400">(optional)</span></span>
                    <Input type="number" min="1" step="1" value={form.maxMembers} onChange={(event) => updateForm("maxMembers", event.target.value)} placeholder="1" disabled={isPending} />
                  </label>
                </div>
              </>
            )}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeDialog} disabled={isPending}>Cancel</Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Saving..." : editingPlan ? "Save price" : "Add plan"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
