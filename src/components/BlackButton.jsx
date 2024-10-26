const BlueButton = ({ width, handleClick, children }) => {
    return <button className={`${width} bg-black hover:bg-white mt-4 md:mt-0 p-3 rounded-lg text-white md:font-bold hover:text-black`} onClick={handleClick}>{children}</button>;
  }
  
  export default BlueButton;