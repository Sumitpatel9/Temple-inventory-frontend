import StatusBadge from "../../../conponents/ui/StatusBadge";

const StockHeader = ({ productData, onBack }) => {
  return (
    <div className="bg-white rounded shadow p-4 mb-4">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold">
            {productData?.productName || "-"}
          </h2>
          <StatusBadge status={productData?.status} />{" "}
          <p className="inline-block px-2 py-1 text-xs font-semibold rounded bg-blue-100 text-blue-700">
            {productData?.category || "-"}
          </p>
        </div>

        <button
          onClick={onBack}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-1 rounded cursor-pointer"
        >
          Back
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 text-sm">
        <div>
          <p className="text-gray-500">Warehouse reck</p>
          <p className="font-medium">{productData?.warehouseReck || "-"}</p>
        </div>

        <div>
          <p className="text-gray-500">Min Stock</p>
          <p className="font-medium">
            {productData?.minQty || 0} {productData?.uom}
          </p>
        </div>

        <div>
          <p className="text-gray-500">Available Stock</p>
          <p className="font-semibold text-orange-600">
            {productData?.currentStock || 0} {productData?.uom}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StockHeader;
