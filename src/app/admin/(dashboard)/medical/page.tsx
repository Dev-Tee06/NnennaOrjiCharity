import { DonationsTable } from '@/components/dashboard/DonationsTable';

export default function MedicalDonationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-blackKnight font-heading">Medical Supply Donations</h2>
      </div>
      <DonationsTable filterType="medical_supply" />
    </div>
  );
}
