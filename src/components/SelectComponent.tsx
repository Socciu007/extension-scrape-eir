const SelectComponent = ({
  options,
  id,
  onChange,
  label,
}: {
  options: string[];
  id: string;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  label: string;
}) => {
  return (
    <div className="flex gap-2">
      <label htmlFor={id}>{label}</label>
      <select id={id} onChange={onChange}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectComponent;
