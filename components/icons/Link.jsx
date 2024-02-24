
export const Twitter = () => (
  <a className='mr-3 w-10 h-10 btnShadow bg-white opacity-80 hover:bg-white rounded flex justify-center items-center' href='https://twitter.com/InVarFinance' target="_blank" rel="noopener noreferrer">
    <img className="w-[18px]" src="/twitter_1.svg" alt="Logo" />
  </a>
);

export const Discord = () => (
  <a className=' w-[40px] btnShadow bg-white opacity-80 hover:bg-white rounded flex justify-center items-center ' href='https://discord.gg/BrzPWYut4p' target="_blank" rel="noopener noreferrer">
    <img className=" w-[18px]" src="/discord_1.svg" alt="Logo" />
  </a>
);

export const OpenLink = ({ link, children }) => (
  <a className=' text-invar-purple hover:underline' href={link} target="_blank" rel="noopener noreferrer">
    {children}
  </a>
);

export const ButtonMailto = () => (
  <a className=' text-invar-purple hover:underline' href='mailto:info@invar.finance' target="_blank" rel="noopener noreferrer">
    {`info@invar.finance`}
  </a>
);