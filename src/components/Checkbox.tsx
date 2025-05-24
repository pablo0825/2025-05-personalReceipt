interface checkboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const Checkbox = ({ checked, onChange }: checkboxProps) => {
  return (
    <div className="flex space-x-4 pb-2">
      {["所得類別", "受領事由", "金額"].map((item) => (
        <label
          key={item}
          className="inline-flex items-center space-x-2 cursor-pointer"
        >
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-gray-700">{item}</span>
        </label>
      ))}
    </div>
  );
};

export default Checkbox;
