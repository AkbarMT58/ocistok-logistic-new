import { useState, useRef } from 'react';
import Box from '@mui/material/Box';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { IconButton } from '@mui/material';
import Barcode from 'react-barcode';
import ReactToPrint from 'react-to-print';
import { getDataPrintLabelDetails } from '../../../../service/api';
import { LoadingComponentDefault } from '../../../../components/UI/LoadingComponent';
import PrintBarcodeModal from './PrintBarcodeModal';
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  width: 1000,
  height: 600,
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  border: '1px solid lightgray',
  boxShadow: 24,
  borderRadius: '5px',
  p: 4,
};

const options = {
  width: 2,
  height: 80,
  format: 'CODE128',
  displayValue: true,
  fontOptions: '',
  font: 'monospace',
  textAlign: 'center',
  textPosition: 'bottom',
  textMargin: 2,
  fontSize: 20,
  background: '#ffffff',
  lineColor: '#000000',
  margin: 10,
  marginTop: undefined,
  marginBottom: undefined,
  marginLeft: undefined,
  marginRight: undefined,
};

export default function GenerateLabel({ customerData, id_group, id_so }) {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState(null);
  const [isBolean, setIsBolean] = useState({
    isLoadingBarcode: false,
  });

  const handleOpen = async () => {
    const params = id_group ? id_group : id_so;

    setIsBolean({
      isLoadingBarcode: true,
    });

    const response = await getDataPrintLabelDetails(params);
    if (response?.status === 200) {
      setIsBolean({
        isLoadingBarcode: false,
      });
      setData(response?.data);
    } else {
      setIsBolean({
        isLoadingBarcode: false,
      });
    }

    setOpen(true);
  };
  const handleClose = () => setOpen(false);
  let componentRef = useRef();

  return (
    <div>
      <LoadingComponentDefault
        textLoading={'Loading . . .'}
        setIsLoading={isBolean?.isLoadingBarcode}>
        <button
          className="py-2 px-5 border text-blue-500  text-sm border-blue-500 rounded-md w-full"
          onClick={handleOpen}>
          Barcode
        </button>
      </LoadingComponentDefault>

      <PrintBarcodeModal
        customerData={customerData}
        id_group={id_group}
        id_so={id_so}
        open={open}
        handleClose={handleClose}
        data={data}
        isBolean={isBolean}
      />
    </div>
  );
}
