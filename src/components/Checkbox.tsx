//Checkbox.tsx
interface checkboxProps {
  checked?: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}

const Checkbox = ({ checked, onChange, label }: checkboxProps) => {
  return (
    <label className="inline-flex items-center space-x-2 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
      />
      <span className="text-gray-700">{label}</span>
      <p></p>
    </label>
  );
};

export default Checkbox;
