const DropDown = ({ options, selected, onSelected }) => {

  return (
    <select
      value={selected}
      onChange={(e) => onSelected(e.target.value)}
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}
export default DropDown;