// Invoice detail page built in Step 4
export default function InvoiceDetailPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Invoice #{params.id}</h1>
      <p className="text-sm text-gray-500">Invoice detail view coming in Step 4.</p>
    </div>
  );
}
