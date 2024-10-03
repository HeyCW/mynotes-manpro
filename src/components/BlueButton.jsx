const BlueButton = ({ width, handleClick, children }) => {
  return <button className={`${width} bg-blue-500 hover:bg-blue-600 mt-4 md:mt-0 p-3 rounded-lg text-white md:font-bold`} onClick={handleClick}>{children}</button>;
}

export default BlueButton;