import React from 'react';

import {
  CircularProgress,
  Box,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  Paper,
  TableCell,
  IconButton,
  Collapse,
  Typography,
} from '@mui/material';

import { useState, useEffect } from 'react';




export default function RepackingTable() {
  // const [isLoading, setIsLoading] = useState(false);
  const [dataOrder, setDataOrder] = useState([]);
  // const [update, setUpdate] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [pageInfo, setPageInfo] = useState({});
  const { search } = useLocation();

  const fetchOrderData = async (limit, page, id) => {
    setIsLoading(true);

    const params = new URLSearchParams({ limit, page, id }).toString();
    const data = await getRepackingData(params);

    if (data) {
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
    fetchOrderData(limit, page, id);
  }, [search, update, limit, page]);

  const renderLoading = isLoading ? (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'start',
        padding: '10px',
        borderRadius: 2,
        backgroundColor: 'white',
        marginBottom: 1,
      }}>
      <div className="flex space-x-3 items-center w-full bg-blue-100 p-3 rounded-md">
        <CircularProgress size={20} />
        <p className="text-gray-500 text-sm ">Updating data ...</p>
      </div>
    </Box>
  ) : null;

  const Row = ({ rowData }) => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <TableRow style={{ display: 'flex' }}>
          <TableCell
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              width: '15%',
            }}>
            <div className="text-sm flex h-full flex-col justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <DetailModal id={rowData.idOrder.id_so} />
                  {rowData.idOrder.warning && (
                    <span className="text-red-600 font-semibold">
                      Warning: Overdue
                    </span>
                  )}
                </div>
                <div>
                  {rowData.idOrder.id_po && (
                    <p className="font-semibold">
                      PO : {rowData.idOrder.id_po}
                    </p>
                  )}
                  {rowData.idOrder.paymentDate && (
                    <p>Payment Date : {rowData.idOrder.paymentDate}</p>
                  )}
                  {rowData.idOrder.keterangan && (
                    <p>Note :{rowData.idOrder.keterangan}</p>
                  )}
                </div>
                {rowData.idOrder.notes &&
                  rowData.idOrder.notes.slice(0, 3).map((note, id) => (
                    <div
                      className="flex items-center text-xs justify-between"
                      key={id}>
                      <em className="line-clamp-1 w-14">{note.date}</em>
                      <p className="line-clamp-1">{note.note}</p>
                      <p>{note.sales}</p>
                    </div>
                  ))}
              </div>
              <div className="text-center">
                <IconButton
                  aria-label="expand row"
                  size="small"
                  onClick={() => {
                    setOpen(!open);
                  }}>
                  {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </IconButton>
                <span className="text-xs">Details</span>
              </div>
            </div>
          </TableCell>
          <TableCell
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              width: '17%',
            }}>
            <div className="text-sm">
              <p>{rowData.customer.name}</p>
              <p className="break-words line-clamp-1">
                {rowData.customer.email}
              </p>
              <p>{rowData.customer.phone}</p>
              <p className="line-clamp-3">{rowData.customer.address}</p>
              <em className="line-clamp-1">{rowData.customer.courier}</em>
            </div>
          </TableCell>
          <TableCell
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              width: '28%',
            }}>
            <div className="flex flex-col items-center  space-y-2">
              {rowData.order.slice(0, 3).map((order, id) => {
                return (
                  <div className="text-sm space-y-1" key={id}>
                    <p className="line-clamp-1">{order.name}</p>
                    <div className="flex items-center justify-between font-semibold">
                      <p>{order.variant}</p>
                      <p>{order.qty} pcs</p>
                      <p>
                        IDR{' '}
                        {(order.highestPrice * 2350).toLocaleString('id-ID')}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </TableCell>
          <TableCell
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              width: '20%',
            }}>
            <div className="text-sm space-y-2">
              {rowData.finance.income ? (
                <div className="flex justify-between">
                  <span>Total Income:</span>
                  <span>{rowData.finance.income.toLocaleString('id-ID')}</span>
                </div>
              ) : null}
              {rowData.finance.expense && (
                <div className="flex justify-between">
                  <span>Total Expense:</span>
                  <span>
                    {rowData.finance?.expense.toLocaleString('id-ID')}
                  </span>
                </div>
              )}
              <hr />
              {rowData.finance.percentage && (
                <div className="flex justify-between">
                  <span>Percentage:</span>
                  <span>{rowData.finance.percentage} %</span>
                </div>
              )}
              {rowData.finance.profit && (
                <div className="flex justify-between">
                  <span>Profit:</span>
                  <span
                    className={`${
                      rowData.finance.income >= rowData.finance.expense
                        ? 'text-green-500'
                        : 'text-red-500'
                    } font-semibold`}>
                    {rowData.finance.profit.toLocaleString('id-ID')}
                  </span>
                </div>
              )}
            </div>
          </TableCell>
          <TableCell
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              width: '20%',
            }}>
            <div className="space-y-2 mx-3">
              <RepackingInput
                RowCategory={rowData?.order[0]?.category}
                id_so={rowData.idOrder.id_so}
                id_po={rowData.idOrder.id_po}
                products={rowData.order}
                setUpdate={setUpdate}
                totalQty={rowData.idOrder.totalQty}
                totalBox={rowData.idOrder.totalBox}
              />
              <Notes id={rowData.idOrder.id_so} setUpdate={setUpdate} />
            </div>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <Typography variant="h6" gutterBottom component="div">
                  Detail Product
                </Typography>
                <DetailProductTable
                  dataOrder={rowData.order}
                  link={rowData.idOrder.link}
                  id_so={rowData.idOrder.id_so}
                  notesProduct={rowData.idOrder.notes}
                  data={rowData.idOrder}
                />
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </>
    );
  };

  return (
    <>
      {renderLoading}
      <div className="flex items-center justify-between bg-white p-2 px-3 rounded-md my-2">
        <div className="text-sm font-semibold">
          {pageInfo?.dataInPage
            ? `Showing ${pageInfo?.dataInPage} data of ${pageInfo?.totalData}`
            : null}
        </div>
        <PaginationFilter
          page={page}
          setPage={setPage}
          limit={limit}
          setLimit={setLimit}
          totalPage={pageInfo.totalPage}
        />
      </div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow style={{ display: 'flex' }}>
              <TableCell
                style={{
                  width: '15%',
                }}>
                ID Orders
              </TableCell>
              <TableCell
                style={{
                  width: '17%',
                }}>
                Customer
              </TableCell>
              <TableCell
                style={{
                  width: '28%',
                }}>
                Order
              </TableCell>
              <TableCell
                style={{
                  width: '20%',
                }}>
                Finance
              </TableCell>
              <TableCell
                style={{
                  width: '20%',
                }}>
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dataOrder.length > 0 ? (
              <>
                {dataOrder.map((row, id) => (
                  <Row rowData={row} key={id} />
                ))}

                {dataOrder.length <= 3 && (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      align="center"
                      style={{ height: '50vh' }}></TableCell>
                  </TableRow>
                )}
              </>
            ) : (
              <>
                <TableRow>
                  <TableCell
                    colSpan={5}
                    align="center"
                    style={{ height: '70vh' }}>
                    No data available
                  </TableCell>
                </TableRow>
              </>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
