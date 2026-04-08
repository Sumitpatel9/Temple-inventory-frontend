import Button from "../ui/Button";
import { Pencil, Trash } from "lucide-react";

export default function TableActions({
  row,
  onEdit,
  onDelete,
  showDelete = true,
  showEdit = true,
}) {
  return (
    <div className="flex gap-2">
      {showEdit && (
      <Button
        type="button"
        variant="outline"
        className="p-1.5"
        onClick={() => onEdit && onEdit(row)}
      >
        <Pencil size={16} className="text-gray-600" />
      </Button>
      )}

      {showDelete && (
        <Button
          type="button"
          variant="danger"
          className="p-1.5"
          onClick={() => onDelete && onDelete(row)}
        >
          <Trash size={16} />
        </Button>
      )}
    </div>
  );
}
