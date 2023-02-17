import { useState, useEffect } from 'react';
import Container from 'components/Layout/Container';
import Navbar from 'components/Layout/Navbar';
import SearchBar from 'components/Layout/SearchBar';
import Sidebar from 'components/Layout/Sidebar';
import SendToIdnTable from 'components/LogisticChina/SendToIdn/SendToIdnTable';
import { getSendToIdnData } from 'service/api';
import SearchModal from 'components/LogisticChina/SendToIdn/SearchModal';
import { useLocation } from 'react-router-dom';
import BtnUploadExcel from 'components/LogisticChina/SendToIdn/BtnUploadExcel';
import ScanBarcode from 'components/LogisticChina/SendToIdn/ScanBarcode';

const SendToIdn = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [dataOrder, setDataOrder] = useState([]);
  const [update, setUpdate] = useState(false);
  const [pageInfo, setPageInfo] = useState({});
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [select, setSelect] = useState('');
  const { search } = useLocation();

  const SUBROUTES = [
    { name: 'Repacking', pathname: '/logistic-china/repacking' },
    { name: 'Send to IDN', pathname: '/logistic-china/send-to-idn' },
    { name: 'Container', pathname: '/logistic-china/container' },
    { name: 'OTW IDN', pathname: '/logistic-china/otw-idn' },
    { name: 'Arrived IDN', pathname: '/logistic-china/arrived-idn' },
  ];

  const fetchOrderData = async (limit, page, select, id) => {
    setIsLoading(true);
    let params = new URLSearchParams({
      limit,
      page,
      filter: select,
      id,
    }).toString();

    const data = await getSendToIdnData(params);
    if (data?.status === 200) {
      const newFormat = [];
      for (let i = 0; i < data.data.data.customer.collection.length; i++) {
        const customer = data.data.data.customer.collection[i];
        const order = data.data.data.orders.collection[i];
        const idOrder = data.data.data.idOrders.collection[i];
        const finance = data.data.data.finance.collection[i];
        newFormat.push({ customer, order, idOrder, finance });
      }
      setDataOrder(newFormat);
      setPageInfo({
        dataInPage: data.data.dataInPage,
        totalData: data.data.totalData,
        totalPage: data.data.totalPage,
      });
    }
    setIsLoading(false);
  };
  useEffect(() => {
    let id = '';
    if (search) {
      const query = new URLSearchParams(search);
      id = query.get('id');
    }
    fetchOrderData(limit, page, select, id);
  }, [search, update, limit, page, select]);

  return (
    <>
      <Navbar />
      <div className='flex bg-gray-200 min-w-full min-h-screen  text-gray-600 '>
        <div className='w-30'>
          <Sidebar routes={SUBROUTES} title='Logistic China' />
        </div>
        <Container>
          <div className='flex items-center justify-between mb-4'>
            <SearchBar />
            <SearchModal
              setDataOrder={setDataOrder}
              setIsLoading={setIsLoading}
              setPageInfo={setPageInfo}
            />
          </div>
          <div className='flex justify-between'>
            <p className='mb-2 bg-white p-2 rounded-md cursor-pointer text-center'>
              Send to IDN
            </p>
            <div className='flex gap-2'>
              <BtnUploadExcel />
              <ScanBarcode />
            </div>
          </div>
          <SendToIdnTable
            isLoading={isLoading}
            page={page}
            pageInfo={pageInfo}
            setPage={setPage}
            limit={limit}
            setLimit={setLimit}
            setUpdate={setUpdate}
            select={select}
            setSelect={setSelect}
            dataOrder={dataOrder}
          />
        </Container>
      </div>
    </>
  );
};

export default SendToIdn;
