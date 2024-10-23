const DropDown = ({ options, selected, onSelected, style="" }) => {

  return (
    <select
      value={selected}
      onChange={(e) => onSelected(e.target.value)}
      className={style}
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