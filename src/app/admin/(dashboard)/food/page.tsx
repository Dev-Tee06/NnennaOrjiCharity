import { DonationsTable } from '@/components/dashboard/DonationsTable';

export default function FoodDonationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-blackKnight font-heading">Food Donations</h2>
      </div>
      <DonationsTable filterType="food" />
    </div>
  );
}
