import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Select from "../ui/Select";
import CommonSelect from "../ui/CommonSelect";

import FormWrapper from "./FormWrapper";
import FormField from "./FormField";
import FormLabel from "./FormLabel";
import FormButtons from "./FormButtons";

const DynamicFormModal = ({
  open,
  title,
  fields = [],
  formData,
  setFormData,
  errors = {},
  onSubmit,
  onCancel,
  submitText = "Save",
}) => {
  const handleChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const renderField = (field) => (
    <FormField key={field.name}>
      <FormLabel required={field.required}>{field.label}</FormLabel>

      {field.type === "commonSelect" ? (
        <CommonSelect
          options={field.options}
          value={formData[field.name]}
          placeholder={field.placeholder}
          onChange={(val) => handleChange(field.name, val)}
          className="w-full"
        />
      ) : field.type === "select" ? (
        <Select
          value={formData[field.name] || ""}
          onChange={(e) => handleChange(field.name, e.target.value)}
          className="w-full border rounded px-3 py-2"
        >
          {field.options?.map((opt) => (
            <option key={opt.value || opt} value={opt.value || opt}>
              {opt.label || opt}
            </option>
          ))}
        </Select>
      ) : (
        <Input
          type={field.type === "number" ? "text" : field.type || "text"}
          inputMode={field.type === "number" ? "numeric" : undefined}
          value={formData[field.name] || ""}
          placeholder={field.placeholder}
          onChange={(e) => {
            let value = e.target.value;

            if (field.type === "number") {
              if (!/^\d*$/.test(value)) return; // allow only digits
            }

            handleChange(field.name, value);
          }}
          className="w-full border rounded px-3 py-2 text-sm"
        />
      )}

      {errors[field.name] && (
        <span className="text-red-500 text-xs mt-1">{errors[field.name]}</span>
      )}
    </FormField>
  );

  return (
    <Modal open={open}>
      <div className="mb-5">
        <h2 className="text-xl font-semibold text-gray-600">{title}</h2>
      </div>

      <FormWrapper onSubmit={onSubmit}>
        {fields.map((group, index) =>
          group.row ? (
            <div key={index} className="grid grid-cols-2 gap-4 mb-4">
              {group.fields.map((field) => renderField(field))}
            </div>
          ) : (
            <div key={index} className="mb-4">
              {renderField(group)}
            </div>
          ),
        )}

        <FormButtons onCancel={onCancel} submitText={submitText} />
      </FormWrapper>
    </Modal>
  );
};

export default DynamicFormModal;
