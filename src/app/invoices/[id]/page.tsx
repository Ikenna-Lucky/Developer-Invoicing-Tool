// TODO (Step 4): Build Invoice detail page
export default function InvoiceDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="p-8">
      <h1>Invoice #{params.id}</h1>
      <p className="text-gray-500 mt-2">Invoice detail view coming in Step 4.</p>
    </div>
  );
}
