import { createContext, useState } from "react";

const ModalContext = createContext({
  propertyModal: false,
  setPropertyModal: () => {},
  passNFTModal: false,
  setPassNFTModal: () => {},
  premintModal: false,
  setPremintModal: () => {},
  passBuyModal: false,
  setPassBuyModal: () => {},
});
const { Provider } = ModalContext;

const ModalsProvider = ({ children }) => {
  const [propertyModal, setPropertyModal] = useState(false);
  const [passNFTModal, setPassNFTModal] = useState(false);
  const [premintModal, setPremintModal] = useState(false);
  const [passBuyModal, setPassBuyModal] = useState(false);

  const obj = {
    propertyModal,
    setPropertyModal: (val) => setPropertyModal(val),
    passNFTModal,
    setPassNFTModal: (val) => setPassNFTModal(val),
    premintModal,
    setPremintModal: (val) => setPremintModal(val),
    passBuyModal,
    setPassBuyModal: (val) => setPassBuyModal(val),
  };

  return <Provider value={obj}>{children}</Provider>;
};

export { ModalContext, ModalsProvider };
